import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mockEmailFor, USERS } from './seed-data.ts';

test('mockEmailFor produce direcciones válidas con acentos', () => {
	assert.equal(mockEmailFor('mock_ana'), 'ana-mock@botanic.test');
	assert.equal(mockEmailFor('mock_inés'), 'ines-mock@botanic.test');
	assert.equal(mockEmailFor('mock_muñoz'), 'munoz-mock@botanic.test');
});

test('todos los usuarios del seed tienen correo con forma válida', () => {
	// Supabase Auth rechaza el usuario entero si el correo no es válido, y con él
	// se pierden sus anuncios: el seed se queda corto sin avisar.
	const emails = USERS.map((user) => mockEmailFor(user.username));
	const invalid = emails.filter((email) => !/^[a-z0-9-]+@[a-z0-9.-]+$/.test(email));
	assert.deepEqual(invalid, []);
});

test('ningún usuario del seed comparte correo con otro', () => {
	// Normalizar acentos puede juntar dos nombres distintos en la misma dirección
	// (`inés` y `ines`). Auth rechazaría al segundo y el seed perdería sus anuncios
	// sin más rastro que una línea de log, así que los correos tienen que ser únicos.
	const emails = USERS.map((user) => mockEmailFor(user.username));
	assert.equal(new Set(emails).size, emails.length);
});
