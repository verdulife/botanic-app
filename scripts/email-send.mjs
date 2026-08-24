import { confirmationHtml, confirmationText } from "../src/lib/emails/confirmation.ts";
import { adminNotifyHtml, adminNotifyText } from "../src/lib/emails/adminNotify.ts";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
if (!RESEND_API_KEY) {
	console.error("RESEND_API_KEY no está en env");
	process.exit(1);
}

const FROM = "Botanic <hola@botanicapp.es>";
const DEFAULT_RECIPIENTS = ["verdukactus@gmail.com", "verdu@live.com"];

const template = process.argv[2];
const recipient = process.argv[3];
if (!template) {
	console.error("uso: bun run email:send <confirmation|adminNotify> [destinatario]");
	process.exit(1);
}

const samples = {
	confirmation: {
		subject: "¡Gracias por apuntarte a la lista de espera de Botanic!",
		html: confirmationHtml(),
		text: confirmationText(),
	},
	adminNotify: {
		subject: "[Botanic] Nueva alta en la lista de espera",
		html: adminNotifyHtml("alguien@ejemplo.com", new Date().toISOString(), 1284),
		text: adminNotifyText("alguien@ejemplo.com", new Date().toISOString(), 1284),
	},
};

const t = samples[template];
if (!t) {
	console.error("plantilla no reconocida:", template);
	process.exit(1);
}

async function send(to) {
	const res = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${RESEND_API_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ from: FROM, to: [to], subject: t.subject, html: t.html, text: t.text }),
	});
	console.log(`${to}: ${res.status} -> ${await res.text()}`);
}

const targets = recipient ? [recipient] : DEFAULT_RECIPIENTS;
for (const to of targets) await send(to);