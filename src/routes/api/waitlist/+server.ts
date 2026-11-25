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

// La clave del límite es la IP hasheada con una sal secreta: nunca se guarda en
// claro y nadie puede calcular la de otra persona. El límite y la ventana viven
// dentro del alta, no aquí: una función pública con esos argumentos sería un
// endpoint que cualquiera podría torcer.
function rateKey(ip: string): string {
	const salt = env.RATE_LIMIT_SALT ?? "";
	return createHash("sha256").update(`waitlist:${salt}:${ip}`).digest("hex");
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

// Turnstile: el testigo se verifica en servidor y además se comprueban la acción
// y el hostname. Sin esas dos comprobaciones, un testigo obtenido en otro sitio
// —o en otro formulario— valdría aquí, que es media protección.
const TURNSTILE_ACTION = "waitlist";

function allowedHostnames(): Set<string> {
	return new Set(
		(env.TURNSTILE_HOSTNAMES ?? "")
			.split(",")
			.map((h) => h.trim())
			.filter(Boolean)
	);
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
	// Acepta el nombre canónico de Cloudflare y el que ya estaba en el proyecto.
	const secret = (env.TURNSTILE_SECRET ?? env.TURNSTILE_SECRET_KEY)?.trim();
	// Sin clave configurada no se bloquea: el formulario tiene que poder probarse
	// en local con un entorno a medias.
	if (!secret) return true;
	if (!token || token.length > 2048) return false;

	const hostnames = allowedHostnames();

	try {
		const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
			method: "POST",
			signal: AbortSignal.timeout(10_000),
			body: new URLSearchParams({ secret, response: token, remoteip: ip }),
		});
		if (!res.ok) return false;
		const data = (await res.json()) as {
			success?: boolean;
			action?: string;
			hostname?: string;
		} | null;
		if (data?.success !== true) return false;
		if (data.action !== TURNSTILE_ACTION) return false;
		// En local no se declara lista: se valida solo si está configurada.
		if (hostnames.size > 0 && !hostnames.has(data.hostname ?? "")) return false;
		return true;
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
	// El límite de intentos lo aplica la propia función del alta: un único punto
	// público, sin argumentos que el llamante pueda torcer.
	const { data, error } = await supabase.rpc("join_waitlist", {
		p_email: email,
		p_rate_key: rateKey(ip),
	});
	if (error) {
		if (error.code === "P0001" || error.message?.includes("rate_limited")) {
			return json(
				{ error: "Demasiados intentos. Espera unos minutos antes de volver a probar." },
				{ status: 429 }
			);
		}
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