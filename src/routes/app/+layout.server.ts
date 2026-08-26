import type { LayoutServerLoad } from './$types';
import type { Database } from '$lib/supabase/types';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
	const { session, user } = await safeGetSession();

	let profile: Database['public']['Tables']['profiles']['Row'] | null = null;
	if (user) {
		const { data } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', user.id)
			.maybeSingle();
		profile = data;
	}

	return { session, user, profile };
};