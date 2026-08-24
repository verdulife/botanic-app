import {
	emailLayout,
	ctaButton,
	EMAIL_COLORS,
	EMAIL_FONT,
} from "./layout";

export function confirmationHtml(): string {
	const { accentDark, muted } = EMAIL_COLORS;
	const shareText = encodeURIComponent(
		"Acabo de apuntarme a Botanic, donde las plantas y la gente se conocen. Únete: https://botanicapp.es/?utm_source=waitlist_share",
	);
	const body = `
<h1 style="margin:0 0 24px 0;font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:40px;color:${accentDark};text-align:center;font-weight:500;">¡Gracias por sumarte a Botanic!</h1>
<p style="margin:0 0 28px 0;font-family:${EMAIL_FONT};font-size:17px;line-height:28px;text-align:center;">Ya formas parte de Botanic, donde las plantas y la gente se conocen: el lugar para dar nueva vida a esquejes, semillas y plantas, y para encontrar los que buscas.</p>
<p style="margin:0 0 0 0;font-family:${EMAIL_FONT};font-size:17px;line-height:28px;text-align:center;">Te avisaremos cuando abramos la app y también te contaremos las novedades por el camino. Sin spam, solo lo esencial.</p>
<p style="margin:24px 0 0 0;font-family:${EMAIL_FONT};font-size:15px;line-height:24px;color:${muted};text-align:center;">Nos ayudaría mucho si compartes Botanic con los tuyos.</p>
${ctaButton(`https://wa.me/?text=${shareText}`, "Compartir en WhatsApp")}`;
	const signoff = "Hecho con 💚 para la comunidad Plant Lovers.";
	return emailLayout(
		"Te has apuntado a Botanic. Te avisaremos antes que nadie cuando abramos la app.",
		body,
		signoff,
	);
}

export function confirmationText(): string {
	return "Te has apuntado a Botanic, la primera comunidad donde las plantas conocen a gente nueva.\n\nVender, cambiar o regalar plantas, semillas, esquejes y tiestos con gente de tu zona. Te avisaremos antes que nadie del lanzamiento.\n\n— El equipo de Botanic";
}
