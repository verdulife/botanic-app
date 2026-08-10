import { mkdirSync, existsSync, rmSync, readdirSync } from "node:fs";
import { resolve, dirname, basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const FFMPEG_BIN = (await import("ffmpeg-static")).default;
if (!FFMPEG_BIN) {
	console.error("No se pudo resolver ffmpeg-static (binario ausente). ¿`bun install` falló?");
	process.exit(1);
}

function parseDuration(stderr) {
	const m = stderr.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
	if (!m) return null;
	return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);
}

function runFfmpeg(args) {
	return new Promise((resolveP, rejectP) => {
		const proc = spawn(FFMPEG_BIN, args, { stdio: ["ignore", "ignore", "pipe"] });
		let stderr = "";
		proc.stderr.on("data", (chunk) => {
			stderr += chunk.toString();
		});
		proc.on("error", rejectP);
		proc.on("close", (code) => {
			if (code === 0) resolveP({ stderr });
			else rejectP(new Error(`ffmpeg exit ${code}: ${stderr.split("\n").slice(-3).join("\n")}`));
		});
	});
}

function fmtTime(seconds) {
	const m = Math.floor(seconds / 60);
	const s = Math.floor(seconds % 60);
	const cs = Math.floor((seconds * 10) % 10);
	return `${m}:${String(s).padStart(2, "0")}.${cs}`;
}

function timestampSvg(label, w) {
	const fontSize = Math.max(14, Math.round(w * 0.08));
	const pad = Math.round(fontSize * 0.5);
	return Buffer.from(
		`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${fontSize + pad * 2}">
			<rect x="0" y="0" width="${w}" height="${fontSize + pad * 2}" fill="rgba(0,0,0,0.6)"/>
			<text x="${pad}" y="${fontSize + pad / 2}" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="700" fill="#ffffff">${label}</text>
		</svg>`,
	);
}

async function extractFrames(videoPath, frameDir, fps, width) {
	mkdirSync(frameDir, { recursive: true });
	const outPattern = join(frameDir, "f-%04d.jpg");
	await runFfmpeg([
		"-y",
		"-i",
		videoPath,
		"-vf",
		`fps=${fps},scale=${width}:-1`,
		"-q:v",
		"3",
		outPattern,
	]);
	return readdirSync(frameDir)
		.filter((f) => f.endsWith(".jpg"))
		.sort();
}

async function main() {
	const argv = process.argv.slice(2);
	const input = argv[0];
	const out = (argv[1] ?? "").replace(/\.png$/i, "");
	const count = Number(argv[2]) || 8;
	const cols = Number(argv[3]) || 4;
	const thumb = Number(argv[4]) || 280;
	if (!input || !out) {
		console.error("Uso: bun run frames <input.mp4> <out.png> [count=8] [cols=4] [thumb=280]");
		process.exit(1);
	}

	const absIn = resolve(ROOT, input);
	const absOut = resolve(ROOT, `${out}.png`);
	if (!existsSync(absIn)) {
		console.error(`No existe: ${absIn}`);
		process.exit(1);
	}

	const tmpProbe = await new Promise((resolveP) => {
	const proc = spawn(FFMPEG_BIN, ["-i", absIn], { stdio: ["ignore", "ignore", "pipe"] });
	let stderr = "";
	proc.stderr.on("data", (c) => (stderr += c.toString()));
	proc.on("close", () => resolveP({ stderr }));
});
	const duration = parseDuration(tmpProbe.stderr);
	if (!duration || duration <= 0) {
		console.error("No se pudo obtener la duración del vídeo.");
		process.exit(1);
	}

	const fps = 10;
	const width = thumb;
	const slug = basename(input).replace(/\.[^.]+$/, "");
	const frameDir = join(__dirname, ".tmp", `frames-${slug}-${Date.now()}`);
	const frames = await extractFrames(absIn, frameDir, fps, width);
	if (frames.length === 0) {
		console.error("ffmpeg no extrajo frames.");
		rmSync(frameDir, { recursive: true, force: true });
		process.exit(1);
	}

	const step = frames.length / count;
	const picks = Array.from({ length: count }, (_, i) => frames[Math.min(Math.floor(i * step), frames.length - 1)]);

	const rows = Math.ceil(count / cols);
	const gutter = 8;
	const cellW = thumb;
	const cellH = Math.round(thumb * (16 / 9));
	const labelH = Math.round(thumb * 0.18);
	const tileH = cellH + labelH;

	const compositeW = cols * cellW + (cols + 1) * gutter;
	const compositeH = rows * tileH + (rows + 1) * gutter;

	const composites = await Promise.all(
		picks.map(async (file, i) => {
			const idx = frames.indexOf(file);
			const t = (idx / fps);
			const buf = await sharp(join(frameDir, file))
				.resize({ width: cellW, height: cellH, fit: "cover" })
				.composite([{ input: timestampSvg(`${fmtTime(t)} · ${slug}`, cellW), top: cellH, left: 0 }])
				.png()
				.toBuffer();
			const col = i % cols;
			const row = Math.floor(i / cols);
			return { input: buf, left: gutter + col * (cellW + gutter), top: gutter + row * (tileH + gutter) };
		}),
	);

	await sharp({
		create: { width: compositeW, height: compositeH, channels: 3, background: { r: 247, g: 243, b: 236 } },
	})
		.composite(composites)
		.png({ compressionLevel: 9 })
		.toFile(absOut);

	rmSync(frameDir, { recursive: true, force: true });

	const size = (await import("node:fs")).statSync(absOut);
	console.log(`OK ${absOut} (${compositeW}×${compositeH}, ${(size.size / 1024).toFixed(1)} KB)`);
	console.log(`Frames: ${count} de ${frames.length} extraídos (${duration.toFixed(1)}s @${fps}fps).`);
}

main().catch((e) => {
	console.error(e?.message ?? e);
	process.exit(1);
});