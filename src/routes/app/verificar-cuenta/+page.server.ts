import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { user } = await safeGetSession();

	if (!user) {
		return { status: 'pending' as const };
	}

	const confirmed = user.email_confirmed_at != null;
	if (confirmed) {
		throw redirect(303, '/app/bienvenida');
	}

	return { status: 'unconfirmed' as const, email: user.email };
};