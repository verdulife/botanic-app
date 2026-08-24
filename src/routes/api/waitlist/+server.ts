import { json } from "@sveltejs/kit";
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

async function getWaitlistPosition(email: string): Promise<number | null> {
	try {
		const { data, error } = await supabase.rpc("get_waitlist_position", {
			target_email: email,
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

export const POST: RequestHandler = async ({ request }) => {
	let email: string;
	let consent: boolean;
	try {
		const body = (await request.json()) as { email?: unknown; consent?: unknown };
		email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
		consent = body.consent === true;
	} catch {
		return json({ error: "Cuerpo inválido" }, { status: 400 });
	}

	if (!EMAIL_RE.test(email) || email.length > 320) {
		return json({ error: "Email inválido" }, { status: 400 });
	}

	if (!consent) {
		return json({ error: "Debes aceptar la Política de Privacidad y el Aviso Legal" }, { status: 400 });
	}

	const { error } = await supabase.from("waitlist").insert({ email });
	if (error) {
		if (error.code === "23505") {
			const position = await getWaitlistPosition(email);
			return json({ ok: true, alreadyRegistered: true, position });
		}
		console.error("[waitlist] insert error", error);
		return json({ error: "Error al guardar" }, { status: 500 });
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

	const position = await getWaitlistPosition(email);
	return json({ ok: true, position });
};