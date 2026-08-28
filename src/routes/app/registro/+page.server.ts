import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	field,
	MIN_PASSWORD,
	safeNextPath,
	validateEmail,
	validatePassword
} from '$lib/supabase/auth-utils';
import { mapAuthError } from '$lib/supabase/auth-errors';
import { isMockAuth } from '$lib/auth-mode';
import { setSessionCookie, signUp } from '$lib/mock/auth-server';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { user } = await safeGetSession();
	if (user) throw redirect(303, safeNextPath(null, '/app'));
};

export const actions: Actions = {
	default: async (event) => {
		const { request, locals, url } = event;
		const formData = await request.formData();

		const email = field(formData, 'email');
		const password = field(formData, 'password');

		const emailErr = validateEmail(email);
		if (emailErr) return fail(400, { email, error: emailErr });

		const passwordErr = validatePassword(password);
		if (passwordErr) return fail(400, { email, error: passwordErr });

		if (isMockAuth()) {
			const result = signUp(email, password);
			if ('error' in result) {
				return fail(400, { email, error: result.error });
			}
			// Auto-confirmado (no hay email en el mock): sesión directa + onboarding.
			setSessionCookie(event.cookies, result.user.id);
			throw redirect(303, '/app/bienvenida');
		}

		const { data, error } = await locals.supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${url.origin}/auth/callback?next=/app/bienvenida`
			}
		});

		if (error) {
			return fail(400, { email, error: mapAuthError(error) });
		}

		// Si Supabase ya tenía una sesión activa (identidad duplicada)
		if (data.session) {
			throw redirect(303, '/app/bienvenida');
		}

		// Email de confirmación enviado
		return { email, sent: true };
	}
};