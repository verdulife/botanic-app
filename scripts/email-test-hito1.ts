import { confirmationHtml, confirmationText } from "../src/lib/emails/confirmation";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
if (!RESEND_API_KEY) {
	console.error("RESEND_API_KEY no está en env");
	process.exit(1);
}

const FROM = "Botanic <hola@botanicapp.es>";
const RECIPIENTS = ["verdukactus@gmail.com", "verdu@live.com"];

async function send(to: string, subject: string, html: string, text: string) {
	const res = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${RESEND_API_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ from: FROM, to: [to], subject, html, text }),
	});
	const text0 = await res.text();
	console.log(`${to}: ${res.status} -> ${text0}`);
}

for (const to of RECIPIENTS) {
	await send(
		to,
		"¡Gracias por apuntarte a la waitlist de Botanic!",
		confirmationHtml(),
		confirmationText(),
	);
}
