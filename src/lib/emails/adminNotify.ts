import { emailLayout, escapeHtml, EMAIL_COLORS, EMAIL_FONT } from "./layout";

export function adminNotifyHtml(email: string, date: string, total: number): string {
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
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px 0;">
<tr>
<td style="font-family:${EMAIL_FONT};font-size:14px;line-height:21px;color:${EMAIL_COLORS.muted};padding-bottom:4px;text-align:center;">Fecha</td>
</tr>
<tr>
<td style="font-family:${EMAIL_FONT};font-size:16px;line-height:24px;color:${EMAIL_COLORS.ink};text-align:center;">${escapeHtml(date)}</td>
</tr>
</table>
<div style="margin:8px 0 0 0;padding:16px;background-color:${EMAIL_COLORS.tint};border-radius:12px;">
<p style="margin:0;font-family:${EMAIL_FONT};font-size:16px;line-height:22px;color:${accentDark};font-weight:bold;text-align:center;">🌿 Estado de la waitlist</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:8px;">
<tr>
<td style="font-family:${EMAIL_FONT};font-size:13px;line-height:18px;color:${EMAIL_COLORS.muted};text-align:center;display:block;">Total</td>
</tr>
<tr>
<td style="font-family:${EMAIL_FONT};font-size:24px;line-height:28px;color:${accentDark};font-weight:bold;text-align:center;">${total}</td>
</tr>
</table>
</div>`;

	return emailLayout(`Nuevo apunte en la waitlist: ${email}`, body);
}

export function adminNotifyText(email: string, date: string, total: number): string {
	return `Nuevo apunte en la waitlist: ${email}\nFecha: ${date}\n\nEstado de la waitlist:\nTotal: ${total}`;
}