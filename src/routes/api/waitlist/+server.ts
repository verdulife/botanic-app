import { json } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import { createClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_URL } from "$env/static/public";
import { supabase } from "$lib/supabase";
import { confirmationHtml, confirmationText } from "$lib/emails/confirmation";
import { adminNotifyHtml, adminNotifyText, type WaitlistSummary } from "$lib/emails/adminNotify";
import type { RequestHandler } from "./$types";

const FROM = "Botanic <no-reply@botanicapp.es>";
const RESEND_EMAILS_URL = "https://api.resend.com/emails";
const RESEND_CONTACTS_URL = "https://api.resend.com/audiences";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SPAIN_UTC_OFFSET_MS = 2 * 60 * 60 * 1000;

async function sendConfirmation(email: string) {
	await sendResend(
		{
			from: FROM,
			to: [email],
			subject: "¡Gracias por apuntarte a la waitlist de Botanic!",
			html: confirmationHtml(),
			text: confirmationText(),
		},
		RESEND_EMAILS_URL
	);
}

async function sendAdminNotification(
	email: string,
	now: string,
	summary: WaitlistSummary | null
) {
	const recipients = (env.ADMIN_NOTIFY_EMAIL ?? "")
		.split(",")
		.map((addr) => addr.trim())
		.filter(Boolean);
	if (recipients.length === 0) return;

	for (const recipient of recipients) {
		await sendResend(
			{
				from: FROM,
				to: [recipient],
				subject: "Nuevo en la waitlist",
				html: adminNotifyHtml(email, now, summary),
				text: adminNotifyText(email, now, summary),
			},
			RESEND_EMAILS_URL
		);
	}
}

async function getWaitlistSummary(): Promise<WaitlistSummary | null> {
	const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY?.trim();
	if (!serviceKey) {
		console.warn("[waitlist] SUPABASE_SERVICE_ROLE_KEY no configurada; sin resumen");
		return null;
	}
	const admin = createClient(PUBLIC_SUPABASE_URL, serviceKey, { auth: { persistSession: false } });

	const startOfTodaySpain = new Date();
	startOfTodaySpain.setHours(0, 0, 0, 0);
	const startUtc = new Date(startOfTodaySpain.getTime() - SPAIN_UTC_OFFSET_MS).toISOString();

	try {
		const [{ count: total } = {}, { count: today } = {}, { data: recent } = {}] =
			await Promise.all([
				admin.from("waitlist").select("email", { count: "exact", head: true }),
				admin
					.from("waitlist")
					.select("email", { count: "exact", head: true })
					.gte("created_at", startUtc),
				admin
					.from("waitlist")
					.select("email, created_at")
					.order("created_at", { ascending: false })
					.limit(5),
			]);

		return {
			total: total ?? 0,
			today: today ?? 0,
			recent: (recent ?? []).map((r) => ({ email: r.email, created_at: r.created_at })),
		};
	} catch (err) {
		console.warn("[waitlist] Error al obtener resumen:", err);
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
	try {
		const body = (await request.json()) as { email?: unknown };
		email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
	} catch {
		return json({ error: "Cuerpo inválido" }, { status: 400 });
	}

	if (!EMAIL_RE.test(email) || email.length > 320) {
		return json({ error: "Email inválido" }, { status: 400 });
	}

	const { error } = await supabase.from("waitlist").insert({ email });
	if (error) {
		if (error.code === "23505") {
			return json({ ok: true, alreadyRegistered: true });
		}
		console.error("[waitlist] insert error", error);
		return json({ error: "Error al guardar" }, { status: 500 });
	}

	const now = new Date().toISOString();

	await sendConfirmation(email);

	await sendAdminNotification(email, now, await getWaitlistSummary());

	if (env.RESEND_AUDIENCE_ID?.trim()) {
		await sendResend(
			{ email },
			`${RESEND_CONTACTS_URL}/${env.RESEND_AUDIENCE_ID.trim()}/contacts`
		);
	}

	return json({ ok: true });
};