import React, { useEffect, useState } from "react";
import { Composition, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";
import { BotanicReel } from "./BotanicReel";
import { BotanicSlide } from "./BotanicSlide";
import type { Script } from "./types";

const defaultScript: Script = {
	title: "3 errores al regar tu monstera",
	style: "energy",
	template: "tip-stack",
	platform: ["ig", "tiktok"],
	scenes: [
		{ type: "hook", text: "¿Riegas tu monstera así?", duration: 2 },
		{ type: "tip", text: "Error 1: agua del grifo", duration: 4 },
		{ type: "tip", text: "Error 2: riego sin drenaje", duration: 4 },
		{ type: "tip", text: "Error 3: exceso de agua", duration: 4 },
		{ type: "outro", text: "Sigue para más cuidados", cta: "Sigue para más cuidados 🌱", logo: true, duration: 3 },
	],
};

const defaultCarousel: Script = {
	title: "5 plantas imposibles de matar",
	style: "cozy",
	template: "carousel-tips",
	platform: ["ig"],
	scenes: [
		{ type: "cover", text: "5 plantas imposibles de matar", duration: 0 },
		{ type: "slide", text: "Sansevieria: riego mensual", duration: 0 },
		{ type: "slide", text: "Pothos: tolera poca luz", duration: 0 },
		{ type: "slide", text: "Aspidistra: casi indestructible", duration: 0 },
		{ type: "outro", text: "Guarda este carrusel", cta: "Guarda este carrusel 🌿", logo: true, duration: 0 },
	],
};

const OnestBoot: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [ready, setReady] = useState(false);
	useEffect(() => {
		loadFont({
			family: "Onest Variable",
			url: staticFile("fonts/onest-variable.woff2"),
			weight: "100 900",
		})
			.then(() => setReady(true))
			.catch((e) => {
				console.warn("No se pudo cargar Onest Variable, fallback system-ui:", e);
				setReady(true);
			});
	}, []);
	if (!ready) return null;
	return <>{children}</>;
};

export const RemotionRoot: React.FC = () => {
	const reelFrames = defaultScript.scenes.reduce(
		(acc, s) => acc + (s.duration ?? 4) * 30,
		0,
	);
	return (
		<>
			<Composition
				id="BotanicReel"
				component={({ script }) => (
					<OnestBoot>
						<BotanicReel script={script} />
					</OnestBoot>
				)}
				durationInFrames={reelFrames}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{ script: defaultScript }}
			/>
			<Composition
				id="BotanicSlide"
				component={({ script }) => (
					<OnestBoot>
						<BotanicSlide script={script} />
					</OnestBoot>
				)}
				durationInFrames={defaultCarousel.scenes.length}
				fps={30}
				width={1080}
				height={1350}
				defaultProps={{ script: defaultCarousel }}
			/>
		</>
	);
};
