import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS, FONT_FAMILY } from "../../brand";
import { WordmarkDraw } from "../WordmarkDraw";

export const Cta: React.FC<{ button?: string }> = ({ button = "www.botanicapp.es" }) => {
	const frame = useCurrentFrame();
	const drawProgress = interpolate(frame, [24, 78], [0, 100], {
		easing: Easing.out(Easing.cubic),
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const logoOpacity = interpolate(frame, [0, 24], [0, 1], {
		easing: Easing.out(Easing.cubic),
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const strokeFade = interpolate(frame, [78, 84], [0, 1], {
		easing: Easing.out(Easing.cubic),
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const buttonOpacity = interpolate(frame, [78, 90], [0, 1], {
		easing: Easing.out(Easing.cubic),
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<div
			style={{
				position: "absolute",
				inset: 0,
				background: COLORS["still-400"],
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				gap: 88,
				padding: 64,
			}}
		>
			<WordmarkDraw
				width={652}
				color={COLORS["linen-50"]}
				progress={drawProgress}
				strokeFade={strokeFade}
				opacity={logoOpacity}
			/>
			<div
				style={{
					fontFamily: FONT_FAMILY,
					fontWeight: 600,
					fontSize: 46,
					padding: "32px 72px",
					borderRadius: 999,
					background: COLORS["linen-50"],
					color: COLORS["still-400"],
					letterSpacing: "normal",
					opacity: buttonOpacity,
				}}
			>
				{button}
			</div>
		</div>
	);
};
