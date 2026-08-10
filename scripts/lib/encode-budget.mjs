import sharp from "sharp";

export const BUDGET = 100 * 1024;
export const HARD = 120 * 1024;

export const WEBP_CFG = { widths: [1600, 1400, 1200, 1000, 800] };
export const JPG_CFG = { widths: [1200, 1000, 800] };

async function encode(src, w, q, ext) {
	if (ext === "webp") {
		return sharp(src)
			.rotate()
			.resize({ width: w, withoutEnlargement: true })
			.webp({ quality: q })
			.toBuffer();
	}
	return sharp(src)
		.rotate()
		.resize({ width: w, withoutEnlargement: true })
		.jpeg({ quality: q, mozjpeg: true })
		.toBuffer();
}

async function bestQuality(src, w, ext, target) {
	let lo = 30;
	let hi = 85;
	let best = null;
	while (lo <= hi) {
		const q = Math.round((lo + hi) / 2);
		const buf = await encode(src, w, q, ext);
		if (buf.length <= target) {
			best = { w, q, buf, size: buf.length };
			lo = q + 1;
		} else {
			hi = q - 1;
		}
	}
	return best;
}

export async function encodeToBudget(src, cfg, ext) {
	const fitted = [];
	for (const w of cfg.widths) {
		const best = await bestQuality(src, w, ext, BUDGET);
		if (best) fitted.push(best);
	}
	if (fitted.length > 0) {
		// preferencia: mayor ancho que quepa; a igual ancho, mayor calidad
		fitted.sort((a, b) => b.w - a.w || b.q - a.q);
		return { ...fitted[0], overBudget: false };
	}
	// ninguno cabe en el presupuesto: encodear cada ancho a q30 y quedarse con el menor peso
	const fallbacks = [];
	for (const w of cfg.widths) {
		const buf = await encode(src, w, 30, ext);
		fallbacks.push({ w, q: 30, buf, size: buf.length });
	}
	fallbacks.sort((a, b) => a.size - b.size);
	return { ...fallbacks[0], overBudget: true };
}
