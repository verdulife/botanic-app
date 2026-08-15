export const EMAIL_COLORS = {
	accent: "#74AA7B",
	accentDark: "#224329",
	tint: "#DEEDDE",
	ink: "#4A4238",
	muted: "#7C766A",
	linen: "#FBF8F1",
	paper: "#FFFFFF",
	border: "#E7E0D0",
} as const;

export const EMAIL_FONT =
	"Arial, Helvetica, sans-serif";

export const EMAIL_HEADER_IMG = {
	src: "https://www.botanicapp.es/og-image.jpg",
	width: 1200,
	height: 630,
	alt: "Botanic ✦ Donde las plantas conocen a gente",
} as const;

export function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

export function emailLayout(preheader: string, body: string): string {
	const { accent, accentDark, linen, paper, muted, border, ink } = EMAIL_COLORS;
	return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>Botanic</title>
</head>
<body style="margin:0;padding:0;background-color:${linen};">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${linen};">
<tr>
<td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
<tr>
<td style="background-color:${paper};border-radius:16px;padding:16px;font-family:${EMAIL_FONT};font-size:16px;line-height:24px;color:${ink};">
<img src="${EMAIL_HEADER_IMG.src}" width="${EMAIL_HEADER_IMG.width}" height="${EMAIL_HEADER_IMG.height}" alt="${escapeHtml(EMAIL_HEADER_IMG.alt)}" style="display:block;width:100%;height:auto;border-radius:12px;border:1px solid ${border};">
<div style="padding:24px 0 0 0;text-align:center;">
${body}
</div>
</td>
</tr>
<tr>
<td align="center" style="padding:24px 16px 0 16px;font-family:${EMAIL_FONT};font-size:12px;line-height:18px;color:${muted};">
Botanic — Donde las plantas conocen a gente<br>
<a href="https://botanicapp.es" style="color:${accent};text-decoration:underline;">botanicapp.es</a>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`;
}

export function ctaButton(href: string, label: string): string {
	const { accent } = EMAIL_COLORS;
	return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px auto 0 auto;">
<tr>
<td align="center" bgcolor="${accent}" style="background-color:${accent};border-radius:999px;">
<a href="${escapeHtml(href)}" style="display:inline-block;padding:12px 28px;font-family:${EMAIL_FONT};font-size:16px;line-height:20px;font-weight:bold;color:#FFFFFF;text-decoration:none;">${escapeHtml(label)}</a>
</td>
</tr>
</table>`;
}
