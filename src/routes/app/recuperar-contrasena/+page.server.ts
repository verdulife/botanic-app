import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { field, safeNextPath, validateEmail } from '$lib/supabase/auth-utils';
import { mapAuthError } from '$lib/supabase/auth-errors';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { user } = await safeGetSession();
	if (user) throw redirect(303, safeNextPath(null, '/app'));
};

export const actions: Actions = {
	default: async (event) => {
		const { request, locals: { supabase }, url } = event;
		const formData = await request.formData();

		const email = field(formData, 'email');
		const emailErr = validateEmail(email);
		if (emailErr) return fail(400, { email, error: emailErr });

		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${url.origin}/auth/callback?next=/app/ajustes/cuenta`
		});

		if (error) {
			return fail(400, { email, error: mapAuthError(error) });
		}

		return { email, sent: true };
	}
};