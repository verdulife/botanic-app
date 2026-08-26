import { globSync, statSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname, join, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC_DIR = join(ROOT, 'static/images/seed-source');
const OUT_DIR = join(ROOT, 'static/images/seed');
const BUDGET = 50 * 1024;
const HARD = 120 * 1024;
const MAX_WIDTH = 720;

const force = process.argv.includes('--force');

function kb(n) {
	return `${(n / 1024).toFixed(1)} KB`;
}

async function bestQuality(buf, target) {
	let lo = 30;
	let hi = 78;
	let best = null;
	while (lo <= hi) {
		const q = Math.round((lo + hi) / 2);
		const out = await sharp(buf)
			.rotate()
			.resize({ width: MAX_WIDTH, height: MAX_WIDTH, fit: 'inside', withoutEnlargement: true })
			.webp({ quality: q })
			.toBuffer();
		if (out.length <= target) {
			best = { q, buf: out, size: out.length };
			lo = q + 1;
		} else {
			hi = q - 1;
		}
	}
	return best;
}

async function fallback(buf) {
	const out = await sharp(buf)
		.rotate()
		.resize({ width: MAX_WIDTH, height: MAX_WIDTH, fit: 'inside', withoutEnlargement: true })
		.webp({ quality: 30 })
		.toBuffer();
	return { q: 30, buf: out, size: out.length, overBudget: true };
}

mkdirSync(OUT_DIR, { recursive: true });

const files = globSync('**/*.{jpg,jpeg,png}', { cwd: SRC_DIR }).map((f) => join(SRC_DIR, f));

if (files.length === 0) {
	console.error(`No hay imágenes en ${SRC_DIR}`);
	console.error('Coloca .jpg/.png en static/images/seed-source/ y vuelve a ejecutar.');
	process.exit(1);
}

console.log(`Procesando ${files.length} imágenes → ${OUT_DIR.replace(ROOT + '\\', '')}/`);
console.log(`${'archivo'.padEnd(34)} ${'origen'.padStart(10)} ${'webp'.padStart(10)} ${'@w'.padStart(5)} ${'q'.padStart(3)}`);
console.log('-'.repeat(70));

let totalSrc = 0;
let totalOut = 0;
let skipped = 0;

for (const src of files) {
	const name = basename(src, extname(src));
	const outPath = join(OUT_DIR, `${name}.webp`);
	const srcTime = statSync(src).mtimeMs;

	if (!force && existsSync(outPath) && statSync(outPath).mtimeMs >= srcTime) {
		skipped++;
		continue;
	}

	const buf = readFileSync(src);
	totalSrc += buf.length;

	let result = await bestQuality(buf, BUDGET);
	if (!result) {
		result = await fallback(buf);
	}

	writeFileSync(outPath, result.buf);
	totalOut += result.size;

	const meta = await sharp(result.buf).metadata();
	const flag = result.overBudget ? ' ·>120KB' : '';
	console.log(
		`${name.padEnd(34)} ${kb(buf.length).padStart(10)} ${kb(result.size).padStart(10)} ${String(meta.width).padStart(5)} ${String(result.q).padStart(3)}${flag}`
	);
}

console.log('-'.repeat(70));
console.log(
	`TOTAL: ${kb(totalSrc)} → ${kb(totalOut)} (${files.length - skipped} nuevas, ${skipped} ya optimizadas)${force ? ' [force]' : ''}`
);