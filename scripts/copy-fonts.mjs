import { copyFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readdirSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SRC = join(ROOT, "node_modules", "@fontsource-variable", "onest", "files");
const DEST = join(ROOT, "static", "fonts");

const WEIGHTS = [400, 500, 700, 800];
const PREFIX = "onest-latin";
// Variable font con el eje wght (100–900) cubre todos los pesos en un solo archivo.
// Remotion la carga una vez y respeta cualquier weight que se le pase en font-weight.
const VARIABLE = `${PREFIX}-wght-normal.woff2`;

if (!existsSync(SRC)) {
	console.error(`No se encuentra ${SRC}. ¿Has hecho \`bun install\`?`);
	process.exit(1);
}

mkdirSync(DEST, { recursive: true });

const available = readdirSync(SRC).filter((f) => f.startsWith(PREFIX) && f.endsWith(".woff2"));
let copied = 0;

// 1) Variable woff2 (cubre 100–900 con font-variation-settings wght).
if (available.includes(VARIABLE)) {
	copyFileSync(join(SRC, VARIABLE), join(DEST, "onest-variable.woff2"));
	console.log(`OK ${join(DEST, "onest-variable.woff2")}`);
	copied++;
} else {
	console.warn(`No encontrada la variable woff2: ${VARIABLE}`);
}

// 2) Pesos estáticos (carga más rápida si se necesita un peso concreto; opcional).
for (const weight of WEIGHTS) {
	const name = `${PREFIX}-${weight}-normal.woff2`;
	if (!available.includes(name)) continue;
	copyFileSync(join(SRC, name), join(DEST, name));
	console.log(`OK ${join(DEST, name)}`);
	copied++;
}
console.log(`Listo: ${copied} woff2 copiados a ${DEST}`);
