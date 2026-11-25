import assert from 'node:assert/strict';
import { test } from 'node:test';
import { classifyExchangeError, expiredLinkCode, isNoAccountError } from './link-outcome.ts';

test('los códigos de enlace inválido se reconocen', () => {
	for (const code of ['otp_expired', 'flow_state_expired', 'flow_state_not_found', 'bad_code_verifier', 'invalid_request']) {
		assert.equal(expiredLinkCode(code), true, code);
	}
	for (const code of ['invalid_grant', 'over_email_send_rate_limit', undefined, null]) {
		assert.equal(expiredLinkCode(code as string), false, String(code));
	}
});

test('un fallo temporal no se disfraza de enlace caducado', () => {
	// Un 5xx o un límite de peticiones dejan el enlace intacto: hay que decirlo.
	assert.equal(classifyExchangeError({ code: 'over_request_rate_limit', status: 429 }), 'fallo');
	assert.equal(classifyExchangeError({ code: undefined, status: 503 }), 'fallo');
	// Un enlace caducado, en cambio, se anuncia como tal.
	assert.equal(classifyExchangeError({ code: 'otp_expired', status: 400 }), 'caducado');
});

test('un correo sin cuenta se responde en neutro', () => {
	assert.equal(isNoAccountError({ message: 'Signups not allowed for otp' }), true);
	assert.equal(isNoAccountError({ message: 'User not found' }), true);
	assert.equal(isNoAccountError({ code: 'user_not_found' }), true);
});

test('otp_disabled es «sin cuenta» solo cuando el mensaje lo dice', () => {
	// Supabase responde 422 / `otp_disabled` / «Signups not allowed for otp» ante un
	// correo sin cuenta. Si eso se mostrara como error, cualquiera averiguaría qué
	// correos están registrados probando uno a uno.
	assert.equal(isNoAccountError({ code: 'otp_disabled', message: 'Signups not allowed for otp' }), true);
});

test('otp_disabled sin ese mensaje es un fallo real del servicio', () => {
	// El mismo código aparece si el enlace mágico está apagado en el proyecto.
	// Callarlo dejaría al usuario esperando un correo que no va a salir nunca.
	assert.equal(isNoAccountError({ code: 'otp_disabled', message: 'OTP is disabled' }), false);
	assert.equal(isNoAccountError({ code: 'otp_disabled' }), false);
});

test('un error desconocido no se toma por «sin cuenta»', () => {
	assert.equal(isNoAccountError({ message: 'boom' }), false);
	assert.equal(isNoAccountError({}), false);
});
