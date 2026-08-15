import React from "react";
import {
	AbsoluteFill,
	Audio,
	Sequence,
	staticFile,
	useVideoConfig,
	useCurrentFrame,
	interpolate,
} from "remotion";
import type { Script, Scene, MotionStyle } from "./types";
import { getStyle } from "./brand";
import { COLORS } from "./brand.generated";
import { Hook } from "./components/scenes/Hook";
import { Tip } from "./components/scenes/Tip";
import { Outro } from "./components/scenes/Outro";
import { Cta } from "./components/scenes/Cta";

const FPS = 30;

const ProgressDots: React.FC<{
	index: number;
	total: number;
	color: string;
}> = ({ index, total, color }) => {
	const active = total > 1 ? index / Math.max(1, total - 1) : 1;
	const frame = useCurrentFrame();
	const width = 160;
	const fillWidth = interpolate(frame, [0, 60], [0, width * active], {
		extrapolateRight: "clamp",
	});
	return (
		<div
			style={{
				position: "absolute",
				bottom: 40,
				left: "50%",
				marginLeft: -width / 2,
				width,
				height: 6,
				borderRadius: 3,
				background: `color-mix(in oklch, ${color} 25%, transparent)`,
			}}
		>
			<div
				style={{
					width: fillWidth,
					height: 6,
					borderRadius: 3,
					background: color,
				}}
			/>
		</div>
	);
};

const SceneRenderer: React.FC<{ scene: Scene; sceneIndex: number; total: number; style: MotionStyle }> = ({
	scene,
	sceneIndex,
	total,
	style: styleName,
}) => {
	const style = getStyle(styleName);
	switch (scene.type) {
		case "hook":
			return <Hook text={scene.text} />;
		case "tip":
			return <Tip text={scene.text} style={style} media={scene.media} index={sceneIndex} />;
		case "outro":
			return <Outro text={scene.cta ?? scene.text} />;
		case "cta":
			return <Cta button={scene.button} />;
		default:
			return <Tip text={scene.text} style={style} media={scene.media} index={sceneIndex} />;
	}
};

export const BotanicReel: React.FC<{ script?: Script }> = ({ script }) => {
	const { fps } = useVideoConfig();
	const style = getStyle(script?.style ?? "energy");
	const scenes: Scene[] = script?.scenes ?? [];
	const baseBackground = COLORS["still-400"];

	const defaults: Record<string, number> = {
		hook: 2,
		tip: 4,
		cover: 0,
		slide: 0,
		quote: 0,
		outro: 3,
	};

	const durations = scenes.map((s) => {
		const d = s.duration ?? defaults[s.type] ?? 4;
		return Math.round(d * fps);
	});

	let cursor = 0;

	return (
        <AbsoluteFill style={{
            background: baseBackground,
            translate: "0px -1px"
        }}>
            {scenes.map((scene, i) => {
				const start = cursor;
				const dur = durations[i];
				cursor += dur;
				if (scene.type === "cover" || scene.type === "quote" || scene.type === "slide") {
					return null;
				}
				return (
                    <Sequence key={i} from={start} durationInFrames={dur}>
                        <SceneRenderer
							scene={scene}
							sceneIndex={i}
							total={scenes.length}
							style={script?.style ?? "energy"}
						/>
                    </Sequence>
                );
			})}
            <Audio src={staticFile("social/coleccionistas-de-esquejes/music.mp3")} volume={0.6} />
            <ProgressDots index={scenes.length - 1} total={scenes.length} color={COLORS["linen-100"]} />
        </AbsoluteFill>
    );
};
