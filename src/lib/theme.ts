/**
 * Tema claro/oscuro de la web app.
 *
 * El tema es exclusivo de `/app` y de sus hijos: la web pública, el blog y las
 * páginas legales son siempre claras. Nunca se aplica el tema a una ruta que no
 * cuelgue de `/app`.
 *
 * Dentro de la app manda el sistema (`prefers-color-scheme`); `light` y `dark`
 * existen para el ajuste de preferencias previsto, pero hoy nadie los pasa.
 *
 * El tema se aplica como clase `dark` en `<html>`, que activa el bloque `.dark`
 * de tokens de `app.css` a través de `@custom-variant dark`. La clase vive en
 * `<html>` porque necesita alcanzar scrollbars y controles nativos; el layout
 * de `/app` la pone al montar y la retira al desmontar.
 */

export type ThemePreference = 'auto' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

/** Lo único que se toca de la raíz del documento. Permite probar sin DOM. */
export interface ThemeRoot {
	classList: { toggle(token: string, force: boolean): void };
	style: { colorScheme: string };
}

export function resolveTheme(preference: ThemePreference, prefersDark: boolean): ResolvedTheme {
	if (preference === 'auto') return prefersDark ? 'dark' : 'light';
	return preference;
}

/** La app es `/app` y todo lo que cuelga de ella; el resto del sitio no. */
export function isAppPath(pathname: string): boolean {
	return pathname === '/app' || pathname.startsWith('/app/');
}

/** Fuera de la app no hay tema: siempre claro, diga lo que diga el sistema. */
export function resolveThemeForPath(
	pathname: string,
	preference: ThemePreference,
	prefersDark: boolean
): ResolvedTheme {
	return isAppPath(pathname) ? resolveTheme(preference, prefersDark) : 'light';
}

export function applyTheme(theme: ResolvedTheme, root: ThemeRoot = document.documentElement): void {
	root.classList.toggle('dark', theme === 'dark');
	// Sin esto, scrollbars y controles nativos siguen pintándose claros.
	root.style.colorScheme = theme;
}

/**
 * Aplica el tema de la ruta y lo mantiene sincronizado con el sistema mientras
 * la página vive: cambiar la preferencia del escritorio se refleja sin recargar.
 * Devuelve la función para dejar de escuchar.
 */
export function watchSystemTheme(pathname: string, preference: ThemePreference = 'auto'): () => void {
	const query = window.matchMedia('(prefers-color-scheme: dark)');
	const sync = () => applyTheme(resolveThemeForPath(pathname, preference, query.matches));

	sync();
	query.addEventListener('change', sync);

	return () => query.removeEventListener('change', sync);
}
