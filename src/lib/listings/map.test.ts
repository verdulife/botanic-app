import assert from 'node:assert/strict';
import { test } from 'node:test';
import { aggregateSellers, clusterSellers, mapCapsForZoom } from './map.ts';
import type { Coordinates, Listing } from './types.ts';

function listing(overrides: Partial<Listing> = {}): Listing {
	return {
		id: 'listing-1',
		publicId: 1,
		title: 'Monstera',
		price: 10,
		category: 'Plantas',
		categorySlug: 'plantas',
		location: 'Malasaña, Madrid',
		seller: 'ana',
		sellerId: 'seller-ana',
		sellerInfo: {
			username: 'ana',
			full_name: 'Ana Ruiz',
			bio: '',
			city: 'Malasaña',
			rating: 4.5,
			reviewCount: 3
		},
		images: [],
		type: ['vender'],
		coordinates: { lat: 40.4265, lng: -3.7038 },
		datePosted: new Date('2025-01-01T00:00:00Z'),
		description: '',
		...overrides
	};
}

test('aggregateSellers agrupa por vendedor y cuenta sus anuncios', () => {
	const sellers = aggregateSellers([
		listing({ id: 'a', publicId: 1 }),
		listing({ id: 'b', publicId: 2 }),
		listing({
			id: 'c',
			publicId: 3,
			sellerId: 'seller-luis',
			sellerInfo: {
				username: 'luis',
				full_name: 'Luis Vega',
				bio: '',
				city: 'Malasaña',
				rating: 3.8,
				reviewCount: 9
			},
			coordinates: { lat: 40.43, lng: -3.71 }
		})
	]);

	assert.equal(sellers.length, 2);
	assert.deepEqual(
		sellers.map((s) => [s.username, s.count]),
		[
			['ana', 2],
			['luis', 1]
		]
	);
	// Los datos del vendedor salen tal y como los lee la base.
	assert.deepEqual(sellers[0], {
		username: 'ana',
		full_name: 'Ana Ruiz',
		rating: 4.5,
		reviewCount: 3,
		count: 2,
		lat: 40.4265,
		lng: -3.7038
	});
});

test('aggregateSellers coloca al vendedor en la posición de su anuncio, no en la del barrio', () => {
	const sellers = aggregateSellers([
		listing({ id: 'a', coordinates: { lat: 40.41, lng: -3.7 } }),
		listing({ id: 'b', coordinates: { lat: 40.99, lng: -3.99 } })
	]);

	assert.equal(sellers.length, 1);
	// La primera posición vista manda: el segundo anuncio solo suma al contador.
	assert.equal(sellers[0].lat, 40.41);
	assert.equal(sellers[0].lng, -3.7);
	assert.equal(sellers[0].count, 2);
});

test('aggregateSellers descarta los anuncios sin coordenadas', () => {
	const located: Coordinates = { lat: 40.42, lng: -3.71 };
	const sellers = aggregateSellers([
		listing({ id: 'a', coordinates: null }),
		listing({ id: 'b', coordinates: located }),
		listing({
			id: 'c',
			sellerId: 'seller-sin-posicion',
			sellerInfo: {
				username: 'sinposicion',
				full_name: 'Sin Posición',
				bio: '',
				city: '',
				rating: 0,
				reviewCount: 0
			},
			coordinates: null
		})
	]);

	assert.equal(sellers.length, 1);
	assert.equal(sellers[0].count, 1);
	assert.equal(sellers[0].lat, located.lat);
	assert.equal(sellers[0].lng, located.lng);
});

test('mapCapsForZoom mantiene los topes por tramo de zoom', () => {
	assert.deepEqual(mapCapsForZoom(10.9), { maxMarkers: 6, maxChips: 3 });
	assert.deepEqual(mapCapsForZoom(11), { maxMarkers: 12, maxChips: 4 });
	assert.deepEqual(mapCapsForZoom(13), { maxMarkers: 20, maxChips: 5 });
	assert.deepEqual(mapCapsForZoom(15), {
		maxMarkers: Number.POSITIVE_INFINITY,
		maxChips: 0
	});
});

test('clusterSellers respeta el tope de markers y junta los ocultos en chips', () => {
	const sellers = Array.from({ length: 8 }, (_, i) => ({
		username: `vendedor-${i}`,
		full_name: `Vendedor ${i}`,
		rating: 5 - i * 0.1,
		reviewCount: i,
		count: 1,
		lat: 40.4 + i * 0.001,
		lng: -3.7 + i * 0.001
	}));

	const { markers, chips } = clusterSellers(sellers, 12, 2, 1);

	assert.equal(markers.length, 2);
	assert.equal(chips.length, 1);
	assert.equal(chips[0].count, 6);
	assert.equal(chips[0].members.length, 6);
	// Los markers son los mejor valorados: el ranking no cambia al mover el código.
	assert.deepEqual(
		markers.map((m) => m.username),
		['vendedor-0', 'vendedor-1']
	);
});
