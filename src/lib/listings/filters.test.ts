import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
	defaultFilters,
	filterListings,
	sortListings,
	type Filters
} from './filters.ts';
import type { Listing } from './types.ts';
import { DEFAULT_ORIGIN } from './geo.ts';

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

/** Anuncio completo; cada test cambia solo lo que le importa. */
function listing(overrides: Partial<Listing> = {}): Listing {
	return {
		id: 'a',
		publicId: 1,
		title: 'Monstera deliciosa',
		price: 20,
		category: 'Plantas',
		categorySlug: 'plantas',
		location: 'Gràcia, Barcelona',
		seller: 'Marta Puig',
		sellerInfo: {
			username: 'marta',
			full_name: 'Marta Puig',
			bio: '',
			city: 'Barcelona, Gràcia',
			rating: 4.6,
			reviewCount: 12
		},
		images: [],
		type: ['vender'],
		coordinates: { lat: 41.4036, lng: 2.1565 },
		datePosted: new Date(Date.now() - HOUR_MS),
		description: '',
		...overrides
	};
}

function filters(overrides: Partial<Filters> = {}): Filters {
	return { ...defaultFilters, ...overrides };
}

test('ordena por precio y por novedad sin mutar la lista de entrada', () => {
	const cheap = listing({ id: 'cheap', price: 5, datePosted: new Date('2026-01-03T00:00:00Z') });
	const pricey = listing({ id: 'pricey', price: 80, datePosted: new Date('2026-01-02T00:00:00Z') });
	const old = listing({ id: 'old', price: 20, datePosted: new Date('2026-01-01T00:00:00Z') });
	const input = [pricey, old, cheap];

	const byPrice = sortListings(input, 'precio-asc').map((l) => l.id);
	assert.deepEqual(byPrice, ['cheap', 'old', 'pricey']);

	assert.deepEqual(
		sortListings(input, 'precio-desc').map((l) => l.id),
		['pricey', 'old', 'cheap']
	);
	assert.deepEqual(
		sortListings(input, 'novedad').map((l) => l.id),
		['cheap', 'pricey', 'old']
	);
	// La lista original conserva su orden.
	assert.deepEqual(
		input.map((l) => l.id),
		['pricey', 'old', 'cheap']
	);
});

test('ordena por distancia desde el origen y deja al final los anuncios sin posición', () => {
	// Madrid es el origen por defecto: Alcalá cerca, Barcelona lejos, sin
	// coordenadas al final (no se inventa una posición).
	const near = listing({ id: 'near', coordinates: { lat: 40.4258, lng: -3.7068 } });
	const far = listing({ id: 'far', coordinates: { lat: 41.4036, lng: 2.1565 } });
	const homeless = listing({ id: 'homeless', coordinates: null });
	const input = [homeless, far, near];

	assert.deepEqual(
		sortListings(input, 'distancia').map((l) => l.id),
		['near', 'far', 'homeless']
	);

	const mexico = { lat: 19.4326, lng: -99.1332 };
	assert.deepEqual(
		sortListings(input, 'distancia', mexico).map((l) => l.id),
		['near', 'far', 'homeless']
	);

	// Con el origen en Barcelona, el anuncio de Barcelona va primero.
	const barcelona = { lat: 41.4036, lng: 2.1565 };
	assert.deepEqual(
		sortListings(input, 'distancia', barcelona).map((l) => l.id),
		['far', 'near', 'homeless']
	);
});

test('el filtro de tipo es una unión: basta con que el anuncio soporte uno', () => {
	const sale = listing({ id: 'sale', type: ['vender'] });
	const swap = listing({ id: 'swap', type: ['vender', 'cambiar'] });
	const gift = listing({ id: 'gift', type: ['regalar'] });

	const chosen = filterListings([sale, swap, gift], filters({ tipo: ['cambiar', 'regalar'] }));
	assert.deepEqual(
		chosen.map((l) => l.id),
		['swap', 'gift']
	);

	// Sin tipo elegido pasan todos.
	assert.equal(filterListings([sale, swap, gift], filters()).length, 3);
});

test('filtra por categoría, texto y rango de precio', () => {
	const plants = listing({ id: 'plants', category: 'Plantas', title: 'Ficus lyrata' });
	const pots = listing({
		id: 'pots',
		category: 'Tiestos',
		title: 'Tiesto de cerámica',
		location: 'Bilbao, Indautxu',
		price: 60
	});
	const all = [plants, pots];

	assert.deepEqual(
		filterListings(all, filters({ categoria: 'Plantas' })).map((l) => l.id),
		['plants']
	);
	assert.equal(filterListings(all, filters({ categoria: 'Todas las categorías' })).length, 2);
	assert.deepEqual(
		filterListings(all, filters({ termino: 'tiesto' })).map((l) => l.id),
		['pots']
	);
	assert.deepEqual(
		filterListings(all, filters({ termino: 'bilbao' })).map((l) => l.id),
		['pots']
	);
	assert.deepEqual(
		filterListings(all, filters({ precioMin: 10, precioMax: 30 })).map((l) => l.id),
		['plants']
	);
});

test('el filtro de publicado corta por antigüedad', () => {
	const recent = listing({ id: 'recent', datePosted: new Date(Date.now() - 2 * HOUR_MS) });
	const week = listing({ id: 'week', datePosted: new Date(Date.now() - 3 * DAY_MS) });
	const old = listing({ id: 'old', datePosted: new Date(Date.now() - 60 * DAY_MS) });
	const all = [recent, week, old];

	assert.deepEqual(
		filterListings(all, filters({ publicado: 'hoy' })).map((l) => l.id),
		['recent']
	);
	assert.deepEqual(
		filterListings(all, filters({ publicado: 'semana' })).map((l) => l.id),
		['recent', 'week']
	);
	assert.deepEqual(
		filterListings(all, filters({ publicado: 'mes' })).map((l) => l.id),
		['recent', 'week']
	);
	assert.equal(filterListings(all, filters({ publicado: 'cualquiera' })).length, 3);
});

test('el origen por defecto del orden por distancia está en España', () => {
	assert.equal(DEFAULT_ORIGIN.lat > 36 && DEFAULT_ORIGIN.lat < 44, true);
	assert.equal(DEFAULT_ORIGIN.lng > -10 && DEFAULT_ORIGIN.lng < 5, true);
});
