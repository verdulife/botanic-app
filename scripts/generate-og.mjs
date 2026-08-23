import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { create } from "fontkit";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const WIDTH = 1200;
const HEIGHT = 630;
const FONT_SIZE = 150;

// Fraunces 400 SIN opsz: instancia estática (@fontsource/fraunces).
// Los ficheros variables de fontsource tienen wght default=900 y resvg
// no aplica variaciones, por eso se usa el estático.
const FONT_SERIF = resolve(
	root,
	"node_modules/@fontsource/fraunces/files/fraunces-latin-400-normal.woff2",
);
// Tagline en Inter (sans de apoyo, como en la landing); su VF tiene default wght=400
const FONT_SANS = resolve(
	root,
	"node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
);
const TAGLINE_SIZE = 42;

function oklchToRgb(L, C, hDeg) {
	const h = (hDeg * Math.PI) / 180;
	const a = C * Math.cos(h);
	const b = C * Math.sin(h);
	const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
	const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
	const s_ = L - 0.0894841775 * a - 1.291485548 * b;
	const l = l_ ** 3;
	const m = m_ ** 3;
	const s = s_ ** 3;
	return [
		4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
		-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
		-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
	];
}

function oklchToCss(L, C, hDeg, alpha = 1) {
	let c = C;
	let rgb = oklchToRgb(L, c, hDeg);
	while (rgb.some((v) => v < 0 || v > 1) && c > 0) {
		c *= 0.8;
		rgb = oklchToRgb(L, c, hDeg);
	}
	const enc = (v) =>
		v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
	const to255 = (v) => Math.round(Math.min(1, Math.max(0, enc(v))) * 255);
	const [r, g, b] = rgb.map(to255);
	if (alpha >= 1) {
		const hex = [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
		return `#${hex}`;
	}
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Tokens del design system (src/app.css)
const BG = oklchToCss(0.935, 0.128, 99); // tranquil-200
const INK = oklchToCss(0.221, 0.032, 151); // still-950
const TAGLINE_INK = oklchToCss(0.221, 0.032, 151, 0.72);

const serifFont = create(readFileSync(FONT_SERIF));
const scale = FONT_SIZE / serifFont.unitsPerEm;
const widthOf = (text) => serifFont.layout(text).advanceWidth * scale;

const W_WORD = widthOf("Botanic");

// Centrado óptico por caja de tinta (los advances ignoran los bearings
// laterales del primer/último glifo y descentran el texto)
function centeredTextX(font, text, fontSize) {
	const s = fontSize / font.unitsPerEm;
	const run = font.layout(text);
	let inkMin = Infinity;
	let inkMax = -Infinity;
	let pen = 0;
	run.glyphs.forEach((glyph, i) => {
		const pos = run.positions[i];
		if (glyph.bbox) {
			inkMin = Math.min(inkMin, pen + pos.xOffset * s + glyph.bbox.minX * s);
			inkMax = Math.max(inkMax, pen + pos.xOffset * s + glyph.bbox.maxX * s);
		}
		pen += pos.xAdvance * s;
	});
	const width = inkMax - inkMin;
	return { x: (WIDTH - width) / 2 - inkMin, width };
}

let wordX = centeredTextX(serifFont, "Botanic", FONT_SIZE).x;
const baselineY = 340;

function wordmark() {
	return `<text x="${wordX.toFixed(2)}" y="${baselineY}" font-family="Fraunces" font-size="${FONT_SIZE}" font-weight="400" fill="${INK}">Botanic</text>
	<text x="${WIDTH / 2}" y="${baselineY + 72}" font-family="Inter" font-size="${TAGLINE_SIZE}" font-weight="400" fill="${TAGLINE_INK}" letter-spacing="1" text-anchor="middle">Donde las plantas conocen a gente nueva</text>`;
}

function buildSvg() {
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
	<rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="${BG}"/>
	${wordmark()}
</svg>`;
}

const FONT_CFG = {
	font: { fontFiles: [readFileSync(FONT_SERIF), readFileSync(FONT_SANS)], loadSystemFonts: false },
};

/**
 * Autocalibración: el motor de texto de resvg mide distinto que fontkit,
 * así que medimos la tinta REAL del PNG y corregimos el dx del wordmark.
 */
async function inkBounds(pngBuffer, yMin, yMax) {
	const sharp = (await import("sharp")).default;
	const { data, info } = await sharp(pngBuffer).raw().toBuffer({ resolveWithObject: true });
	let minX = Infinity;
	let maxX = -Infinity;
	for (let y = yMin; y < Math.min(yMax, info.height); y++) {
		for (let x = 0; x < info.width; x++) {
			const i = (y * info.width + x) * info.channels;
			if (data[i] < 100 && data[i + 1] < 100) {
				if (x < minX) minX = x;
				if (x > maxX) maxX = x;
			}
		}
	}
	return { minX, maxX, width: maxX - minX };
}

let png;
{
	// banda del wordmark solamente (la tagline empieza más abajo)
	const WM_YMAX = 372;
	for (let iter = 0; iter < 3; iter++) {
		png = new Resvg(buildSvg(), FONT_CFG).render().asPng();
		const { minX, width } = await inkBounds(png, 180, WM_YMAX);
		const dx = (WIDTH - width) / 2 - minX;
		if (Math.abs(dx) < 0.5) break;
		wordX += dx; // muta la variable usada por wordmark()
	}
}

writeFileSync(resolve(root, "static/og-image.svg"), buildSvg());
writeFileSync(resolve(root, "static/og-image.png"), png);

const jpg = await sharp(png).jpeg({ quality: 85, mozjpeg: true }).toBuffer();
writeFileSync(resolve(root, "static/og-image.jpg"), jpg);

console.log("W_Botanic(fontkit):", W_WORD.toFixed(1), "| wordX calibrado:", wordX.toFixed(1));
console.log("ok!", png.length, "bytes png /", jpg.length, "bytes jpg");
