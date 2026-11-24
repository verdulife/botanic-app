import { json } from "@sveltejs/kit";
import { createHash } from "node:crypto";
import { env } from "$env/dynamic/private";
import { supabase } from "$lib/supabase";
import { confirmationHtml, confirmationText } from "$lib/emails/confirmation";
import { adminNotifyHtml, adminNotifyText } from "$lib/emails/adminNotify";
import type { RequestHandler } from "./$types";

const FROM = "Botanic <hola@botanicapp.es>";
const REPLY_TO = "botanictheapp@gmail.com";
const RESEND_EMAILS_URL = "https://api.resend.com/emails";
const RESEND_CONTACTS_URL = "https://api.resend.com/audiences";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIST_UNSUBSCRIBE_HEADERS = {
	"List-Unsubscribe": "<mailto:unsubscribe@botanicapp.es>",
	"List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
} as const;

// En serverless no hay memoria compartida, así que el contador vive en la base de
// datos. La clave es la IP hasheada: nunca se guarda en claro.
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_SECONDS = 3600;

function rateKey(ip: string): string {
	return createHash("sha256").update(`waitlist:${ip}`).digest("hex");
}

async function withinRateLimit(ip: string): Promise<boolean> {
	try {
		const { data, error } = await supabase.rpc("check_rate_limit", {
			p_key: rateKey(ip),
			p_limit: RATE_LIMIT_MAX,
			p_window_seconds: RATE_LIMIT_WINDOW_SECONDS,
		});
		if (error) throw error;
		return data !== false;
	} catch (err) {
		// Es una defensa, no un requisito del servicio: si falla, el alta pasa.
		console.warn("[waitlist] rate limit no disponible:", err);
		return true;
	}
}

async function sendConfirmation(email: string) {
	await sendResend(
		{
			from: FROM,
			replyTo: [REPLY_TO],
			to: [email],
			subject: "¡Gracias por apuntarte a la lista de espera de Botanic!",
			html: confirmationHtml(),
			text: confirmationText(),
			headers: LIST_UNSUBSCRIBE_HEADERS,
		},
		RESEND_EMAILS_URL
	);
}

async function sendAdminNotification(email: string, now: string, total: number) {
	const recipients = (env.ADMIN_NOTIFY_EMAIL ?? "")
		.split(",")
		.map((addr) => addr.trim())
		.filter(Boolean);
	if (recipients.length === 0) return;

	for (const recipient of recipients) {
		await sendResend(
			{
				from: FROM,
				replyTo: [REPLY_TO],
				to: [recipient],
				subject: "Nueva alta en la lista de espera",
				html: adminNotifyHtml(email, now, total),
				text: adminNotifyText(email, now, total),
				headers: LIST_UNSUBSCRIBE_HEADERS,
			},
			RESEND_EMAILS_URL
		);
	}
}

async function getWaitlistTotal(): Promise<number> {
	try {
		const { data } = await supabase
			.from("waitlist_count")
			.select("total")
			.single();
		return (data as { total: number } | null)?.total ?? 0;
	} catch (err) {
		console.warn("[waitlist] Error al obtener total:", err);
		return 0;
	}
}

async function getWaitlistPosition(token: string): Promise<number | null> {
	try {
		const { data, error } = await supabase.rpc("get_waitlist_position", {
			target_token: token,
		});
		if (error) throw error;
		return typeof data === "number" ? data : null;
	} catch (err) {
		console.warn("[waitlist] Error al obtener posición:", err);
		return null;
	}
}

async function sendResend(payload: Record<string, unknown>, url: string) {
	const key = env.RESEND_API_KEY?.trim();
	if (!key) {
		console.warn("[waitlist] RESEND_API_KEY no configurada; email omitido");
		return;
	}
	const res = await fetch(url, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${key}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});
	if (!res.ok) {
		console.error("[waitlist] Resend error", res.status, await res.text().catch(() => ""));
	}
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
	const secret = env.TURNSTILE_SECRET_KEY?.trim();
	// Sin clave configurada no se bloquea: el formulario tiene que poder probarse
	// en local con un entorno a medias.
	if (!secret) return true;
	if (!token) return false;

	try {
		const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
			method: "POST",
			body: new URLSearchParams({ secret, response: token, remoteip: ip }),
		});
		const data = (await res.json()) as { success?: boolean } | null;
		return data?.success === true;
	} catch (err) {
		console.error("[waitlist] turnstile error", err);
		return false;
	}
}

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	const ip = getClientAddress();
	let email: string;
	let consent: boolean;
	let turnstileToken: string;
	try {
		const body = (await request.json()) as {
			email?: unknown;
			consent?: unknown;
			turnstileToken?: unknown;
		};
		email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
		consent = body.consent === true;
		turnstileToken = typeof body.turnstileToken === "string" ? body.turnstileToken : "";
	} catch {
		return json({ error: "Cuerpo inválido" }, { status: 400 });
	}

	if (!EMAIL_RE.test(email) || email.length > 320) {
		return json({ error: "Email inválido" }, { status: 400 });
	}

	if (!consent) {
		return json({ error: "Debes aceptar la Política de Privacidad y el Aviso Legal" }, { status: 400 });
	}

	if (!(await withinRateLimit(ip))) {
		return json(
			{ error: "Demasiados intentos. Espera unos minutos antes de volver a probar." },
			{ status: 429 }
		);
	}

	if (!(await verifyTurnstile(turnstileToken, ip))) {
		return json(
			{ error: "No hemos podido verificar que no eres un robot. Recarga e inténtalo de nuevo." },
			{ status: 400 }
		);
	}

	// El alta la hace una función del servidor: el rol anónimo no puede leer la
	// tabla, y `insert ... select` necesitaría hacerlo. Devuelve el testigo solo
	// cuando la fila es nueva; si el correo ya estaba no devuelve nada, así que la
	// respuesta es idéntica en ambos casos.
	const { data, error } = await supabase.rpc("join_waitlist", { p_email: email });
	if (error) {
		console.error("[waitlist] join error", error);
		return json({ error: "Error al guardar" }, { status: 500 });
	}

	const created = (data as { wait_position: number; token: string }[] | null)?.[0] ?? null;
	if (!created) {
		return json({ ok: true });
	}

	const now = new Date().toISOString();

	await sendConfirmation(email);

	await sendAdminNotification(email, now, await getWaitlistTotal());

	if (env.RESEND_AUDIENCE_ID?.trim()) {
		await sendResend(
			{ email },
			`${RESEND_CONTACTS_URL}/${env.RESEND_AUDIENCE_ID.trim()}/contacts`
		);
	}

	return json({ ok: true, position: created.wait_position, token: created.token });
};