import type { LayoutServerLoad } from './$types';
import type { Database } from '$lib/supabase/types';
import { isMockAuth } from '$lib/auth-mode';
import { getMockProfile } from '$lib/mock/auth-server';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
	const { session, user } = await safeGetSession();

	let profile: Database['public']['Tables']['profiles']['Row'] | null = null;
	if (user) {
		if (isMockAuth()) {
			profile = getMockProfile(user.id);
		} else {
			const { data } = await supabase
				.from('profiles')
				.select('*')
				.eq('id', user.id)
				.maybeSingle();
			profile = data;
		}
	}

	return { session, user, profile };
};