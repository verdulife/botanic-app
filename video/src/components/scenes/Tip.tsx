import React from "react";
import { useCurrentFrame, interpolate, Easing, Img, Video } from "remotion";
import { COLORS, FONT_FAMILY, type StyleTokens } from "../../brand";
import { resolveMedia } from "../../media";

const isVideo = (media?: string) => Boolean(media && /\.(mp4|webm|mov)$/i.test(media));

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

export const Tip: React.FC<{
	text: string;
	style: StyleTokens;
	media?: string;
	index: number;
}> = ({ text, style, media, index }) => {
	const frame = useCurrentFrame();
	const enter = frame - index * 4;
	const opacity = interpolate(enter, [0, 6], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const y = interpolate(enter, [0, 12], [40, 0], {
		easing: Easing.out(Easing.cubic),
		extrapolateRight: "clamp",
	});
	const mediaSrc = resolveMedia(media);
	const hasMedia = Boolean(mediaSrc);
	const useVideo = isVideo(media);
	const textColor = hasMedia ? style.textOnImage : style.text;

	return (
		<div
			style={{
				position: "absolute",
				inset: 0,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			{mediaSrc &&
				(useVideo ? (
					<Video
						src={mediaSrc}
						muted
						loop
						style={{
							position: "absolute",
							inset: 0,
							width: "100%",
							height: "100%",
							objectFit: "cover",
						}}
					/>
				) : (
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
				))}
			<div
				style={{
					position: "relative",
					padding: "0 48px",
					opacity,
					transform: `translateY(${y}px)`,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<div
					style={{
						background: `color-mix(in oklch, ${COLORS["still-950"]} 70%, transparent)`,
						backdropFilter: "blur(24px)",
						WebkitBackdropFilter: "blur(24px)",
						borderRadius: 32,
						padding: "40px 56px",
						maxWidth: "85vw",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<div
						style={{
							fontFamily: FONT_FAMILY,
							fontWeight: 300,
							fontSize: 120,
							lineHeight: 1.08,
							color: textColor,
							textAlign: "center",
							textWrap: "balance",
							maxWidth: "82vw",
						}}
					>
						<Strong text={text} />
					</div>
				</div>
			</div>
		</div>
	);
};
