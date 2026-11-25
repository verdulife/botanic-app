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

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const code = url.searchParams.get('code');
	const nextParam = url.searchParams.get('next');

	if (!code) throw redirect(303, loginWith('caducado', nextParam));

	const { error } = await supabase.auth.exchangeCodeForSession(code);
	if (error) {
		// Se registra el código, no el mensaje: el detalle del proveedor no aporta
		// y puede arrastrar datos de la petición a los logs.
		console.error('[auth/callback] canje fallido:', error.code ?? error.status);
		// Cualquier cosa que no sea un enlace inválido se trata como problema
		// temporal: el enlace puede seguir sirviendo.
		throw redirect(303, loginWith(classifyExchangeError(error), nextParam));
	}

	throw redirect(303, safeNextPath(nextParam, '/app/verificar-cuenta'));
};
