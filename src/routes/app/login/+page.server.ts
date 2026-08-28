import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { field, safeNextPath, validateEmail, validatePassword } from '$lib/supabase/auth-utils';
import { mapAuthError } from '$lib/supabase/auth-errors';
import { isMockAuth } from '$lib/auth-mode';
import { DEMO_ACCOUNT, getUserByEmail, setSessionCookie, signIn } from '$lib/mock/auth-server';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { user } = await safeGetSession();
	if (user) throw redirect(303, safeNextPath(null, '/app'));
};

export const actions: Actions = isMockAuth()
	? { password, magic, demo }
	: { password, magic };

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

	if (isMockAuth()) {
		const result = signIn(email, password);
		if ('error' in result) {
			return fail(400, { mode: 'password' as const, email, error: result.error });
		}
		setSessionCookie(event.cookies, result.user.id);
		throw redirect(303, safeNextPath(url.searchParams.get('next'), '/app'));
	}

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

	if (isMockAuth()) {
		// Auto-login simulado: como no hay email real, si la cuenta existe se
		// inicia sesión directamente (simula haber hecho clic en el enlace).
		const user = getUserByEmail(email);
		if (user) {
			setSessionCookie(event.cookies, user.id);
			throw redirect(303, safeNextPath(url.searchParams.get('next'), '/app'));
		}
		// Cuenta inexistente: simula el envío de un enlace que no llega.
		return { mode: 'magic' as const, email, sent: true };
	}

	const { error } = await locals.supabase.auth.signInWithOtp({
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

async function demo(event: Parameters<Actions['password']>[0]) {
	const { url } = event;
	const user = getUserByEmail(DEMO_ACCOUNT.email);
	if (!user) {
		return fail(500, {
			mode: 'password' as const,
			email: DEMO_ACCOUNT.email,
			error: 'No se pudo cargar la cuenta demo.'
		});
	}
	setSessionCookie(event.cookies, user.id);
	throw redirect(303, safeNextPath(url.searchParams.get('next'), '/app'));
}