import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT = join(__dirname, ".tmp", "email-preview");
mkdirSync(OUT, { recursive: true });

const { confirmationHtml, confirmationText } = await import(
	"../src/lib/emails/confirmation.ts"
);
const { adminNotifyHtml, adminNotifyText } = await import(
	"../src/lib/emails/adminNotify.ts"
);

// EMAIL_BASE sobreescribe el dominio (ej: http://localhost:4173) para que el
// banner apunte al og-image del servidor local y se vean los cambios al iterar.
const base = process.env.EMAIL_BASE;
const rewriteBase = (html) =>
	base ? html.replace(/https?:\/\/(?:www\.)?botanicapp\.es/g, base) : html;

const now = new Date();
const samples = [
	{
		name: "confirmation",
		html: rewriteBase(confirmationHtml()),
		text: confirmationText(),
	},
	{
		name: "admin-notify",
		html: rewriteBase(
			adminNotifyHtml("alguien@ejemplo.com", now.toISOString(), 1284),
		),
		text: adminNotifyText("alguien@ejemplo.com", now.toISOString(), 1284),
	},
];

for (const t of samples) {
	const htmlPath = join(OUT, `${t.name}.html`);
	const textPath = join(OUT, `${t.name}.txt`);
	writeFileSync(htmlPath, t.html);
	writeFileSync(textPath, t.text);
	console.log(`✓ ${t.name} → ${htmlPath}`);
}

if (process.env.EMAIL_NO_OPEN) {
	process.exit(0);
}

const first = join(OUT, `${samples[0].name}.html`);
const cmd = process.platform === "win32" ? "cmd" : process.platform === "darwin" ? "open" : "xdg-open";
const args =
	process.platform === "win32" ? ["/c", "start", '""', first] : [first];
spawn(cmd, args, { detached: true, stdio: "ignore" }).unref();