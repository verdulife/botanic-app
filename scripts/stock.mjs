import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { encodeToBudget, WEBP_CFG, JPG_CFG } from "./lib/encode-budget.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CACHE_DIR = resolve(__dirname, ".tmp");
const PHOTO_CACHE = join(CACHE_DIR, "stock-photos.json");
const VIDEO_CACHE = join(CACHE_DIR, "stock-videos.json");

const API_KEY = process.env.PEXELS_API_KEY;

async function searchPhotos(q, limit = 12) {
	const params = new URLSearchParams({
		query: q,
		orientation: "portrait",
		per_page: String(limit),
		size: "medium",
	});
	const res = await fetch(`https://api.pexels.com/v1/search?${params}`, {
		headers: { Authorization: API_KEY },
	});
	if (!res.ok) throw new Error(`Pexels fotos HTTP ${res.status}`);
	const data = await res.json();
	return (data.photos ?? []).map((p) => ({
		id: p.id,
		width: p.width,
		height: p.height,
		alt: p.alt ?? "",
		photographer: p.photographer,
		url: p.url,
		src: p.src.original,
		thumb: p.src.portrait ?? p.src.large2x ?? p.src.original,
		srcLandscape: p.src.landscape,
	}));
}

async function searchVideos(q, limit = 12) {
	const params = new URLSearchParams({
		query: q,
		orientation: "portrait",
		per_page: String(limit),
		size: "medium",
	});
	const res = await fetch(`https://api.pexels.com/videos/search?${params}`, {
		headers: { Authorization: API_KEY },
	});
	if (!res.ok) throw new Error(`Pexels vídeos HTTP ${res.status}`);
	const data = await res.json();
	return (data.videos ?? []).map((v) => {
		const best = v.video_files.find(
			(f) => f.width <= 1080 && f.width >= 720 && f.height > f.width,
		) ?? v.video_files[0];
		return {
			id: v.id,
			width: best.width,
			height: best.height,
			duration: v.duration,
			url: v.url,
			user: v.user?.name ?? "",
			link: best.link,
		};
	});
}

function kb(n) {
	return `${(n / 1024).toFixed(1)} KB`;
}

function printPhotos(items) {
	items.forEach((r, i) => {
		const tall = r.height >= r.width ? "9:16" : "horizontal";
		console.log(`${String(i + 1).padStart(2)}. [foto ${tall}] ${r.alt || r.id}`);
		console.log(`   Autor: ${r.photographer} · ${r.width}×${r.height}`);
		console.log(`   ${r.src}`);
	});
}

function printVideos(items) {
	items.forEach((r, i) => {
		console.log(`${String(i + 1).padStart(2)}. [clip ${r.duration}s ${r.width}×${r.height}] Pexels #${r.id}`);
		console.log(`   Usuario: ${r.user || "?"}`);
		console.log(`   ${r.link}`);
	});
}

async function download(url, attempts = 3) {
	for (let i = 1; i <= attempts; i++) {
		try {
			const res = await fetch(url, { redirect: "follow" });
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			return Buffer.from(await res.arrayBuffer());
		} catch (e) {
			if (i === attempts) throw e;
			await new Promise((r) => setTimeout(r, 1000 * i));
		}
	}
}

async function fetchPhoto(index, dest) {
	if (!existsSync(PHOTO_CACHE)) {
		console.error('No hay búsqueda de fotos en cache. Ejecuta: bun run stock search "<query>"');
		process.exit(1);
	}
	const results = JSON.parse(readFileSync(PHOTO_CACHE, "utf8"));
	const r = results[index - 1];
	if (!r) {
		console.error(`Índice ${index} no existe (1-${results.length})`);
		process.exit(1);
	}
	const src = await download(r.src);
	mkdirSync(dirname(dest), { recursive: true });

	const webp = await encodeToBudget(src, WEBP_CFG, "webp");
	const jpg = await encodeToBudget(src, JPG_CFG, "jpeg");
	writeFileSync(`${dest}.webp`, webp.buf);
	writeFileSync(`${dest}.jpg`, jpg.buf);

	console.log(`OK ${dest}.jpg (${kb(jpg.size)}) + ${dest}.webp (${kb(webp.size)})`);
	console.log(`Referencia: pexels:${r.id} (${r.alt || r.url})`);
}

async function fetchVideo(index, dest) {
	if (!existsSync(VIDEO_CACHE)) {
		console.error('No hay búsqueda de vídeos en cache. Ejecuta: bun run stock search:video "<query>"');
		process.exit(1);
	}
	const results = JSON.parse(readFileSync(VIDEO_CACHE, "utf8"));
	const r = results[index - 1];
	if (!r) {
		console.error(`Índice ${index} no existe (1-${results.length})`);
		process.exit(1);
	}
	const buf = await download(r.link);
	mkdirSync(dirname(dest), { recursive: true });
	writeFileSync(`${dest}.mp4`, buf);
	console.log(`OK ${dest}.mp4 (${kb(buf.length)})`);
	console.log(`Referencia: pexels:${r.id} (${r.url})`);
}

async function main() {
	const [cmd, ...rest] = process.argv.slice(2);

	if (cmd === "search") {
		const q = rest.join(" ");
		if (!q) {
			console.error('Uso: bun run stock search "<query>"');
			process.exit(1);
		}
		const limit = Number(rest.find((a) => /^\d+$/.test(a))) || 12;
		mkdirSync(CACHE_DIR, { recursive: true });
		const photos = await searchPhotos(q, limit);
		writeFileSync(PHOTO_CACHE, JSON.stringify(photos, null, 2));
		printPhotos(photos);
		console.log(`\n${photos.length} fotos. Descarga con: bun run stock fetch <nº> <dest>`);
	} else if (cmd === "search:video") {
		const q = rest.join(" ");
		if (!q) {
			console.error('Uso: bun run stock search:video "<query>"');
			process.exit(1);
		}
		const limit = Number(rest.find((a) => /^\d+$/.test(a))) || 12;
		mkdirSync(CACHE_DIR, { recursive: true });
		const videos = await searchVideos(q, limit);
		writeFileSync(VIDEO_CACHE, JSON.stringify(videos, null, 2));
		printVideos(videos);
		console.log(`\n${videos.length} clips. Descarga con: bun run stock fetch:video <nº> <dest>`);
	} else if (cmd === "fetch") {
		const index = Number(rest[0]);
		const dest = (rest[1] ?? "").replace(/\.(webp|jpe?g|png)$/i, "");
		if (!index || !dest) {
			console.error("Uso: bun run stock fetch <nº> <dest>");
			process.exit(1);
		}
		await fetchPhoto(index, resolve(ROOT, dest));
	} else if (cmd === "fetch:video") {
		const index = Number(rest[0]);
		const dest = (rest[1] ?? "").replace(/\.mp4$/i, "");
		if (!index || !dest) {
			console.error("Uso: bun run stock fetch:video <nº> <dest>");
			process.exit(1);
		}
		await fetchVideo(index, resolve(ROOT, dest));
	} else {
		console.error(
			"Comandos: search \"<query>\" | search:video \"<query>\" | fetch <nº> <dest> | fetch:video <nº> <dest>",
		);
		process.exit(1);
	}
}

if (!API_KEY) {
	console.error("Falta PEXELS_API_KEY en .env.local");
	process.exit(1);
}

main();
