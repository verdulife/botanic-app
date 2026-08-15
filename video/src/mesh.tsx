import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "./brand.generated";

const RGBA = (oklch: string, alpha: number) =>
	`color-mix(in oklch, ${oklch} ${Math.round(alpha * 100)}%, transparent)`;

const variants = {
	cozy: {
		a: [
			{ pos: "40% 55% at 22% 38%", color: COLORS["still-100"], a: 0.45 },
			{ pos: "36% 48% at 74% 28%", color: COLORS["still-200"], a: 0.3 },
			{ pos: "46% 60% at 58% 78%", color: COLORS["still-300"], a: 0.25 },
			{ pos: "30% 42% at 88% 62%", color: COLORS["linen-300"], a: 0.3 },
		],
		b: [
			{ pos: "42% 52% at 68% 58%", color: COLORS["still-100"], a: 0.4 },
			{ pos: "34% 50% at 28% 66%", color: COLORS["still-200"], a: 0.28 },
			{ pos: "44% 58% at 82% 24%", color: COLORS["still-300"], a: 0.22 },
			{ pos: "32% 44% at 14% 22%", color: COLORS["linen-300"], a: 0.28 },
		],
	},
	energy: {
		a: [
			{ pos: "40% 55% at 22% 38%", color: COLORS["still-700"], a: 0.55 },
			{ pos: "36% 48% at 74% 28%", color: COLORS["still-800"], a: 0.45 },
			{ pos: "46% 60% at 58% 78%", color: COLORS["still-900"], a: 0.7 },
			{ pos: "30% 42% at 88% 62%", color: COLORS["linen-900"], a: 0.45 },
		],
		b: [
			{ pos: "42% 52% at 68% 58%", color: COLORS["still-700"], a: 0.5 },
			{ pos: "34% 50% at 28% 66%", color: COLORS["still-800"], a: 0.4 },
			{ pos: "44% 58% at 82% 24%", color: COLORS["still-900"], a: 0.55 },
			{ pos: "32% 44% at 14% 22%", color: COLORS["linen-900"], a: 0.4 },
		],
	},
	minimal: {
		a: [
			{ pos: "40% 55% at 22% 38%", color: COLORS["still-200"], a: 0.22 },
			{ pos: "36% 48% at 74% 28%", color: COLORS["still-300"], a: 0.18 },
			{ pos: "46% 60% at 58% 78%", color: COLORS["linen-200"], a: 0.25 },
			{ pos: "30% 42% at 88% 62%", color: COLORS["linen-300"], a: 0.2 },
		],
		b: [
			{ pos: "42% 52% at 68% 58%", color: COLORS["still-200"], a: 0.2 },
			{ pos: "34% 50% at 28% 66%", color: COLORS["still-300"], a: 0.16 },
			{ pos: "44% 58% at 82% 24%", color: COLORS["linen-200"], a: 0.22 },
			{ pos: "32% 44% at 14% 22%", color: COLORS["linen-300"], a: 0.18 },
		],
	},
	wind: {
		a: [
			{ pos: "40% 55% at 22% 38%", color: COLORS["still-400"], a: 0.8 },
			{ pos: "36% 48% at 74% 28%", color: COLORS["still-400"], a: 0.55 },
			{ pos: "46% 60% at 58% 78%", color: COLORS["still-300"], a: 0.5 },
			{ pos: "30% 42% at 88% 62%", color: COLORS["linen-300"], a: 0.45 },
		],
		b: [
			{ pos: "42% 52% at 68% 58%", color: COLORS["still-400"], a: 0.7 },
			{ pos: "34% 50% at 28% 66%", color: COLORS["still-400"], a: 0.45 },
			{ pos: "44% 58% at 82% 24%", color: COLORS["linen-300"], a: 0.4 },
			{ pos: "32% 44% at 14% 22%", color: COLORS["still-400"], a: 0.35 },
		],
	},
} as const;

export type MeshVariant = keyof typeof variants;

const WIND_DRIFT = { period: 40, from: { x: -1.5, y: -1, r: -1 }, to: { x: 1.5, y: 1, r: 1 } };
const WIND_BREATHE = { period: 14, from: 0.35, to: 1 };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const triangle = (t: number, period: number) => {
	const p = (t % (period * 2)) / period;
	return p > 1 ? 2 - p : p;
};

function buildLayer(stops: ReadonlyArray<{ pos: string; color: string; a: number }>) {
	return stops.map((s) => `radial-gradient(${s.pos}, ${RGBA(s.color, s.a)}, transparent 70%)`).join(", ");
}

export const MeshBackground: React.FC<{ variant: MeshVariant; wind?: boolean }> = ({
	variant,
	wind = false,
}) => {
	const v = variants[variant];
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const isWind = wind && variant === "wind";
	let drift = "none";
	let breathA = 1;
	let breathB = 1;
	if (isWind) {
		const t = frame / fps;
		const dp = triangle(t, WIND_DRIFT.period);
		drift = `translate3d(${lerp(WIND_DRIFT.from.x, WIND_DRIFT.to.x, dp)}%, ${lerp(
			WIND_DRIFT.from.y,
			WIND_DRIFT.to.y,
			dp
		)}%, 0) rotate(${lerp(WIND_DRIFT.from.r, WIND_DRIFT.to.r, dp)}deg)`;
		breathA = lerp(WIND_BREATHE.from, WIND_BREATHE.to, triangle(t, WIND_BREATHE.period));
		breathB = lerp(WIND_BREATHE.from, WIND_BREATHE.to, triangle(t + WIND_BREATHE.period / 2, WIND_BREATHE.period));
	}

	return (
		<div
			style={{
				position: "absolute",
				inset: 0,
				pointerEvents: "none",
				overflow: "hidden",
				background:
					variant === "energy"
						? COLORS["still-900"]
						: variant === "minimal"
							? COLORS["linen-200"]
							: COLORS["linen-100"],
			}}
			aria-hidden="true"
		>
			<div style={{ position: "absolute", inset: "-15%", transform: drift }}>
				<div
					style={{
						position: "absolute",
						inset: 0,
						background: buildLayer(v.a),
						filter: isWind ? "saturate(1.5)" : undefined,
						opacity: breathA,
					}}
				/>
				<div
					style={{
						position: "absolute",
						inset: 0,
						background: buildLayer(v.b),
						filter: isWind ? "saturate(1.5)" : undefined,
						opacity: breathB,
					}}
				/>
			</div>
		</div>
	);
};
