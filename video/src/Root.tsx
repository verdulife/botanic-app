import React, { useEffect, useState } from "react";
import { Composition, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";
import { BotanicReel } from "./BotanicReel";
import { BotanicSlide } from "./BotanicSlide";
import { Catalog } from "./catalog/Catalog";
import { catalogSlots } from "./catalog/slots";
import type { Script } from "./types";
import defaultScriptJson from "../../src/lib/social/_drafts/coleccionistas-de-esquejes/script.json";

const defaultScript = defaultScriptJson as Script;

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
			<Composition
				id="Catalog"
				component={({ slots }) => (
					<OnestBoot>
						<Catalog slots={slots} />
					</OnestBoot>
				)}
				durationInFrames={catalogSlots.reduce((acc, s) => acc + s.frames, 0)}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{ slots: catalogSlots }}
			/>
		</>
	);
};
