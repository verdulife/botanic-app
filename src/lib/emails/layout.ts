export const EMAIL_COLORS = {
	accent: "#74AA7B",
	accentDark: "#224329",
	tint: "#DEEDDE",
	ink: "#4A4238",
	muted: "#7C766A",
	linen: "#FBF8F1",
	paper: "#FFFFFF",
	border: "#e2c660",
} as const;

export const EMAIL_FONT =
	"Arial, Helvetica, sans-serif";

export const EMAIL_HEADER_IMG = {
	src: "https://www.botanicapp.es/og-image.jpg",
	width: 1200,
	height: 630,
	alt: "Botanic — comunidad para vender, cambiar y regalar plantas, esquejes, semillas y tiestos con gente de tu zona",
	displayWidth: 600,
} as const;

export const EMAIL_LEGAL = {
	holder: "Albert Verdú Llinares",
	nif: "46356977-V",
	address: "Olivella, Barcelona, Cataluña, España",
	contactEmail: "botanictheapp@gmail.com",
	website: "www.botanicapp.es",
} as const;

export function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

export function emailLayout(preheader: string, body: string, signoff?: string): string {
	const { accent, muted, border, ink } = EMAIL_COLORS;
	const PAGE_BG = "#ffeb82";
	return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>Botanic</title>
</head>
<body style="margin:0;padding:0;background-color:${PAGE_BG};">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${PAGE_BG};">
<tr>
<td align="center" style="padding:44px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
<tr>
<td style="font-family:${EMAIL_FONT};font-size:17px;line-height:28px;color:${ink};">
<img src="${EMAIL_HEADER_IMG.src}" width="${EMAIL_HEADER_IMG.displayWidth}" height="${Math.round((EMAIL_HEADER_IMG.displayWidth * EMAIL_HEADER_IMG.height) / EMAIL_HEADER_IMG.width)}" alt="${escapeHtml(EMAIL_HEADER_IMG.alt)}" style="display:block;width:100%;max-width:${EMAIL_HEADER_IMG.displayWidth}px;height:auto;border-radius:12px;border:1px solid ${border};">
<div style="padding:28px 0 0 0;text-align:center;">
${body}
</div>
</td>
</tr>
<tr>
<td style="padding:32px 0 0 0;font-size:1px;line-height:1px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td style="border-top:1px solid ${border};font-size:1px;line-height:1px;height:1px;">&nbsp;</td></tr>
</table>
</td>
</tr>
<tr>
<td align="center" style="padding:32px 16px 48px 16px;font-family:${EMAIL_FONT};font-size:12px;line-height:22px;color:${muted};">
${EMAIL_LEGAL.holder} · NIF ${EMAIL_LEGAL.nif}<br>
${EMAIL_LEGAL.address}<br>
<a href="https://${EMAIL_LEGAL.website}" style="color:${accent};text-decoration:underline;">${EMAIL_LEGAL.website}</a> · <a href="mailto:${EMAIL_LEGAL.contactEmail}" style="color:${accent};text-decoration:underline;">${EMAIL_LEGAL.contactEmail}</a>
</td>
</tr>
${signoff
	? `<tr>
<td align="center" style="padding:0 16px 48px 16px;font-family:${EMAIL_FONT};font-size:15px;line-height:26px;color:${muted};">
${signoff}
</td>
</tr>`
	: ""}
</table>
</td>
</tr>
</table>
</body>
</html>`;
}

export function ctaButton(href: string, label: string): string {
	const { accent } = EMAIL_COLORS;
	return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:32px auto 0 auto;">
<tr>
<td align="center" bgcolor="${accent}" style="background-color:${accent};border-radius:999px;">
<a href="${escapeHtml(href)}" style="display:inline-block;padding:12px 28px;font-family:${EMAIL_FONT};font-size:16px;line-height:20px;font-weight:bold;color:#FFFFFF;text-decoration:none;">${escapeHtml(label)}</a>
</td>
</tr>
</table>`;
}

export function ctaButtonSecondary(href: string, label: string): string {
	const { accent } = EMAIL_COLORS;
	return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:16px auto 0 auto;">
<tr>
<td align="center" style="border-radius:999px;border:2px solid ${accent};">
<a href="${escapeHtml(href)}" style="display:inline-block;padding:10px 26px;font-family:${EMAIL_FONT};font-size:16px;line-height:20px;font-weight:bold;color:${accent};text-decoration:none;">${escapeHtml(label)}</a>
</td>
</tr>
</table>`;
}
