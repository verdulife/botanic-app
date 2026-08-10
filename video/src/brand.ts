import { COLORS, FONT_FAMILY, RADIUS } from "./brand.generated";
import type { MotionStyle } from "./types";

export { COLORS, FONT_FAMILY, RADIUS };
export type { ColorToken, RadiusToken } from "./brand.generated";

const RGBA = (oklch: string, alpha: number) =>
	`color-mix(in oklch, ${oklch} ${Math.round(alpha * 100)}%, transparent)`;

export interface StyleTokens {
	background: string;
	text: string;
	accent: string;
	overlay: string;
	textOnImage: string;
	shadow: string;
	enter: (i: number) => string;
}

const enterSlideUp = (i: number) => `translateY(${40 + i * 12}px)`;
const enterFade = () => "none";
const enterZoom = (i: number) => `scale(${1.08 + i * 0.02})`;

export const styles: Record<MotionStyle, StyleTokens> = {
	energy: {
		background: COLORS["still-900"],
		text: COLORS["linen-50"],
		accent: COLORS["still-400"],
		overlay: `linear-gradient(180deg, ${RGBA(COLORS["still-900"], 0.15)} 0%, ${RGBA(COLORS["still-900"], 0.9)} 100%)`,
		textOnImage: COLORS["linen-50"],
			shadow: `0 2px 24px ${RGBA(COLORS["still-900"], 0.35)}`,
		enter: enterSlideUp,
	},
	cozy: {
		background: COLORS["linen-100"],
		text: COLORS["still-950"],
		accent: COLORS["still-700"],
		overlay: `linear-gradient(180deg, ${RGBA(COLORS["linen-100"], 0)} 0%, ${RGBA(COLORS["linen-100"], 0.85)} 100%)`,
		textOnImage: COLORS["still-950"],
		shadow: `0 2px 24px ${RGBA(COLORS["linen-100"], 0.35)}`,
		enter: enterFade,
	},
	minimal: {
		background: COLORS["linen-200"],
		text: COLORS["still-900"],
		accent: COLORS["still-800"],
		overlay: `linear-gradient(180deg, ${RGBA(COLORS["still-950"], 0)} 0%, ${RGBA(COLORS["still-950"], 0.75)} 100%)`,
		textOnImage: COLORS["linen-50"],
		shadow: `0 2px 24px ${RGBA(COLORS["still-950"], 0.35)}`,
		enter: enterZoom,
	},
};

export function getStyle(style: MotionStyle): StyleTokens {
	return styles[style];
}

// Logo: bg/fg fijos para mantener coherencia con el favicon.
export const LOGO_BG = COLORS["linen-100"];
export const LOGO_FG = COLORS["still-800"];
