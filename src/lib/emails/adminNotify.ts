import { emailLayout, escapeHtml, EMAIL_COLORS, EMAIL_FONT } from "./layout";

export function adminNotifyHtml(email: string, date: string): string {
	const { accentDark } = EMAIL_COLORS;
	const body = `
<h1 style="margin:0 0 16px 0;font-family:${EMAIL_FONT};font-size:22px;line-height:30px;color:${accentDark};">🌱 Nuevo en la waitlist</h1>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 8px 0;">
<tr>
<td style="font-family:${EMAIL_FONT};font-size:14px;line-height:21px;color:${EMAIL_COLORS.muted};padding-bottom:4px;">Email</td>
</tr>
<tr>
<td style="font-family:${EMAIL_FONT};font-size:16px;line-height:24px;color:${EMAIL_COLORS.ink};">${escapeHtml(email)}</td>
</tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="font-family:${EMAIL_FONT};font-size:14px;line-height:21px;color:${EMAIL_COLORS.muted};padding-bottom:4px;">Fecha</td>
</tr>
<tr>
<td style="font-family:${EMAIL_FONT};font-size:16px;line-height:24px;color:${EMAIL_COLORS.ink};">${escapeHtml(date)}</td>
</tr>
</table>`;
	return emailLayout(`Nuevo apunte en la waitlist: ${email}`, body);
}

export function adminNotifyText(email: string, date: string): string {
	return `Nuevo apunte en la waitlist: ${email}\nFecha: ${date}`;
}
