import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { isMockAuth } from '$lib/auth-mode';
import { getMockProfile } from '$lib/mock/auth-server';

export const load: PageServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
	const { user } = await safeGetSession();
	if (!user) throw redirect(303, '/app/login?next=/app/mi-botanic');

	let profile: { id: string; username: string; full_name: string | null; avatar_url: string | null } | null;
	if (isMockAuth()) {
		const full = getMockProfile(user.id);
		profile = full ? { id: full.id, username: full.username, full_name: full.full_name, avatar_url: full.avatar_url } : null;
	} else {
		const { data } = await supabase
			.from('profiles')
			.select('id, username, full_name, avatar_url')
			.eq('id', user.id)
			.maybeSingle();
		profile = data;
	}

	return { profile };
};