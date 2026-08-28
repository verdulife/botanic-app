import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { isMockAuth } from '$lib/auth-mode';
import { clearSessionCookie } from '$lib/mock/auth-server';

export const actions: Actions = {
	default: async ({ locals, cookies }) => {
		if (isMockAuth()) {
			clearSessionCookie(cookies);
			throw redirect(303, '/app');
		}
		await locals.supabase.auth.signOut();
		throw redirect(303, '/app');
	}
};