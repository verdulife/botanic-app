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
	const invalid = USERS.map((user) => mockEmailFor(user.username)).filter(
		(email) => !/^[a-z0-9-]+@[a-z0-9.-]+$/.test(email)
	);
	assert.deepEqual(invalid, []);
});
