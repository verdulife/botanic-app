import assert from 'node:assert/strict';
import { test } from 'node:test';
import { listingPath, parseListingRef, slugIsStale, slugify } from './ref.ts';

test('slugify quita acentos, signos y mayúsculas', () => {
	assert.equal(slugify('Monstera deliciosa ¡enorme!'), 'monstera-deliciosa-enorme');
	assert.equal(slugify('Cactus & suculentas'), 'cactus-suculentas');
	assert.equal(slugify('  Philodendron  Birkin  '), 'philodendron-birkin');
	assert.equal(slugify('Ñandú del Perú'), 'nandu-del-peru');
});

test('slugify nunca devuelve una cadena vacía', () => {
	assert.equal(slugify(''), 'anuncio');
	assert.equal(slugify('¿¡!?'), 'anuncio');
	assert.equal(slugify('1234'), '1234');
});

test('slugify acota la longitud sin dejar un guion suelto al final', () => {
	const slug = slugify('a'.repeat(80) + ' cola');
	assert.ok(slug.length <= 60);
	assert.ok(!slug.endsWith('-'));
});

test('listingPath compone la URL con el número público al final', () => {
	assert.equal(listingPath('Monstera deliciosa', 1234), '/app/anuncio/monstera-deliciosa-1234');
	// Título que termina en número: el identificador sigue siendo el último.
	assert.equal(listingPath('Monstera 2', 7), '/app/anuncio/monstera-2-7');
});

test('parseListingRef acepta slug con número y número solo', () => {
	assert.deepEqual(parseListingRef('monstera-deliciosa-1234'), {
		publicId: 1234,
		slug: 'monstera-deliciosa'
	});
	assert.deepEqual(parseListingRef('1234'), { publicId: 1234, slug: '' });
	assert.deepEqual(parseListingRef('monstera-2-7'), { publicId: 7, slug: 'monstera-2' });
});

test('parseListingRef rechaza lo que no termina en número', () => {
	assert.equal(parseListingRef('monstera-deliciosa'), null);
	assert.equal(parseListingRef('monstera-12ab'), null);
	assert.equal(parseListingRef('1234-extra'), null);
	assert.equal(parseListingRef(''), null);
	assert.equal(parseListingRef('0'), null);
	assert.equal(parseListingRef('-5'), null);
});

test('parseListingRef exige una sola forma canónica por anuncio', () => {
	// Sin guion de separación: no es la URL canónica.
	assert.equal(parseListingRef('monstera1234'), null);
	// Ceros a la izquierda: el mismo anuncio con otra URL.
	assert.equal(parseListingRef('monstera-0123'), null);
	assert.equal(parseListingRef('0123'), null);
	// Caracteres que no son de slug.
	assert.equal(parseListingRef('monstera_deliciosa-12'), null);
	assert.equal(parseListingRef('monstera deliciosa-12'), null);
});

test('slugIsStale detecta un título cambiado y respeta el número solo', () => {
	assert.equal(slugIsStale({ publicId: 1, slug: 'monstera-deliciosa' }, 'Monstera deliciosa'), false);
	assert.equal(slugIsStale({ publicId: 1, slug: 'monstera' }, 'Monstera deliciosa'), true);
	assert.equal(slugIsStale({ publicId: 1, slug: '' }, 'Lo que sea'), false);
});

test('ida y vuelta: la ruta generada se vuelve a leer', () => {
	const path = listingPath('Cactus de Navidad', 42);
	const param = path.split('/').pop()!;
	assert.deepEqual(parseListingRef(param), { publicId: 42, slug: 'cactus-de-navidad' });
});
