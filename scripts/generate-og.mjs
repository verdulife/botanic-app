import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const WIDTH = 1200;
const HEIGHT = 630;

function oklchToRgb(L, C, hDeg) {
	const h = (hDeg * Math.PI) / 180;
	const a = C * Math.cos(h);
	const b = C * Math.sin(h);
	const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
	const m_ = L - 0.105563456 * a - 0.0638541728 * b;
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

// Tagline en Inter (sans de apoyo); su VF tiene default wght=400
const FONT_SANS = resolve(
	root,
	"node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
);
const TAGLINE_SIZE = 42;
const TAGLINE_Y = 412;

// Wordmark vectorial desde la única fuente de verdad: Logo.svelte.
// Los paths se centran con matemática exacta del viewBox: sin autocalibración.
const logoRaw = readFileSync(resolve(root, "src/lib/components/Logo.svelte"), "utf8");
const vbMatch = logoRaw.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
if (!vbMatch) throw new Error("No se encontró viewBox en Logo.svelte");

const WM_W = 495;
const WM_H = (WM_W * Number(vbMatch[2])) / Number(vbMatch[1]);
const WM_X = (WIDTH - WM_W) / 2;
const WM_Y = 225;

const WORDMARK = logoRaw
	.match(/<svg[\s\S]*<\/svg>/)[0]
	.replace(/\s+class=\{[^}]*\}/, "")
	.replace(/fill="currentColor"/, `fill="${INK}"`)
	.replace(/<svg\b/, `<svg x="${WM_X}" y="${WM_Y}" width="${WM_W}" height="${WM_H.toFixed(2)}"`);

// Textura de hojas blancas como fondo con cover al 50%.
// OJO con resvg y svg anidado: aplica DOBLE la opacity del <svg>, ancla mal el
// slice Y RECORTA el contenido (~80% del alto) aunque se le dé un viewBox
// explícito (todo verificado empíricamente). Solución: nada de svg anidado;
// un <g> con transform scale+translate que reproduce el cover a mano.
const LEAVES_SRC = resolve(root, "static/images/leaves-texture.svg");
const leavesRaw = readFileSync(LEAVES_SRC, "utf8");
const LV = leavesRaw.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
if (!LV) throw new Error("No se encontró viewBox en leaves-texture.svg");

const coverScale = WIDTH / Number(LV[1]);
const winY = (Number(LV[2]) - HEIGHT / coverScale) / 2;

const LEAVES =
	`<g opacity="0.5" transform="scale(${coverScale.toFixed(4)}) translate(0 ${(-winY).toFixed(2)})">` +
	leavesRaw
		.match(/<g[\s\S]*<\/g>/)[0]
		.replace(/class="cls-1"/g, `fill="#ffffff" fill-rule="evenodd"`) +
	"</g>";

function buildSvg() {
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
	<rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="${BG}"/>
	${LEAVES}
	${WORDMARK}
	<text x="${WIDTH / 2}" y="${TAGLINE_Y}" font-family="Inter" font-size="${TAGLINE_SIZE}" font-weight="400" fill="${TAGLINE_INK}" letter-spacing="1" text-anchor="middle">Donde las plantas conocen a gente nueva</text>
</svg>`;
}

const png = new Resvg(buildSvg(), {
	font: { fontFiles: [readFileSync(FONT_SANS)], loadSystemFonts: false },
}).render().asPng();

writeFileSync(resolve(root, "static/og-image.svg"), buildSvg());
writeFileSync(resolve(root, "static/og-image.png"), png);

const jpg = await sharp(png)
	.jpeg({ quality: 85, mozjpeg: true, chromaSubsampling: "4:4:4" })
	.toBuffer();
writeFileSync(resolve(root, "static/og-image.jpg"), jpg);

console.log("ok!", png.length, "bytes png /", jpg.length, "bytes jpg");
