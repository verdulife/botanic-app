import { logoSvg } from "$lib/logo-svg";

export const FOUNDER_CARD_WIDTH = 1080;
export const FOUNDER_CARD_HEIGHT = 1350;
export const FOUNDER_CARD_MAX_POSITION = 999;

const COLORS = {
	bg: "#FFEB82",
	ink: "#0F1F13",
	logo: "#224329",
	tagline: "#32693C",
	footer: "#285431",
} as const;

function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
		img.src = src;
	});
}

let assetsPromise: Promise<[HTMLImageElement, HTMLImageElement]> | null = null;

function loadAssets(): Promise<[HTMLImageElement, HTMLImageElement]> {
	assetsPromise ??= Promise.all([
		loadImage("/images/leaves-texture.svg"),
		loadImage(
			`data:image/svg+xml;charset=utf-8,${encodeURIComponent(logoSvg({ fill: COLORS.logo }))}`
		),
	]);
	return assetsPromise;
}

async function loadFonts(): Promise<void> {
	if (typeof document === "undefined") return;
	try {
		await Promise.all([
			document.fonts.load('400 100px "Fraunces Variable"'),
			document.fonts.load('300 46px "Inter Variable"'),
			document.fonts.load('400 30px "JetBrains Mono Variable"'),
		]);
	} catch {
		// Sin fuentes precargadas se dibuja con los fallbacks del stack
	}
}

function drawCover(
	ctx: CanvasRenderingContext2D,
	img: HTMLImageElement,
	width: number,
	height: number
): void {
	const scale = Math.max(width / img.width, height / img.height);
	const w = img.width * scale;
	const h = img.height * scale;
	ctx.drawImage(img, (width - w) / 2, (height - h) / 2, w, h);
}

function centeredText(
	ctx: CanvasRenderingContext2D,
	text: string,
	cx: number,
	y: number
): void {
	ctx.textAlign = "center";
	ctx.fillText(text, cx, y);
}

const GOLD_GRADIENT_STOPS: Array<[number, string]> = [
	[0, "#F6E27A"],
	[0.35, "#D4AF37"],
	[0.55, "#8C6D1F"],
	[0.75, "#C9A227"],
	[1, "#F9EFB2"],
];

function drawEmbossedNumber(
	ctx: CanvasRenderingContext2D,
	text: string,
	cx: number,
	y: number
): void {
	const offset = 6;
	ctx.font = '400 300px "Fraunces Variable"';
	ctx.textAlign = "center";

	ctx.fillStyle = "rgba(67, 29, 5, 0.45)";
	ctx.fillText(text, cx + offset, y + offset);

	ctx.fillStyle = "#FFF9D6";
	ctx.fillText(text, cx - offset, y - offset);

	const gold = ctx.createLinearGradient(cx - 160, y - 160, cx + 160, y + 160);
	for (const [stop, color] of GOLD_GRADIENT_STOPS) {
		gold.addColorStop(stop, color);
	}
	ctx.fillStyle = gold;
	ctx.fillText(text, cx, y);

	ctx.strokeStyle = "rgba(15, 31, 19, 0.15)";
	ctx.lineWidth = 2;
	ctx.strokeText(text, cx, y);
}

function drawGoldFrame(
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number
): void {
	const inset = 44;
	const radius = 24;
	const gold = ctx.createLinearGradient(inset, inset, width - inset, height - inset);
	for (const [stop, color] of GOLD_GRADIENT_STOPS) {
		gold.addColorStop(stop, color);
	}
	const roundRect = (
		ctx as CanvasRenderingContext2D & {
			roundRect?: (x: number, y: number, w: number, h: number, r: number) => void;
		}
	).roundRect;
	ctx.strokeStyle = gold;
	ctx.lineWidth = 3;
	ctx.beginPath();
	if (roundRect) {
		roundRect.call(ctx, inset, inset, width - inset * 2, height - inset * 2, radius);
	} else {
		ctx.rect(inset, inset, width - inset * 2, height - inset * 2);
	}
	ctx.stroke();
}

export function formatPosition(position: number): string {
	return `#${String(position).padStart(3, "0")}`;
}

export function founderCardFileName(position: number): string {
	return `botanic-semilla-fundadora-${String(position).padStart(3, "0")}.png`;
}

export async function renderFounderCard(position: number): Promise<Blob | null> {
	if (typeof window === "undefined") return null;

	const [leaves, logo] = await loadAssets();
	await loadFonts();

	const canvas = document.createElement("canvas");
	canvas.width = FOUNDER_CARD_WIDTH;
	canvas.height = FOUNDER_CARD_HEIGHT;
	const ctx = canvas.getContext("2d");
	if (!ctx) return null;
	const cx = FOUNDER_CARD_WIDTH / 2;

	ctx.fillStyle = COLORS.bg;
	ctx.fillRect(0, 0, FOUNDER_CARD_WIDTH, FOUNDER_CARD_HEIGHT);

	ctx.save();
	ctx.globalAlpha = 0.25;
	drawCover(ctx, leaves, FOUNDER_CARD_WIDTH, FOUNDER_CARD_HEIGHT);
	ctx.restore();

	drawGoldFrame(ctx, FOUNDER_CARD_WIDTH, FOUNDER_CARD_HEIGHT);

	const logoWidth = 476;
	const logoHeight = logoWidth * (logo.height / logo.width);
	ctx.drawImage(logo, cx - logoWidth / 2, 110, logoWidth, logoHeight);

	drawEmbossedNumber(ctx, formatPosition(position), cx, 690);

	ctx.fillStyle = COLORS.ink;
	ctx.font = '400 112px "Fraunces Variable"';
	centeredText(ctx, "Semilla fundadora", cx, 895);

	ctx.font = '300 46px "Inter Variable"';
	ctx.fillStyle = COLORS.tagline;
	centeredText(ctx, "Donde las plantas conocen a gente", cx, 985);

	ctx.font = '400 30px "JetBrains Mono Variable"';
	ctx.fillStyle = COLORS.footer;
	if ("letterSpacing" in ctx) {
		(ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "6px";
	}
	centeredText(ctx, "WWW.BOTANICAPP.ES", cx, 1230);

	return new Promise((resolve) => {
		canvas.toBlob((blob) => resolve(blob), "image/png");
	});
}
