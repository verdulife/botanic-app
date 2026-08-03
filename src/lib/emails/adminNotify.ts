import { emailLayout, escapeHtml, EMAIL_COLORS, EMAIL_FONT } from "./layout";

export interface WaitlistSummary {
	total: number;
	today: number;
	recent: { email: string; created_at: string | null }[];
}

function formatDate(iso: string | null): string {
	if (!iso) return "—";
	return new Date(iso).toLocaleString("es-ES", {
		day: "2-digit",
		month: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function summarySectionHtml(summary: WaitlistSummary): string {
	const { accentDark, muted, ink } = EMAIL_COLORS;
	const stats =
		'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">' +
		"<tr>" +
		'<td style="width:50%;text-align:center;"><span style="font-family:' +
		EMAIL_FONT +
		`;font-size:13px;line-height:18px;color:${muted};display:block;">Total</span><span style="font-family:` +
		EMAIL_FONT +
		`;font-size:20px;line-height:24px;color:${accentDark};font-weight:bold;">${summary.total}</span></td>` +
		'<td style="width:50%;text-align:center;"><span style="font-family:' +
		EMAIL_FONT +
		`;font-size:13px;line-height:18px;color:${muted};display:block;">Apuntes hoy</span><span style="font-family:` +
		EMAIL_FONT +
		`;font-size:20px;line-height:24px;color:${accentDark};font-weight:bold;">${summary.today}</span></td>` +
		"</tr>" +
		"</table>";

	let rows = "";
	for (const r of summary.recent) {
		rows += `<tr><td style="font-family:${EMAIL_FONT};font-size:14px;line-height:21px;color:${ink};padding:8px 4px;border-bottom:1px solid ${EMAIL_COLORS.border};">${escapeHtml(r.email)}</td><td align="right" style="font-family:${EMAIL_FONT};font-size:14px;line-height:21px;color:${muted};padding:8px 4px;border-bottom:1px solid ${EMAIL_COLORS.border};white-space:nowrap;">${escapeHtml(formatDate(r.created_at))}</td></tr>`;
	}
	if (summary.recent.length === 0) {
		rows = `<tr><td align="center" style="padding:8px 4px;font-family:${EMAIL_FONT};font-size:14px;line-height:21px;color:${muted};">Sin apuntes todavía.</td></tr>`;
	}

	return `<div style="margin:24px 0 0 0;padding:16px;background-color:${EMAIL_COLORS.tint};border-radius:12px;">
<p style="margin:0 0 16px 0;font-family:${EMAIL_FONT};font-size:16px;line-height:22px;color:${accentDark};font-weight:bold;text-align:center;">🌿 Estado de la waitlist</p>
${stats}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px;">
<tr>
<td style="font-family:${EMAIL_FONT};font-size:12px;line-height:18px;color:${muted};text-transform:uppercase;letter-spacing:0.05em;padding:0 4px 8px 4px;">Últimas altas</td>
</tr>
${rows}
</table>
</div>`;
}

export function adminNotifyHtml(
	email: string,
	date: string,
	summary: WaitlistSummary | null
): string {
	const { accentDark } = EMAIL_COLORS;
	const body = `
<h1 style="margin:0 0 16px 0;font-family:${EMAIL_FONT};font-size:22px;line-height:30px;color:${accentDark};text-align:center;">🌱 Nuevo en la waitlist</h1>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 8px 0;">
<tr>
<td style="font-family:${EMAIL_FONT};font-size:14px;line-height:21px;color:${EMAIL_COLORS.muted};padding-bottom:4px;text-align:center;">Email</td>
</tr>
<tr>
<td style="font-family:${EMAIL_FONT};font-size:16px;line-height:24px;color:${EMAIL_COLORS.ink};text-align:center;">${escapeHtml(email)}</td>
</tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="font-family:${EMAIL_FONT};font-size:14px;line-height:21px;color:${EMAIL_COLORS.muted};padding-bottom:4px;text-align:center;">Fecha</td>
</tr>
<tr>
<td style="font-family:${EMAIL_FONT};font-size:16px;line-height:24px;color:${EMAIL_COLORS.ink};text-align:center;">${escapeHtml(date)}</td>
</tr>
</table>
${summary ? summarySectionHtml(summary) : ""}`;

	return emailLayout(`Nuevo apunte en la waitlist: ${email}`, body);
}

export function adminNotifyText(
	email: string,
	date: string,
	summary: WaitlistSummary | null
): string {
	let out = `Nuevo apunte en la waitlist: ${email}\nFecha: ${date}`;
	if (summary) {
		out += `\n\nEstado de la waitlist:\nTotal: ${summary.total}\nApuntes hoy: ${summary.today}\nÚltimas altas:`;
		for (const r of summary.recent) {
			out += `\n- ${r.email} (${formatDate(r.created_at)})`;
		}
	}
	return out;
}