/**
 * Descarga set provisional de imágenes de plantas desde Pexels.
 *
 * - Lee PEXELS_API_KEY de .env.local.
 * - Busca en Pexels con términos en inglés (la API funciona mejor así).
 * - Descarga jpg originales a static/images/seed-source/.
 * - Idempotente: si el archivo ya existe, lo salta (usa --force para re-bajar).
 * - Sin transformar, sin créditos — solo material fuente crudo.
 *
 * Uso:
 *   bun run scripts/download-seed-images.mjs            # descarga lo que falte
 *   bun run scripts/download-seed-images.mjs --force   # re-baja todo
 *   bun run scripts/download-seed-images.mjs --dry-run # preview sin descargar
 */

import { readFileSync, mkdirSync, existsSync, writeFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_DIR = resolve(ROOT, "static/images/seed-source");

const force = process.argv.includes("--force");
const dryRun = process.argv.includes("--dry-run");

// Categorías: slug, count objetivo, términos de búsqueda (en inglés).
const CATEGORIES = [
	{ slug: "plantas",      count: 15, terms: ["pothos plant indoor", "monstera deliciosa plant", "calathea plant", "ficus houseplant", "sansevieria snake plant", "indoor tropical plant"] },
	{ slug: "esquejes",     count: 10, terms: ["plant cutting water jar", "pothos cutting propagation", "monstera cutting rooted", "houseplant propagation", "plant stem cutting"] },
	{ slug: "semillas",     count:  8, terms: ["tomato seeds packet", "basil seeds", "vegetable seeds envelope", "flower seeds packet", "herb seeds"] },
	{ slug: "tiestos",      count: 10, terms: ["ceramic plant pot", "terracotta pot plants", "indoor planter pot", "small plant pot", "plant pot close up"] },
	{ slug: "herramientas", count:  8, terms: ["pruning shears garden", "watering can metal", "garden trowel", "gardening hand tools", "secateurs pruning"] },
	{ slug: "sustratos",    count:  6, terms: ["potting soil bag", "garden soil compost", "mulch garden", "peat moss", "organic compost"] },
	{ slug: "accesorios",   count:  6, terms: ["kokedama moss ball", "liquid fertilizer plant", "bonsai accessory", "plant mister spray", "macrame plant hanger"] },
	{ slug: "libros",       count:  5, terms: ["gardening book open", "botany book", "houseplant book", "plant identification guide"] },
	{ slug: "otros",        count:  4, terms: ["greenhouse interior", "plant nursery shelves", "balcony garden plants"] },
];

// Carga PEXELS_API_KEY de .env.local (sin dependencias).
const envLocal = readFileSync(resolve(ROOT, ".env.local"), "utf8");
const m = envLocal.match(/^PEXELS_API_KEY=(.+)$/m);
const API_KEY = m?.[1]?.trim();
if (!API_KEY) {
	console.error("PEXELS_API_KEY no encontrada en .env.local");
	process.exit(1);
}

const PEXELS = "https://api.pexels.com/v1/search";
const PER_PAGE = 15;

function slugify(s) {
	return (s || "")
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 50);
}

async function searchPexels(term, n) {
	const url = `${PEXELS}?query=${encodeURIComponent(term)}&per_page=${n}&orientation=portrait`;
	const res = await fetch(url, { headers: { Authorization: API_KEY } });
	if (!res.ok) throw new Error(`Pexels HTTP ${res.status} for "${term}"`);
	const j = await res.json();
	return j.photos || [];
}

async function downloadBuffer(url) {
	const res = await fetch(url, { redirect: "follow" });
	if (!res.ok) throw new Error(`Download HTTP ${res.status}`);
	return Buffer.from(await res.arrayBuffer());
}

function kb(n) {
	return `${(n / 1024).toFixed(1)} KB`;
}

mkdirSync(OUT_DIR, { recursive: true });

const stats = { downloaded: 0, skipped: 0, failed: 0, dry: 0 };
const seenIds = new Set();
const perCategory = [];

console.log(`Descargando imágenes a ${OUT_DIR.replace(ROOT + "\\", "")}/`);
console.log(`Modo: ${dryRun ? "DRY RUN" : force ? "FORCE" : "idempotente (skip si existe)"}\n`);

for (const cat of CATEGORIES) {
	let count = 0;
	const catStats = { downloaded: 0, skipped: 0, failed: 0 };
	const localIds = new Set();

	for (const term of cat.terms) {
		if (count >= cat.count) break;
		let photos;
		try {
			photos = await searchPexels(term, PER_PAGE);
		} catch (e) {
			console.error(`  ✗ term "${term}": ${e.message}`);
			continue;
		}

		for (const p of photos) {
			if (count >= cat.count) break;
			if (!p?.id) continue;
			if (seenIds.has(p.id)) continue;
			if (localIds.has(p.id)) continue;
			localIds.add(p.id);

			const url = p.src?.original || p.src?.large2x || p.src?.large;
			if (!url) continue;

			const slug = slugify(p.alt || term || String(p.id));
			const filename = `${cat.slug}-${String(count + 1).padStart(2, "0")}-${slug || p.id}.jpg`;
			const dest = join(OUT_DIR, filename);

			if (!force && existsSync(dest)) {
				stats.skipped++;
				catStats.skipped++;
				count++;
				console.log(`  · skip ${cat.slug}/${filename}`);
				continue;
			}

			if (dryRun) {
				stats.dry++;
				catStats.downloaded++;
				count++;
				console.log(`  ~ dry  ${cat.slug}/${filename}  (pexels ${p.id})`);
				continue;
			}

			try {
				const buf = await downloadBuffer(url);
				writeFileSync(dest, buf);
				stats.downloaded++;
				catStats.downloaded++;
				count++;
				seenIds.add(p.id);
				console.log(`  ✓ ${cat.slug}/${filename}  ${kb(buf.length)}  (pexels ${p.id})`);
			} catch (e) {
				stats.failed++;
				catStats.failed++;
				console.error(`  ✗ ${cat.slug}/${filename}: ${e.message}`);
			}
		}
	}

	console.log(`[${cat.slug}] ${count}/${cat.count}  (↓${catStats.downloaded} skip${catStats.skipped} ✗${catStats.failed})\n`);
	perCategory.push({ slug: cat.slug, count, target: cat.count, ...catStats });
}

console.log("─".repeat(60));
console.log(`TOTAL: ${stats.downloaded + stats.dry} nuevas, ${stats.skipped} ya existían, ${stats.failed} fallidas`);
if (dryRun) console.log("(dry run: nada se descargó)");