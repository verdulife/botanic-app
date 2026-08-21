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

const BrandFontsBoot: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [ready, setReady] = useState(false);
	useEffect(() => {
		Promise.all([
			loadFont({
				family: "Fraunces Variable",
				url: staticFile("fonts/fraunces-variable.woff2"),
				weight: "300 700",
			}),
			loadFont({
				family: "Inter Variable",
				url: staticFile("fonts/inter-variable.woff2"),
				weight: "100 900",
			}),
			loadFont({
				family: "JetBrains Mono Variable",
				url: staticFile("fonts/jetbrains-mono-variable.woff2"),
				weight: "100 900",
			}),
		])
			.then(() => setReady(true))
			.catch((e) => {
				console.warn("No se pudieron cargar las 3 fuentes del sistema, fallback system-ui:", e);
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
					<BrandFontsBoot>
						<BotanicReel script={script} />
					</BrandFontsBoot>
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
					<BrandFontsBoot>
						<BotanicSlide script={script} />
					</BrandFontsBoot>
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
					<BrandFontsBoot>
						<Catalog slots={slots} />
					</BrandFontsBoot>
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
