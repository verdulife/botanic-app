import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { safeNextPath } from '$lib/supabase/auth-utils';
import { classifyExchangeError } from '$lib/supabase/link-outcome';

/**
 * Un enlace de correo que no se puede canjear no es un inicio de sesión. Antes
 * se redirigía a `/app` en silencio y el usuario aterrizaba en el marketplace
 * como si tuviera sesión; ahora vuelve al login con el motivo.
 */
function loginWith(reason: 'caducado' | 'fallo', next: string | null): string {
	const params = new URLSearchParams({ enlace: reason });
	if (next) params.set('next', next);
	return `/app/login?${params.toString()}`;
}

/**
 * A dónde va quien acaba de canjear un enlace y no traía destino: al marketplace
 * si ya tiene nombre de usuario, y al formulario de bienvenida si le falta.
 */
async function landingFor(
	supabase: App.Locals['supabase'],
	userId: string | undefined
): Promise<string> {
	if (!userId) return '/app';

	const { data: profile } = await supabase
		.from('profiles')
		.select('username')
		.eq('id', userId)
		.maybeSingle();

	return profile?.username ? '/app' : '/app/bienvenida';
}

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const code = url.searchParams.get('code');
	const nextParam = url.searchParams.get('next');

	if (!code) throw redirect(303, loginWith('caducado', nextParam));

	const { data, error } = await supabase.auth.exchangeCodeForSession(code);
	if (error) {
		// Se registra el código, no el mensaje: el detalle del proveedor no aporta
		// y puede arrastrar datos de la petición a los logs.
		console.error('[auth/callback] canje fallido:', error.code ?? error.status);
		// Cualquier cosa que no sea un enlace inválido se trata como problema
		// temporal: el enlace puede seguir sirviendo.
		throw redirect(303, loginWith(classifyExchangeError(error), nextParam));
	}

	// Un enlace canjeado no tiene nada que verificar: el correo ya está confirmado.
	// Sin destino explícito, cada uno va donde le corresponde según su perfil.
	throw redirect(303, safeNextPath(nextParam, await landingFor(supabase, data.user?.id)));
};
