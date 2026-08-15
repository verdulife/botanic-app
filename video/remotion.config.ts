import path from "path";
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// El publicDir de Remotion apunta al static/ del repo raíz: los assets de los
// guiones (static/social/<slug>/...) se resuelven con staticFile() relativo.
Config.setPublicDir("../static");
// Resuelve el alias `@/*` → `./src/*` (mismo que el tsconfig) en el bundler.
Config.overrideWebpackConfig((config) => {
	config.resolve = {
		...config.resolve,
		alias: {
			...(config.resolve?.alias ?? {}),
			"@": path.join(process.cwd(), "src"),
		},
	};
	return config;
});
