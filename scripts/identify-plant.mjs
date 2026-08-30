/**
 * Valida la integración con Pl@ntNet: envía una imagen jpeg/png y vuelca la
 * respuesta (especies candidatas con score + cuota restante).
 *
 * - Lee PLANTNET_API_KEY de .env.local (no versionado).
 * - Usa la flora global ("all") y el órgano "leaf".
 * - Pl@ntNet solo acepta jpeg/png (rechaza webp); si no pasas imagen, baja un
 *   jpeg de prueba desde Pexels (PEXELS_API_KEY) y lo usa.
 * - Solo prueba local; la app usará la ruta /api/identify-plant (key en servidor)
 *   y convertirá las fotos webp a jpeg en el cliente antes de enviarlas.
 *
 * Uso:
 *   bun run scripts/identify-plant.mjs [ruta-a-jpeg-o-png] [organ]
 *     - sin argumentos: baja un jpeg de prueba de Pexels.
 *     - organ: opcional, por defecto "leaf".
 */

import { readFileSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// Carga claves de .env.local (sin dependencias).
const envLocal = readFileSync(resolve(ROOT, ".env.local"), "utf8");
const keyMatch = envLocal.match(/^PLANTNET_API_KEY=(.+)$/m);
const API_KEY = keyMatch?.[1]?.trim();
if (!API_KEY) {
	console.error("PLANTNET_API_KEY no encontrada en .env.local");
	process.exit(1);
}

// Resuelve la imagen a enviar (argumento jpeg/png o descarga de prueba).
const arg = process.argv[2];
let imagePath;
if (arg) {
	imagePath = resolve(ROOT, arg);
} else {
	const pexelsKey = envLocal.match(/^PEXELS_API_KEY=(.+)$/m)?.[1]?.trim();
	if (!pexelsKey) {
		console.error("PEXELS_API_KEY no encontrada (necesaria para la imagen de prueba)");
		process.exit(1);
	}
	const tmpDir = resolve(ROOT, "scripts/.tmp");
	mkdirSync(tmpDir, { recursive: true });
	imagePath = resolve(tmpDir, "identify-test.jpg");
	const search = await fetch(
		`https://api.pexels.com/v1/search?query=pothos%20plant&per_page=1`,
		{ headers: { Authorization: pexelsKey } }
	);
	const { photos } = await search.json();
	const src = photos?.[0]?.src?.large;
	if (!src) {
		console.error("No se pudo obtener imagen de prueba de Pexels");
		process.exit(1);
	}
	const img = await fetch(src);
	writeFileSync(imagePath, Buffer.from(await img.arrayBuffer()));
	console.log(`Imagen de prueba descargada: ${src}`);
}

if (!existsSync(imagePath)) {
	console.error(`No existe la imagen: ${imagePath}`);
	process.exit(1);
}

const organ = process.argv[3] ?? "leaf";
const bytes = readFileSync(imagePath);
const filename = imagePath.split(/[\\/]/).pop();

console.log(`Enviando ${filename} (${(bytes.length / 1024).toFixed(1)} KB) · organ=${organ}`);

const form = new FormData();
form.append("organs", organ);
form.append("images", new Blob([bytes]), filename);

const url = `https://my-api.plantnet.org/v2/identify/all?api-key=${encodeURIComponent(API_KEY)}`;

const response = await fetch(url, { method: "POST", body: form });
const json = await response.json();

console.log(`HTTP ${response.status}`);
console.log(`Cuota restante: ${json.remainingIdentificationRequests ?? "n/d"}`);

if (!response.ok) {
	console.error(JSON.stringify(json, null, 2));
	process.exit(1);
}

console.log("Candidatas:");
for (const r of json.results ?? []) {
	const s = r.species;
	console.log(
		`  ${(r.score * 100).toFixed(1).padStart(5)}%  ${s.scientificNameWithoutAuthor}` +
			(s.commonNames?.length ? `  (${s.commonNames.join(", ")})` : "")
	);
}