import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
	const { user } = await safeGetSession();
	if (!user) throw redirect(303, '/app/login?next=/app/mi-botanic');

	const { data: profile } = await supabase
		.from('profiles')
		.select('id, username, full_name, avatar_url')
		.eq('id', user.id)
		.maybeSingle();

	return { profile };
};