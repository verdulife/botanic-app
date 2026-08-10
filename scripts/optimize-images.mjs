import { globSync, statSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { encodeToBudget, WEBP_CFG, JPG_CFG } from "./lib/encode-budget.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const force = process.argv.includes("--force");

const files = globSync("static/images/**/*.{jpg,jpeg,png}").map((f) => join(ROOT, f));

function kb(n) {
	return `${(n / 1024).toFixed(1)} KB`;
}

let totalOld = 0;
let totalJpg = 0;
let totalWebp = 0;
let skipped = 0;

console.log(`${"archivo".padEnd(46)} ${"antes".padStart(8)} ${"jpg".padStart(8)} ${"webp".padStart(8)}`);
console.log("-".repeat(78));

for (const src of files) {
	const base = src.replace(/\.(jpe?g|png)$/i, "");
	const jpgOut = `${base}.jpg`;
	const webpOut = `${base}.webp`;
	const srcTime = statSync(src).mtimeMs;
	if (
		!force &&
		existsSync(jpgOut) &&
		existsSync(webpOut) &&
		statSync(jpgOut).mtimeMs >= srcTime &&
		statSync(webpOut).mtimeMs >= srcTime
	) {
		skipped++;
		continue;
	}

	const buf = readFileSync(src);
	const oldSize = buf.length;
	const jpg = await encodeToBudget(buf, JPG_CFG, "jpeg");
	const webp = await encodeToBudget(buf, WEBP_CFG, "webp");

	writeFileSync(jpgOut, jpg.buf);
	writeFileSync(webpOut, webp.buf);

	totalOld += oldSize;
	totalJpg += jpg.size;
	totalWebp += webp.size;

	const name = src.replace(/^.*[\\/]static[\\/]/, "static/");
	const flag = jpg.overBudget || webp.overBudget ? " ·>100KB" : "";
	console.log(
		`${name.padEnd(46)} ${kb(oldSize).padStart(8)} ${kb(jpg.size).padStart(8)} ${kb(webp.size).padStart(8)}${flag}`,
	);
}

console.log("-".repeat(78));
if (totalOld > 0) {
	const savedJpg = totalOld - totalJpg;
	const savedWebp = totalOld - totalWebp;
	console.log(
		`TOTAL: ${kb(totalOld)} → jpg ${kb(totalJpg)} (${kb(savedJpg)}) · webp ${kb(totalWebp)} (${kb(savedWebp)})`,
	);
} else {
	console.log(`Sin cambios (${skipped} ya optimizadas). Usa --force para re-encodear todo.`);
}
