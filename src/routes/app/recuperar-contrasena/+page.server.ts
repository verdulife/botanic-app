import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { field, safeNextPath, validateEmail } from '$lib/supabase/auth-utils';
import { mapAuthError } from '$lib/supabase/auth-errors';
import { isMockAuth } from '$lib/auth-mode';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { user } = await safeGetSession();
	if (user) throw redirect(303, safeNextPath(null, '/app'));
};

export const actions: Actions = {
	default: async (event) => {
		const { request, locals, url } = event;
		const formData = await request.formData();

		const email = field(formData, 'email');
		const emailErr = validateEmail(email);
		if (emailErr) return fail(400, { email, error: emailErr });

		if (isMockAuth()) {
			// Recuperación de contraseña no implementada en el modo demo:
			// simula el envío del email sin hacer nada.
			return { email, sent: true };
		}

		const { error } = await locals.supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${url.origin}/auth/callback?next=/app/ajustes/cuenta`
		});

		if (error) {
			return fail(400, { email, error: mapAuthError(error) });
		}

		return { email, sent: true };
	}
};