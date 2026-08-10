import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { FONT_FAMILY, type StyleTokens } from "../../brand";

export const Hook: React.FC<{
	text: string;
	style: StyleTokens;
}> = ({ text, style }) => {
	const frame = useCurrentFrame();
	const opacity = interpolate(frame, [0, 15, 40], [0, 1, 1], {
		extrapolateRight: "clamp",
	});
	const y = interpolate(frame, [0, 30], [40, 0], {
		easing: Easing.out(Easing.cubic),
		extrapolateRight: "clamp",
	});
	return (
		<div
			style={{
				position: "absolute",
				inset: 0,
				background: style.background,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: 48,
				opacity,
			}}
		>
			<div style={{ transform: `translateY(${y}px)`, maxWidth: "85%" }}>
				<h1
					style={{
						fontFamily: FONT_FAMILY,
						fontWeight: 300,
						fontSize: 96,
						lineHeight: 1.05,
						letterSpacing: "normal",
						color: style.text,
						margin: 0,
						textAlign: "center",
						textWrap: "balance",
					}}
				>
					{text}
				</h1>
				<div
					style={{
						marginTop: 32,
						height: 8,
						width: 96,
						borderRadius: 4,
						background: style.accent,
						marginLeft: "auto",
						marginRight: "auto",
					}}
				/>
			</div>
		</div>
	);
};
