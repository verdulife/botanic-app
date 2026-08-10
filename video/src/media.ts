import { staticFile } from "remotion";

export function resolveMedia(media?: string): string | undefined {
	if (!media) return undefined;
	if (/^https?:\/\//.test(media)) return media;
	// Espera rutas tipo "static/social/<slug>/<file>": se sirven desde el publicDir
	// configurado en remotion.config.ts (apunta a ../static del repo).
	const rel = media.replace(/^static\//, "");
	return staticFile(rel);
}
