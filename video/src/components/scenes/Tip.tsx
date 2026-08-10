import React from "react";
import { useCurrentFrame, interpolate, Easing, Img } from "remotion";
import { FONT_FAMILY, type StyleTokens } from "../../brand";
import { resolveMedia } from "../../media";

export const Tip: React.FC<{
	text: string;
	style: StyleTokens;
	media?: string;
	index: number;
}> = ({ text, style, media, index }) => {
	const frame = useCurrentFrame();
	const enter = frame - index * 4;
	const opacity = interpolate(enter, [0, 12], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const y = interpolate(enter, [0, 20], [50, 0], {
		easing: Easing.out(Easing.cubic),
		extrapolateRight: "clamp",
	});
	const mediaSrc = resolveMedia(media);
	const hasMedia = Boolean(mediaSrc);
	const overlay = hasMedia ? style.overlay : style.overlay;
	const textColor = hasMedia ? style.textOnImage : style.text;

	return (
		<div
			style={{
				position: "absolute",
				inset: 0,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "flex-end",
				background: style.background,
			}}
		>
			{mediaSrc && (
				<>
					<Img
						src={mediaSrc}
						style={{
							position: "absolute",
							inset: 0,
							width: "100%",
							height: "100%",
							objectFit: "cover",
						}}
					/>
					<div
						style={{
							position: "absolute",
							inset: 0,
							background: overlay,
						}}
					/>
				</>
			)}
			<div
				style={{
					position: "relative",
					padding: "40px 48px 80px",
					opacity,
					transform: `translateY(${y}px)`,
				}}
			>
				<div
					style={{
						fontFamily: FONT_FAMILY,
						fontWeight: 700,
						fontSize: 52,
						lineHeight: 1.1,
						color: textColor,
						textAlign: "center",
						textWrap: "balance",
						textShadow: hasMedia ? style.shadow : "none",
						maxWidth: "85vw",
					}}
				>
					{text}
				</div>
			</div>
		</div>
	);
};
