import { mkdirSync, readFileSync, writeFileSync, existsSync, appendFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { encodeToBudget, WEBP_CFG, JPG_CFG } from "./lib/encode-budget.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CACHE_DIR = resolve(__dirname, ".tmp");
const CACHE_FILE = join(CACHE_DIR, "images-search.json");
const OUT_DIR = resolve(ROOT, "static/images/blog");
const CREDITS_FILE = resolve(ROOT, "docs/images-credits.md");
const API = "https://commons.wikimedia.org/w/api.php";
const UA =
	"BotanicApp/0.1 (https://www.botanicapp.es; blog image sourcing)";

function allowedLicense(shortName, license) {
	const s = `${shortName} ${license}`.toLowerCase();
	if (s.includes("nc") || s.includes("noderiv") || s.includes("nd ")) return false;
	return (
		s.includes("public domain") ||
		s.includes("cc0") ||
		s.includes("cc by") ||
		s.includes("creative commons attribution")
	);
}

async function search(q, limit = 12) {
	const params = new URLSearchParams({
		action: "query",
		generator: "search",
		gsrsearch: q,
		gsrnamespace: "6",
		gsrlimit: String(limit),
		prop: "imageinfo",
		iiprop: "url|extmetadata",
		iiurlwidth: "1600",
		format: "json",
		origin: "*",
	});
	const res = await fetch(`${API}?${params}`, { headers: { "User-Agent": UA } });
	if (!res.ok) throw new Error(`Commons HTTP ${res.status}`);
	const data = await res.json();
	const pages = Object.values(data?.query?.pages ?? {});
	const items = pages.map((p) => {
		const ii = p.imageinfo?.[0];
		const meta = ii?.extmetadata ?? {};
		const get = (k) => (meta[k]?.value ?? "").toString();
		return {
			pageid: p.pageid,
			file: p.title.replace(/^File:/, ""),
			title:
				get("ObjectName") || get("ImageDescription") || p.title.replace(/^File:/, ""),
			artist: get("Artist").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(),
			license: get("LicenseShortName") || get("License") || "?",
			source: ii?.descriptionurl ?? "",
			thumb: (ii?.thumburl ?? "").split("?")[0],
			w: ii?.thumbwidth ?? 0,
			h: ii?.thumbheight ?? 0,
			assessment: get("Assessments"),
			ext: (p.title.match(/\.(jpe?g|png|webp)$/i) ?? [""])[0],
		};
	});
	return items;
}

function assessmentScore(a) {
	if (!a) return 0;
	if (a.includes("featured")) return 4;
	if (a.includes("quality")) return 3;
	if (a.includes("valued")) return 2;
	return 1;
}

function printResults(items) {
	items.forEach((r, i) => {
		const badge = r.assessment ? ` [${r.assessment}]` : "";
		const over = r.overWidth ? " (ancho <1200px)" : "";
		console.log(`${String(i + 1).padStart(2)}.${badge} ${r.title}${over}`);
		console.log(`   Autor: ${r.artist || "?"} · Licencia: ${r.license} · ${r.w}×${r.h}`);
		console.log(`   ${r.thumb}`);
	});
}

async function download(url, attempts = 3) {
	for (let i = 1; i <= attempts; i++) {
		try {
			const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			return Buffer.from(await res.arrayBuffer());
		} catch (e) {
			if (i === attempts) throw e;
			await new Promise((r) => setTimeout(r, 1000 * i));
		}
	}
}

function kb(n) {
	return `${(n / 1024).toFixed(1)} KB`;
}

async function fetchImage(index, dest) {
	if (!existsSync(CACHE_FILE)) {
		console.error("No hay búsqueda en cache. Ejecuta primero: bun run img search \"<query>\"");
		process.exit(1);
	}
	const results = JSON.parse(readFileSync(CACHE_FILE, "utf8"));
	const r = results[index - 1];
	if (!r) {
		console.error(`Índice ${index} no existe (1-${results.length})`);
		process.exit(1);
	}
	if (!r.thumb) {
		console.error("Resultado sin miniatura utilizable");
		process.exit(1);
	}

	const src = await download(r.thumb);
	mkdirSync(OUT_DIR, { recursive: true });

	const webp = await encodeToBudget(src, WEBP_CFG, "webp");
	const jpg = await encodeToBudget(src, JPG_CFG, "jpeg");

	writeFileSync(join(OUT_DIR, `${dest}.webp`), webp.buf);
	writeFileSync(join(OUT_DIR, `${dest}.jpg`), jpg.buf);

	if (!existsSync(CREDITS_FILE)) {
		writeFileSync(
			CREDITS_FILE,
			"# Créditos de imágenes\n\nRegistro automático de las imágenes descargadas de Wikimedia Commons para el blog.\n\n",
		);
	}
	const credit = `- \`images/blog/${dest}.jpg\` — ${r.title} — Autor: ${r.artist || "?"} — Licencia: ${r.license} — [Fuente](${r.source})\n`;
	appendFileSync(CREDITS_FILE, credit);

	console.log(`OK ${dest}.jpg (${kb(jpg.size)} @${jpg.w}px q${jpg.q}${jpg.overBudget ? " · sobre presupuesto" : ""})`);
	console.log(`OK ${dest}.webp (${kb(webp.size)} @${webp.w}px q${webp.q}${webp.overBudget ? " · sobre presupuesto" : ""})`);
	console.log(`Crédito añadido a docs/images-credits.md`);
}

async function main() {
	const [cmd, ...rest] = process.argv.slice(2);

	if (cmd === "search") {
		const q = rest.join(" ");
		if (!q) {
			console.error('Uso: bun run img search "<query>"');
			process.exit(1);
		}
		const limit = Number(rest.find((a) => /^\d+$/.test(a))) || 12;
		const raw = await search(q, limit);
		const items = raw.filter((r) => /\.(jpe?g|png|webp)$/i.test(r.ext));
		const allowed = items.filter((r) => allowedLicense(r.license, ""));
		const filtered = allowed.map((r) => ({ ...r, overWidth: r.w < 1200 }));
		const usable = filtered.filter((r) => r.w >= 1200);
		usable.sort((a, b) => assessmentScore(b.assessment) - assessmentScore(a.assessment));
		mkdirSync(CACHE_DIR, { recursive: true });
		writeFileSync(CACHE_FILE, JSON.stringify(usable, null, 2));
		if (usable.length === 0) {
			console.log("Sin resultados válidos (licencia CC BY/CC BY-SA/PD, ≥1200px).");
			return;
		}
		printResults(usable);
		console.log(`\n${usable.length} resultados válidos. Descarga con: bun run img fetch <nº> <dest>`);
	} else if (cmd === "fetch") {
		const index = Number(rest[0]);
		const dest = (rest[1] ?? "").replace(/\.(webp|jpe?g|png)$/i, "");
		if (!index || !dest) {
			console.error("Uso: bun run img fetch <nº> <dest>");
			process.exit(1);
		}
		if (!/^[\w-]+$/.test(dest)) {
			console.error("dest solo puede contener letras, números, guiones y guiones bajos");
			process.exit(1);
		}
		await fetchImage(index, dest);
	} else {
		console.error('Comandos: search "<query>" | fetch <nº> <dest>');
		process.exit(1);
	}
}

main();
