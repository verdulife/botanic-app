import React from "react";
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
} as const;

export type MeshVariant = keyof typeof variants;

function buildLayer(stops: ReadonlyArray<{ pos: string; color: string; a: number }>) {
	return stops.map((s) => `radial-gradient(${s.pos}, ${RGBA(s.color, s.a)}, transparent 70%)`).join(", ");
}

export const MeshBackground: React.FC<{ variant: MeshVariant }> = ({ variant }) => {
	const v = variants[variant];
	return (
		<div
			style={{
				position: "absolute",
				inset: 0,
				pointerEvents: "none",
				overflow: "hidden",
				background: v.a[0].color === COLORS["still-100"] ? COLORS["linen-100"] : COLORS["still-900"],
			}}
			aria-hidden="true"
		>
			<div style={{ position: "absolute", inset: "-15%", background: buildLayer(v.a) }} />
			<div style={{ position: "absolute", inset: "-15%", background: buildLayer(v.b) }} />
		</div>
	);
};
