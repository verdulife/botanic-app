import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS, FONT_FAMILY } from "../../brand";

const Strong: React.FC<{ text: string }> = ({ text }) => (
	<>
		{text.split("**").map((part, i) =>
			i % 2 === 1 ? (
				<span key={i} style={{ fontWeight: 600 }}>
					{part}
				</span>
			) : (
				<React.Fragment key={i}>{part}</React.Fragment>
			)
		)}
	</>
);

export const Outro: React.FC<{ text: string }> = ({ text }) => {
	const frame = useCurrentFrame();
	const slideX = interpolate(frame, [0, 30], [40, 0], {
		easing: Easing.out(Easing.cubic),
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const opacity = interpolate(
		frame,
		[0, 12, 90, 105],
		[0, 1, 1, 0],
		{
			easing: Easing.out(Easing.cubic),
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		},
	);
	return (
		<div
			style={{
				position: "absolute",
				inset: 0,
				background: COLORS["still-400"],
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: "0 80px",
			}}
		>
			<div
				style={{
					transform: `translateX(${slideX}vw)`,
					opacity,
					width: "100%",
					display: "flex",
					justifyContent: "center",
				}}
			>
				<p
					style={{
						fontFamily: FONT_FAMILY,
						fontWeight: 300,
						fontSize: 120,
						lineHeight: 1.15,
						letterSpacing: "normal",
						color: COLORS["linen-50"],
						textAlign: "center",
						margin: 0,
						textWrap: "balance",
					}}
				>
					<Strong text={text} />
				</p>
			</div>
		</div>
	);
};
