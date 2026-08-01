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
const FONT_SIZE = 144;
const FONT_FILE = resolve(root, "node_modules/@fontsource/onest/files/onest-latin-700-normal.woff2");
const FONT_FILE_REGULAR = resolve(root, "node_modules/@fontsource/onest/files/onest-latin-400-normal.woff2");
const TAGLINE_SIZE = 44;
const TAGLINE = oklchToCss(0.265, 0.159, 146);

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

const MESHES = {
	band: {
		base: [0.966, 0.01, 85],
		saturate: 1,
		g: [
			["ga1", 22, 38, 40, 55, [0.931, 0.061, 150], 0.45],
			["ga2", 74, 28, 36, 48, [0.897, 0.1, 147], 0.3],
			["ga3", 58, 78, 46, 60, [0.861, 0.128, 148], 0.25],
			["ga4", 88, 62, 30, 42, [0.91, 0.014, 85], 0.3],
			["gb1", 68, 58, 42, 52, [0.931, 0.061, 150], 0.4],
			["gb2", 28, 66, 34, 50, [0.897, 0.1, 147], 0.28],
			["gb3", 82, 24, 44, 58, [0.861, 0.128, 148], 0.22],
			["gb4", 14, 22, 32, 44, [0.91, 0.014, 85], 0.28],
		],
	},
	waitlist: {
		base: [0.945, 0.044, 147],
		saturate: 1.5,
		g: [
			["ga1", 22, 38, 55, 70, [0.931, 0.061, 150], 1],
			["ga2", 74, 28, 48, 62, [0.897, 0.1, 147], 0.95],
			["ga3", 58, 78, 60, 72, [0.861, 0.128, 148], 0.9],
			["ga4", 88, 62, 42, 56, [0.91, 0.014, 85], 0.9],
			["gb1", 68, 58, 56, 66, [0.931, 0.061, 150], 0.95],
			["gb2", 28, 66, 46, 62, [0.897, 0.1, 147], 0.9],
			["gb3", 82, 24, 58, 70, [0.861, 0.128, 148], 0.85],
			["gb4", 14, 22, 44, 56, [0.91, 0.014, 85], 0.85],
		],
	},
};

const meshName = process.argv.includes("--mesh")
	? process.argv[process.argv.indexOf("--mesh") + 1]
	: "band";
const MESH = MESHES[meshName] ?? MESHES.band;

const BASE = oklchToCss(...MESH.base);
const GRADIENTS = MESH.g;

const SPRUT_PATHS = [
	"M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3",
	"M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4",
	"M5 21h14",
];

const LOGO = oklchToCss(0.401, 0.218, 146);

const font = create(readFileSync(FONT_FILE));
const scale = FONT_SIZE / font.unitsPerEm;
const widthOf = (text) => font.layout(text).advanceWidth * scale;

const W_BO = widthOf("Bo");
const W_ANIC = widthOf("anic");
const ICON = 0.9 * FONT_SIZE;
const iconLeft = W_BO - 0.125 * FONT_SIZE + 0.05 * FONT_SIZE;
const anicLeft = iconLeft + ICON - 0.125 * FONT_SIZE;
const TOTAL = W_BO + W_ANIC + 84;
const groupX = (WIDTH - TOTAL) / 2;
const baselineY = 355;
const iconTop = baselineY - 0.1 * FONT_SIZE - ICON;

function fontFaceCss() {
	const b64 = readFileSync(FONT_FILE).toString("base64");
	const b64r = readFileSync(FONT_FILE_REGULAR).toString("base64");
	return `<style>
		@font-face{font-family:'Onest';font-style:normal;font-weight:700;src:url(data:font/woff2;base64,${b64}) format('woff2')}
		@font-face{font-family:'Onest';font-style:normal;font-weight:400;src:url(data:font/woff2;base64,${b64r}) format('woff2')}
	</style>`;
}

function defs() {
	return GRADIENTS.map(
		([id, cx, cy, rx, ry, color, alpha]) => {
			const stop = oklchToCss(color[0], color[1] * MESH.saturate, color[2]);
			return `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1" gradientTransform="translate(${(cx / 100) * WIDTH} ${(cy / 100) * HEIGHT}) scale(${(rx / 100) * WIDTH} ${(ry / 100) * HEIGHT})">
				<stop offset="0" stop-color="${stop}" stop-opacity="${alpha}"/>
				<stop offset="0.7" stop-color="${stop}" stop-opacity="0"/>
			</radialGradient>`;
		},
	).join("");
}

function rects() {
	const order = ["ga4", "ga3", "ga2", "ga1", "gb4", "gb3", "gb2", "gb1"];
	return order
		.map((id) => `<rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="url(#${id})"/>`)
		.join("");
}

function wordmark() {
	const sprout = `<svg x="${iconLeft}" y="${iconTop}" width="${ICON}" height="${ICON}" viewBox="0 0 24 24" fill="none" stroke="${LOGO}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${SPRUT_PATHS.map((d) => `<path d="${d}"/>`).join("")}</svg>`;
	return `<g transform="translate(${groupX - 15} 0)">
		<text x="0" y="${baselineY - 20}" font-family="Onest" font-size="${FONT_SIZE}" font-weight="700" fill="${LOGO}">Bo</text>
		${sprout}
		<text x="${anicLeft}" y="${baselineY - 20}" font-family="Onest" font-size="${FONT_SIZE}" font-weight="700" fill="${LOGO}">anic</text>
	</g>
	<text x="${WIDTH / 2}" y="${baselineY + 45}" font-family="Onest" font-size="${TAGLINE_SIZE}" font-weight="400" fill="${TAGLINE}" text-anchor="middle">Donde las plantas conocen a gente</text>`;
}

function buildSvg(includeFont) {
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
	${includeFont ? fontFaceCss() : ""}
	<defs>${defs()}</defs>
	<rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="${BASE}"/>
	${rects()}
	${wordmark()}
</svg>`;
}

const svg = buildSvg(true);
writeFileSync(resolve(root, "static/og-image.svg"), svg);

const resvg = new Resvg(buildSvg(false), {
	font: { fontFiles: [FONT_FILE, FONT_FILE_REGULAR], loadSystemFonts: true },
});
const png = resvg.render().asPng();
writeFileSync(resolve(root, "static/og-image.png"), png);

const jpg = await sharp(png).jpeg({ quality: 85, mozjpeg: true }).toBuffer();
writeFileSync(resolve(root, "static/og-image.jpg"), jpg);

console.log("W_BO:", W_BO.toFixed(1), "W_ANIC:", W_ANIC.toFixed(1), "TOTAL:", TOTAL.toFixed(1), "groupX:", groupX.toFixed(1));
console.log("ok!", png.length, "bytes png /", jpg.length, "bytes jpg");
