import type { Handle } from '@sveltejs/kit/hooks';
import { createSupabaseServerClient } from '$lib/supabase/server';

const APP_PREFIX = '/app';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient(event);

	event.locals.safeGetSession = async () => {
		// `getUser()` valida el token contra Auth y es la única fuente de identidad:
		// su `user` viene comprobado, no el que viaja dentro de la sesión.
		// No se llama a `getSession()`: en el servidor dispara el refresco automático
		// y con él escrituras de cookie cuando la respuesta ya está generada.
		const { data: { user }, error } = await event.locals.supabase.auth.getUser();
		if (error) return { user: null };

		return { user };
	};

	if (event.url.pathname.startsWith(APP_PREFIX)) {
		event.setHeaders({ 'X-Robots-Tag': 'noindex, nofollow' });
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};