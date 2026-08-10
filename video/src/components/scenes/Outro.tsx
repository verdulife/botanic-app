import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { FONT_FAMILY, type StyleTokens } from "../../brand";
import { Logo } from "../Logo";

export const Outro: React.FC<{
	text: string;
	style: StyleTokens;
}> = ({ text, style }) => {
	const frame = useCurrentFrame();
	const opacity = interpolate(frame, [0, 12], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	return (
		<div
			style={{
				position: "absolute",
				inset: 0,
				background: style.background,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				gap: 28,
				padding: 48,
				opacity,
			}}
		>
			<Logo size={120} />
			<div
				style={{
					fontFamily: FONT_FAMILY,
					fontWeight: 700,
					fontSize: 56,
					lineHeight: 1.1,
					letterSpacing: "normal",
					color: style.text,
					textAlign: "center",
					textWrap: "balance",
					maxWidth: "85%",
				}}
			>
				{text}
			</div>
			<div
				style={{
					fontFamily: FONT_FAMILY,
					fontWeight: 500,
					fontSize: 32,
					color: style.accent,
					letterSpacing: "normal",
				}}
			>
				@botanic.app
			</div>
		</div>
	);
};
