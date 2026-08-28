import type { Handle } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/supabase/server';
import { isMockAuth } from '$lib/auth-mode';
import { getSessionData, getSessionUser } from '$lib/mock/auth-server';

const APP_PREFIX = '/app';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient(event);

	event.locals.safeGetSession = async () => {
		if (isMockAuth()) {
			const mockUser = getSessionUser(event.cookies);
			if (!mockUser) return { session: null, user: null };
			return getSessionData(mockUser);
		}

		const { data: { session } } = await event.locals.supabase.auth.getSession();
		if (!session) return { session: null, user: null };

		const { data: { user }, error } = await event.locals.supabase.auth.getUser();
		if (error) return { session: null, user: null };

		return { session, user };
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