import opentype from "opentype.js";
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";

const TMP = import.meta.dir + "/.tmp/";
mkdirSync(TMP, { recursive: true });

const font = opentype.parse(
	readFileSync("node_modules/@fontsource/onest/files/onest-latin-700-normal.woff")
);

const fontSize = 1000;
const scale = fontSize / font.unitsPerEm;
const tracking = -0.025 * fontSize;

function trace(text, startX, startY = 0) {
	const combined = new opentype.Path();
	let x = startX;
	for (const ch of text) {
		const glyph = font.charToGlyph(ch);
		combined.extend(glyph.getPath(x, startY, fontSize));
		x += glyph.advanceWidth * scale + tracking;
	}
	return combined;
}

function bbox(p) {
	const b = p.getBoundingBox();
	return { x1: b.x1, y1: b.y1, x2: b.x2, y2: b.y2 };
}

const bo0 = trace("Bo", 0);
const anic0 = trace("anic", 0);
const boB = bbox(bo0);
const anicB = bbox(anic0);

const textY1 = Math.min(boB.y1, anicB.y1);
const textY2 = Math.max(boB.y2, anicB.y2);
const textCY = (textY1 + textY2) / 2;

const boWidth = boB.x2 - boB.x1;
const anicWidth = anicB.x2 - anicB.x1;

const GAP = 50; // 0.05em
const SPR = 0.9 * fontSize; // 900
const sprBoxLeft = boWidth + GAP;
const sprTopFont = textCY - SPR / 2;
const anicStart = sprBoxLeft + SPR + GAP;

const contentY1 = Math.min(textY1, sprTopFont);
const contentY2 = Math.max(textY2, sprTopFont + SPR);
const PAD = 20;
const baseline = -contentY1 + PAD;
const H = baseline + contentY2 + PAD;
const W = anicStart + anicWidth;

const bo = trace("Bo", -boB.x1, baseline).toPathData(1);
const anic = trace("anic", anicStart - anicB.x1, baseline).toPathData(1);

// sprout paths (24-unit lucide box) -> drawn at sprBoxLeft..sprBoxLeft+SPR, baseline+sprTopFont..baseline+sprTopFont+SPR
const sproutPaths = `
		<path d="M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3"/>
		<path d="M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4"/>
		<path d="M5 21h14"/>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
	<path fill="#224329" d="${bo}"/>
	<g transform="translate(${sprBoxLeft} ${baseline + sprTopFont}) scale(${SPR / 24})" fill="none" stroke="#224329" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
${sproutPaths}
	</g>
	<path fill="#224329" d="${anic}"/>
</svg>
`;

const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 600 } });
writeFileSync(TMP + "logo-traced.png", resvg.render().asPng());

const component = `<script lang="ts">
	let {
		class: className = "h-7",
	}: { class?: string } = \u0024props();
</script>

<svg
	viewBox="0 0 ${W} ${H}"
	class="text-still-800 {className}"
	role="img"
	aria-label="Botanic"
	focusable="false"
>
	<path fill="currentColor" d="${bo}" />
	<g
		transform="translate(${sprBoxLeft} ${baseline + sprTopFont}) scale(${SPR / 24})"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
${sproutPaths}
	</g>
	<path fill="currentColor" d="${anic}" />
</svg>
`;

writeFileSync(import.meta.dir + "/../src/lib/components/Logo.svelte", component);

console.log("W", W, "H", H, "baseline", baseline);
console.log("textY1", textY1, "textY2", textY2, "textCY", textCY, "sprTopFont", sprTopFont);
console.log("sprBoxLeft", sprBoxLeft, "anicStart", anicStart);
console.log("preview:", TMP, "logo-traced.png");
console.log("component written: src/lib/components/Logo.svelte");
