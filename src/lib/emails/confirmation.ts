import { emailLayout, ctaButton, EMAIL_COLORS, EMAIL_FONT } from "./layout";

export function confirmationHtml(): string {
	const { accentDark, tint } = EMAIL_COLORS;
	const body = `
<h1 style="margin:0 0 16px 0;font-family:${EMAIL_FONT};font-size:24px;line-height:32px;color:${accentDark};">Tus plantas quieren conocer a gente nueva</h1>
<p style="margin:0 0 16px 0;font-family:${EMAIL_FONT};font-size:16px;line-height:24px;">Te has apuntado a la <strong>primera comunidad</strong> donde las plantas conocen a gente nueva. Vender, cambiar o regalar plantas, semillas, esquejes y tiestos con gente de tu zona: así tus plantas conocen a quien las va a cuidar.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;">
<tr>
<td bgcolor="${tint}" style="background-color:${tint};border-radius:12px;padding:20px;font-family:${EMAIL_FONT};font-size:16px;line-height:24px;color:${EMAIL_COLORS.ink};">
<strong>Te avisaremos antes que nadie</strong> del lanzamiento, para que seas de los primeros en estrenar Botanic.
</td>
</tr>
</table>
<p style="margin:0 0 16px 0;font-family:${EMAIL_FONT};font-size:16px;line-height:24px;">Mientras tanto, puedes echar un vistazo y preparar a tus plantas.</p>
${ctaButton("https://botanicapp.es", "Conocer Botanic")}
<p style="margin:24px 0 0 0;font-family:${EMAIL_FONT};font-size:14px;line-height:21px;color:${EMAIL_COLORS.muted};">Hecho con 🌱 para la comunidad Plant Lovers.</p>`;
	return emailLayout("Te has apuntado a la primera comunidad donde las plantas conocen a gente nueva.", body);
}

export function confirmationText(): string {
	return "Te has apuntado a Botanic, la primera comunidad donde las plantas conocen a gente nueva.\n\nVender, cambiar o regalar plantas, semillas, esquejes y tiestos con gente de tu zona. Te avisaremos antes que nadie del lanzamiento.\n\n— El equipo de Botanic";
}
