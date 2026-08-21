import { readdirSync, readFileSync, statSync } from "node:fs";
import { resolve, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const VIDEO_SRC = join(ROOT, "video", "src");

const HEX_RE = /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g;
const FONT_FAMILY_RE = /font-family\s*:\s*["']([^"']+)["']/g;
const OKLCH_RE = /oklch\([^)]*\)/g;
const RGBA_RE = /rgba?\([^)]*\)/g;
const COLOR_MIX_RE = /color-mix\([^)]*\)/g;

// Comentarios permitidos: hex en el SVG del Logo (paths de favicon) están permitidos
// porque replican exactamente el SVG fuente. Pero el lint solo escanea video/src.
const ALLOWED_FILES_WITH_HEX = new Set([
	// `Logo.tsx` replica los paths SVG del favicon que requieren fill={fg} exacto.
	// Como fg viene de un token (LOGO_FG), esto debería ser seguro, pero si
	// reintroducimos un hex directo en código React, falla.
]);

function walk(dir) {
	const out = [];
	for (const name of readdirSync(dir)) {
		const full = join(dir, name);
		const st = statSync(full);
		if (st.isDirectory()) out.push(...walk(full));
		else if (/\.(ts|tsx)$/.test(name)) out.push(full);
	}
	return out;
}

const violations = [];
const files = walk(VIDEO_SRC);

for (const file of files) {
	const rel = relative(ROOT, file);
	if (rel.includes("brand.generated.ts")) continue; // archivo generado, OK
	if (rel.includes(".remotion")) continue;

	const src = readFileSync(file, "utf8");

	for (const m of src.matchAll(HEX_RE)) {
		if (ALLOWED_FILES_WITH_HEX.has(rel)) continue;
		violations.push({ file: rel, type: "hex", match: m[0], line: lineOf(src, m.index) });
	}

	const ALLOWED_FONTS = new Set([
		"Fraunces Variable",
		"Fraunces",
		"Inter Variable",
		"Inter",
		"JetBrains Mono Variable",
		"JetBrains Mono",
	]);

	for (const m of src.matchAll(FONT_FAMILY_RE)) {
		const family = m[1];
		if (ALLOWED_FONTS.has(family)) continue;
		violations.push({ file: rel, type: "font", match: family, line: lineOf(src, m.index) });
	}

	// Avisos (no fallos): rgba()/rgb() literales deben migrarse a color-mix.
	for (const m of src.matchAll(RGBA_RE)) {
		violations.push({ file: rel, type: "rgba(warn)", match: m[0], line: lineOf(src, m.index), severity: "warn" });
	}
}

function lineOf(text, idx) {
	return text.slice(0, idx).split("\n").length;
}

if (violations.length === 0) {
	console.log(`lint:brand OK — ${files.length} archivos escaneados en video/src.`);
	process.exit(0);
}

const errors = violations.filter((v) => v.severity !== "warn");
const warns = violations.filter((v) => v.severity === "warn");

if (errors.length > 0) {
	console.error(`\nlint:brand FAILED — ${errors.length} errores:`);
	for (const v of errors) {
		console.error(`  ${v.file}:${v.line}  [${v.type}]  ${v.match}`);
	}
}
if (warns.length > 0) {
	console.warn(`\nlint:brand warnings — ${warns.length}:`);
	for (const v of warns) {
		console.warn(`  ${v.file}:${v.line}  [${v.type}]  ${v.match}`);
	}
}
process.exit(errors.length > 0 ? 1 : 0);
