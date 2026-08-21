import { copyFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DEST = join(ROOT, "static", "fonts");

/**
 * 3 familias tipográficas del sistema:
 *  - Fraunces Variable (display, h1/h2/h3) — variante con eje opsz
 *  - Inter Variable (sans, body, botones)
 *  - JetBrains Mono Variable (mono, eyebrows, tags)
 *
 * Cada una se copia como un solo archivo woff2 variable que cubre todos los
 * pesos (o en el caso de Fraunces, todos los optical sizes) relevantes.
 */

const FAMILIES = [
	{
		name: "fraunces",
		package: "@fontsource-variable/fraunces",
		// Variante con eje opsz (la webapp carga opsz.css; Remotion también la usa).
		sourceDir: "files",
		sourcePrefix: "fraunces-latin-opsz-normal",
		destName: "fraunces-variable.woff2",
	},
	{
		name: "inter",
		package: "@fontsource-variable/inter",
		sourceDir: "files",
		sourcePrefix: "inter-latin-wght-normal",
		destName: "inter-variable.woff2",
	},
	{
		name: "jetbrains-mono",
		package: "@fontsource-variable/jetbrains-mono",
		sourceDir: "files",
		sourcePrefix: "jetbrains-mono-latin-wght-normal",
		destName: "jetbrains-mono-variable.woff2",
	},
];

mkdirSync(DEST, { recursive: true });

let copied = 0;
let missing = [];

for (const family of FAMILIES) {
	const src = join(ROOT, "node_modules", family.package, family.sourceDir);
	if (!existsSync(src)) {
		missing.push({ family: family.name, reason: `paquete no instalado (${family.package})` });
		console.warn(`✗ ${family.package} no instalado. Ejecuta \`bun add ${family.package}\`.`);
		continue;
	}
	const match = readdirSync(src).find(
		(f) => f.startsWith(family.sourcePrefix) && f.endsWith(".woff2"),
	);
	if (!match) {
		missing.push({ family: family.name, reason: `woff2 no encontrado (prefijo ${family.sourcePrefix})` });
		console.warn(`✗ ${family.name}: woff2 no encontrado (prefijo ${family.sourcePrefix}).`);
		continue;
	}
	const dest = join(DEST, family.destName);
	copyFileSync(join(src, match), dest);
	console.log(`OK ${family.destName}`);
	copied++;
}

if (missing.length > 0) {
	console.error(`\nFaltan ${missing.length} fuentes:`);
	for (const m of missing) console.error(`  - ${m.family}: ${m.reason}`);
	process.exit(1);
}

console.log(`\nListo: ${copied} woff2 copiados a ${DEST}`);
