import assert from 'node:assert/strict';
import { test } from 'node:test';
import { applyTheme, isAppPath, resolveTheme, resolveThemeForPath } from './theme.ts';

/** Raíz mínima: lo único que `applyTheme` toca del documento. */
function fakeRoot() {
	const classes = new Set<string>();
	return {
		classes,
		classList: {
			toggle(token: string, force: boolean) {
				if (force) classes.add(token);
				else classes.delete(token);
			}
		},
		style: { colorScheme: '' }
	};
}

test('resolveTheme en auto sigue la preferencia del sistema', () => {
	assert.equal(resolveTheme('auto', true), 'dark');
	assert.equal(resolveTheme('auto', false), 'light');
});

test('resolveTheme respeta una preferencia explícita por encima del sistema', () => {
	assert.equal(resolveTheme('light', true), 'light');
	assert.equal(resolveTheme('dark', false), 'dark');
});

test('applyTheme deja la clase dark y el color-scheme acordes al tema', () => {
	const root = fakeRoot();

	applyTheme('dark', root);
	assert.equal(root.classes.has('dark'), true);
	assert.equal(root.style.colorScheme, 'dark');

	applyTheme('light', root);
	assert.equal(root.classes.has('dark'), false);
	assert.equal(root.style.colorScheme, 'light');
});

test('isAppPath reconoce la app y sus hijos, y nada más', () => {
	assert.equal(isAppPath('/app'), true);
	assert.equal(isAppPath('/app/'), true);
	assert.equal(isAppPath('/app/login'), true);
	assert.equal(isAppPath('/app/anuncio/monstera-12'), true);

	assert.equal(isAppPath('/'), false);
	assert.equal(isAppPath('/blog/como-nacio-botanic'), false);
	assert.equal(isAppPath('/aviso-legal'), false);
	assert.equal(isAppPath('/application'), false);
});

test('resolveThemeForPath deja la web pública en claro aunque el sistema pida oscuro', () => {
	assert.equal(resolveThemeForPath('/', 'auto', true), 'light');
	assert.equal(resolveThemeForPath('/blog/como-nacio-botanic', 'auto', true), 'light');
	assert.equal(resolveThemeForPath('/', 'dark', true), 'light');
});

test('resolveThemeForPath aplica el tema solo dentro de la app', () => {
	assert.equal(resolveThemeForPath('/app/login', 'auto', true), 'dark');
	assert.equal(resolveThemeForPath('/app', 'auto', false), 'light');
	assert.equal(resolveThemeForPath('/app', 'light', true), 'light');
});
