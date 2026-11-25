/**
 * Qué decirle a quien llega con un enlace de correo que no se puede canjear.
 *
 * Vive aparte del callback para poder probarlo: la decisión de si un fallo es
 * «enlace caducado» o «problema temporal» cambia lo que se le pide al usuario.
 * Decirle que el enlace ya no sirve durante una caída de red le hace tirar un
 * enlace que todavía valía.
 */

/** Códigos que significan que el enlace ya no sirve: caducó, se usó o está roto. */
const EXPIRED_LINK_CODES = new Set([
	'otp_expired',
	'flow_state_expired',
	'flow_state_not_found',
	'bad_code_verifier',
	'invalid_request'
]);

export type LinkProblem = 'caducado' | 'fallo';

export function expiredLinkCode(code: string | null | undefined): boolean {
	return !!code && EXPIRED_LINK_CODES.has(code);
}

/** Clasifica un fallo de canje: enlace inservible o problema temporal. */
export function classifyExchangeError(error: {
	code?: string | null;
	status?: number | null;
}): LinkProblem {
	return expiredLinkCode(error.code) ? 'caducado' : 'fallo';
}

/**
 * Un correo sin cuenta no se distingue de uno con cuenta: el enlace mágico es una
 * forma de entrar, no de registrarse.
 *
 * `otp_disabled` es ambiguo: Supabase lo devuelve con el mensaje «Signups not
 * allowed for otp» cuando el correo no tiene cuenta (comprobado con peticiones
 * reales), pero el mismo código aparece si el enlace mágico está apagado en el
 * proyecto. Solo el mensaje distingue los dos casos, así que solo se trata como
 * «sin cuenta» cuando lo dice: en el otro caso el usuario tiene que ver el error
 * en vez de esperar un correo que no va a llegar.
 *
 * Los códigos llegan con guiones bajos (`user_not_found`) y los mensajes con
 * espacios, así que los patrones aceptan las dos formas.
 */
const NO_ACCOUNT = /signups?[ _]not[ _]allowed|user[ _]not[ _]found|not[ _]registered/i;
const SIGNUPS_NOT_ALLOWED = /signups?[ _]not[ _]allowed/i;

export function isNoAccountError(error: {
	code?: string | null;
	message?: string | null;
}): boolean {
	if (error.code === 'otp_disabled') return SIGNUPS_NOT_ALLOWED.test(error.message ?? '');
	return NO_ACCOUNT.test(error.message ?? '') || NO_ACCOUNT.test(error.code ?? '');
}
