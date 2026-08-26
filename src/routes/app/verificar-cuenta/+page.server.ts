import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();

	if (!session) {
		return { status: 'pending' as const };
	}

	const confirmed = session.user.email_confirmed_at != null;
	if (confirmed) {
		throw redirect(303, '/app/bienvenida');
	}

	return { status: 'unconfirmed' as const, email: session.user.email };
};