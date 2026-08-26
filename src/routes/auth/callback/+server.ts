import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { safeNextPath } from '$lib/supabase/auth-utils';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const code = url.searchParams.get('code');
	const nextParam = url.searchParams.get('next');
	const fallback = url.pathname.startsWith('/auth/') ? '/app' : '/';

	if (code) {
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (!error) {
			throw redirect(303, safeNextPath(nextParam, '/app/verificar-cuenta'));
		}
	}

	throw redirect(303, safeNextPath(nextParam, fallback));
};