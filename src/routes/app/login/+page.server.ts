import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { field, safeNextPath, validateEmail, validatePassword } from '$lib/supabase/auth-utils';
import { mapAuthError } from '$lib/supabase/auth-errors';
import { isNoAccountError } from '$lib/supabase/link-outcome';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { user } = await safeGetSession();
	if (user) throw redirect(303, safeNextPath(null, '/app'));
};

export const actions: Actions = { password, magic };

async function password(event: Parameters<Actions['password']>[0]) {
	const { request, locals, url } = event;
	const formData = await request.formData();

	const email = field(formData, 'email');
	const password = field(formData, 'password');

	const emailErr = validateEmail(email);
	if (emailErr) return fail(400, { mode: 'password' as const, email, error: emailErr });

	const passwordErr = validatePassword(password);
	if (passwordErr)
		return fail(400, { mode: 'password' as const, email, error: passwordErr });

	const { error } = await locals.supabase.auth.signInWithPassword({ email, password });

	if (error) {
		return fail(400, { mode: 'password' as const, email, error: mapAuthError(error) });
	}

	throw redirect(303, safeNextPath(url.searchParams.get('next'), '/app'));
}

async function magic(event: Parameters<Actions['magic']>[0]) {
	const { request, locals, url } = event;
	const formData = await request.formData();

	const email = field(formData, 'email');
	const emailErr = validateEmail(email);
	if (emailErr) return fail(400, { mode: 'magic' as const, email, error: emailErr });

	const { error } = await locals.supabase.auth.signInWithOtp({
		email,
		options: {
			// Sin alta automática: el enlace mágico sirve para entrar, no para
			// registrarse. Quien no tiene cuenta se registra en /app/registro.
			shouldCreateUser: false,
			emailRedirectTo: `${url.origin}/auth/callback`
		}
	});

	// Si el correo no tiene cuenta, Supabase devuelve error. Se responde igual que
	// en el caso bueno para no revelar qué correos están registrados; el enlace a
	// registro está siempre visible en la pantalla, así que nadie se queda atascado.
	if (error && !isNoAccountError(error)) {
		return fail(400, { mode: 'magic' as const, email, error: mapAuthError(error) });
	}

	if (error) {
		// Queda en el log para poder distinguir un correo sin cuenta de un enlace
		// mágico apagado en el proyecto, que devuelve el mismo código.
		console.warn('[login] enlace mágico neutralizado:', error.code ?? error.status);
	}

	return { mode: 'magic' as const, email, sent: true };
}