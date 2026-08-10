import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, interpolate, Easing } from "remotion";
import type { Script, Scene, MotionStyle } from "./types";
import { getStyle } from "./brand";
import { COLORS } from "./brand.generated";
import { FONT_FAMILY } from "./brand";
import { Logo } from "./components/Logo";
import { MeshBackground } from "./mesh";
import { resolveMedia } from "./media";

const SlideContent: React.FC<{ scene: Scene; index: number; total: number; style: MotionStyle }> = ({
	scene,
	index,
	total,
	style: styleName,
}) => {
	const style = getStyle(styleName);
	const frame = useCurrentFrame();
	const opacity = interpolate(frame, [0, 10], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const y = interpolate(frame, [0, 20], [30, 0], {
		easing: Easing.out(Easing.cubic),
		extrapolateRight: "clamp",
	});
	const mediaSrc = resolveMedia(scene.media);
	const hasMedia = Boolean(mediaSrc);
	const overlay = hasMedia ? style.overlay : style.overlay;
	const textColor = hasMedia ? style.textOnImage : style.text;

	if (scene.type === "outro") {
		const variant = styleName === "minimal" ? "minimal" : styleName === "energy" ? "energy" : "cozy";
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
				<MeshBackground variant={variant} />
				<Logo size={120} />
				<div
					style={{
						fontFamily: FONT_FAMILY,
						fontWeight: 700,
						fontSize: 52,
						lineHeight: 1.1,
						letterSpacing: "normal",
						color: style.text,
						textAlign: "center",
						textWrap: "balance",
						maxWidth: "85%",
					}}
				>
					{scene.cta ?? scene.text}
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
	}

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
				padding: 56,
				opacity,
				transform: `translateY(${y}px)`,
				overflow: "hidden",
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
			{scene.type === "cover" && (
				<>
					<MeshBackground variant={styleName === "minimal" ? "minimal" : styleName === "energy" ? "energy" : "cozy"} />
					<Logo size={120} />
					<div style={{ height: 32 }} />
				</>
			)}
			{scene.type === "cover" && (
				<div
					style={{
						fontFamily: FONT_FAMILY,
						fontWeight: 300,
						fontSize: 80,
						lineHeight: 1.05,
						letterSpacing: "normal",
						color: textColor,
						textAlign: "center",
						textWrap: "balance",
						maxWidth: "90%",
					}}
				>
					{scene.text}
				</div>
			)}
			{scene.type === "quote" && (
				<div
					style={{
						fontFamily: FONT_FAMILY,
						fontWeight: 300,
						fontSize: 56,
						lineHeight: 1.2,
						letterSpacing: "normal",
						color: textColor,
						textAlign: "center",
						textWrap: "balance",
						maxWidth: "85%",
						textShadow: hasMedia ? style.shadow : "none",
					}}
				>
					{scene.text}
				</div>
			)}
			{(scene.type === "slide" || scene.type === "tip") && (
				<div
					style={{
						fontFamily: FONT_FAMILY,
						fontWeight: 700,
						fontSize: 58,
						lineHeight: 1.1,
						letterSpacing: "normal",
						color: textColor,
						textAlign: "center",
						textWrap: "balance",
						maxWidth: "85%",
						textShadow: hasMedia ? style.shadow : "none",
					}}
				>
					{scene.text}
				</div>
			)}

			{/* dots de progreso del carrusel */}
			{total > 1 && (
				<div
					style={{
						position: "absolute",
						bottom: 40,
						display: "flex",
						gap: 10,
					}}
				>
					{Array.from({ length: total }).map((_, i) => (
						<div
							key={i}
							style={{
								width: 10,
								height: 10,
								borderRadius: 5,
								background: i === index ? style.accent : `color-mix(in oklch, ${COLORS.foreground} 15%, transparent)`,
							}}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export const BotanicSlide: React.FC<{ script?: Script }> = ({ script }) => {
	const scenes: Scene[] = script?.scenes ?? [];
	const frame = useCurrentFrame();
	const current = Math.min(frame, Math.max(0, scenes.length - 1));
	const scene = scenes[current];
	if (!scene) return <AbsoluteFill style={{ background: COLORS["linen-100"] }} />;
	return (
		<AbsoluteFill style={{ background: COLORS["linen-100"] }}>
			<SlideContent
				scene={scene}
				index={current}
				total={scenes.length}
				style={script?.style ?? "cozy"}
			/>
		</AbsoluteFill>
	);
};
