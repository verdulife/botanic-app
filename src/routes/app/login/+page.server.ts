import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { field, safeNextPath, validateEmail, validatePassword } from '$lib/supabase/auth-utils';
import { mapAuthError } from '$lib/supabase/auth-errors';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { user } = await safeGetSession();
	if (user) throw redirect(303, safeNextPath(null, '/app'));
};

export const actions: Actions = {
	password: async (event) => {
		const { request, locals: { supabase }, url } = event;
		const formData = await request.formData();

		const email = field(formData, 'email');
		const password = field(formData, 'password');

		const emailErr = validateEmail(email);
		if (emailErr) return fail(400, { mode: 'password' as const, email, error: emailErr });

		const passwordErr = validatePassword(password);
		if (passwordErr)
			return fail(400, { mode: 'password' as const, email, error: passwordErr });

		const { error } = await supabase.auth.signInWithPassword({ email, password });

		if (error) {
			return fail(400, { mode: 'password' as const, email, error: mapAuthError(error) });
		}

		throw redirect(303, safeNextPath(url.searchParams.get('next'), '/app'));
	},

	magic: async (event) => {
		const { request, locals: { supabase }, url } = event;
		const formData = await request.formData();

		const email = field(formData, 'email');
		const emailErr = validateEmail(email);
		if (emailErr) return fail(400, { mode: 'magic' as const, email, error: emailErr });

		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: `${url.origin}/auth/callback`
			}
		});

		if (error) {
			return fail(400, { mode: 'magic' as const, email, error: mapAuthError(error) });
		}

		return { mode: 'magic' as const, email, sent: true };
	}
};