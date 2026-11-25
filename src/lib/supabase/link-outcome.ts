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
 * `otp_disabled` queda fuera a propósito: no significa «sin cuenta», sino que el
 * enlace mágico está apagado en el proyecto. Callarlo dejaría al usuario
 * esperando un correo que no va a llegar nunca.
 *
 * Los códigos llegan con guiones bajos (`user_not_found`) y los mensajes con
 * espacios, así que el patrón acepta las dos formas.
 */
const NO_ACCOUNT = /signups?[ _]not[ _]allowed|user[ _]not[ _]found|not[ _]registered/i;

export function isNoAccountError(error: {
	code?: string | null;
	message?: string | null;
}): boolean {
	if (error.code === 'otp_disabled') return false;
	return NO_ACCOUNT.test(error.message ?? '') || NO_ACCOUNT.test(error.code ?? '');
}
