import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/supabase/types';
import { getActiveListings, getListingByPublicId, getListingById } from './query.ts';

// Cliente falso: registra lo que pide la consulta y devuelve la fila indicada.
// Las funciones de ./query.ts leen del cliente y no guardan estado, así que basta
// con reproducir la cadena `from().select().eq().order().maybeSingle()`.
type Call = readonly unknown[];

function fakeClient(row: unknown, { list = false } = {}) {
	const calls: Call[] = [];
	// La consulta de listado espera un array; la de detalle, una fila o nada.
	const data = list ? (row === null ? [] : [row]) : row;
	const builder = {
		select(columns: string) {
			calls.push(['select', columns]);
			return builder;
		},
		eq(column: string, value: unknown) {
			calls.push(['eq', column, value]);
			return builder;
		},
		order(column: string) {
			calls.push(['order', column]);
			return builder;
		},
		then(resolve: (value: { data: unknown; error: null }) => unknown) {
			return Promise.resolve({ data, error: null }).then(resolve);
		},
		maybeSingle() {
			return Promise.resolve({ data, error: null });
		}
	};
	const client = {
		from(table: string) {
			calls.push(['from', table]);
			return builder;
		}
	};
	return { client: client as unknown as SupabaseClient<Database>, calls };
}

/** Fila tal y como la devuelve `LISTING_SELECT`, con todas las columnas rellenas. */
function listingRow() {
	return {
		id: '11111111-1111-4111-8111-111111111111',
		public_id: 4321,
		title: 'Monstera deliciosa enorme',
		price: 25,
		description: 'Con maceta.',
		types: ['vender'],
		species: { name: 'Monstera deliciosa' },
		size: 'grande',
		lat: 41.39,
		lng: 2.17,
		location_label: 'Gràcia, Barcelona',
		created_at: '2026-01-02T03:04:05.000Z',
		categories: { name: 'Interior', slug: 'interior' },
		profiles: {
			username: 'marta',
			full_name: 'Marta Puig',
			bio: 'Colecciono monsteras.',
			location_label: 'Barcelona',
			lat: 41.38,
			lng: 2.16,
			rating: 4.6,
			review_count: 12
		},
		listing_images: [
			{ url: 'https://cdn.example/a.jpg', position: 1 },
			{ url: 'https://cdn.example/b.jpg', position: 0 }
		]
	};
}

function selectOf(calls: Call[]): string {
	const select = calls.find((call) => call[0] === 'select');
	assert.ok(select, 'la consulta tiene que elegir columnas');
	return String(select[1]);
}

test('el anuncio leído conserva las valoraciones guardadas del vendedor', async () => {
	const { client, calls } = fakeClient(listingRow(), { list: true });
	const listings = await getActiveListings(client);

	assert.equal(listings.length, 1);
	const listing = listings[0];
	assert.ok(listing);
	assert.equal(listing.sellerInfo.rating, 4.6);
	assert.equal(listing.sellerInfo.reviewCount, 12);
	assert.equal(listing.sellerInfo.username, 'marta');

	// Sin estas columnas en el `select`, la base no las entrega nunca.
	const select = selectOf(calls);
	assert.match(select, /\brating\b/);
	assert.match(select, /\breview_count\b/);
});

test('el anuncio leído expone su número público', async () => {
	const { client, calls } = fakeClient(listingRow(), { list: true });
	const listings = await getActiveListings(client);

	assert.equal(listings[0]?.publicId, 4321);
	assert.match(selectOf(calls), /\bpublic_id\b/);
});

test('getListingByPublicId lee por número público', async () => {
	const { client, calls } = fakeClient(listingRow());
	const listing = await getListingByPublicId(client, 4321);

	assert.ok(calls.some((call) => call[0] === 'eq' && call[1] === 'public_id' && call[2] === 4321));
	assert.equal(listing?.publicId, 4321);
	assert.equal(listing?.sellerInfo.rating, 4.6);
	assert.equal(listing?.sellerInfo.reviewCount, 12);
	// Las imágenes salen ordenadas por `position`, no en el orden de la respuesta.
	assert.deepEqual(listing?.images, ['https://cdn.example/b.jpg', 'https://cdn.example/a.jpg']);
});

test('getListingById sigue leyendo por uuid y devuelve null si no hay fila', async () => {
	const { client, calls } = fakeClient(listingRow());
	const listing = await getListingById(client, listingRow().id);

	assert.ok(
		calls.some(
			(call) => call[0] === 'eq' && call[1] === 'id' && call[2] === listingRow().id
		)
	);
	assert.equal(listing?.id, listingRow().id);
	assert.equal(listing?.publicId, 4321);
	assert.equal(listing?.title, 'Monstera deliciosa enorme');

	const empty = fakeClient(null);
	assert.equal(await getListingById(empty.client, listingRow().id), null);
});
