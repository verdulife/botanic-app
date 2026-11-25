import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/supabase/types';
import { MAX_PHOTO_BYTES } from './image.ts';
import {
	createListing,
	getCategories,
	parseListingForm,
	type CategoryOption,
	type LocationOption
} from './write.ts';

// ──────────────────────────────────────────────────────────
// Datos de referencia del formulario
// ──────────────────────────────────────────────────────────

const CATEGORIES: CategoryOption[] = [
	{ id: 1, slug: 'semillas', name: 'Semillas' },
	{ id: 3, slug: 'plantas', name: 'Plantas' }
];

const LOCATIONS: LocationOption[] = [
	{ label: 'Barcelona, Gràcia', lat: 41.4036, lng: 2.1565 },
	{ label: 'Madrid, Centro', lat: 40.4168, lng: -3.7038 }
];

const SELLER_ID = '22222222-2222-4222-8222-222222222222';
const LISTING_ID = '11111111-1111-4111-8111-111111111111';

function photo(type = 'image/webp', size = 1024, name = 'foto.webp'): File {
	const bytes = new Uint8Array(size);
	return new File([bytes], name, { type });
}

function form(fields: Record<string, string | string[]>, photos: File[] = [photo()]): FormData {
	const data = new FormData();
	for (const [key, value] of Object.entries(fields)) {
		for (const item of Array.isArray(value) ? value : [value]) data.append(key, item);
	}
	for (const file of photos) data.append('photos', file);
	return data;
}

function validFields(overrides: Record<string, string | string[]> = {}) {
	return {
		title: 'Monstera deliciosa enorme',
		category: 'plantas',
		types: ['vender'],
		price: '25',
		description: 'Con maceta.',
		size: 'Grande',
		location: 'Barcelona, Gràcia',
		...overrides
	};
}

function parse(fields: Record<string, string | string[]>, photos: File[] = [photo()]) {
	return parseListingForm(form(fields, photos), {
		sellerId: SELLER_ID,
		categories: CATEGORIES,
		locations: LOCATIONS
	});
}

// ──────────────────────────────────────────────────────────
// Validación (función pura)
// ──────────────────────────────────────────────────────────

test('un formulario completo se resuelve con la categoría y la ubicación de la base', () => {
	const result = parse(validFields());

	assert.equal(result.ok, true);
	assert.ok(result.ok);
	assert.equal(result.value.sellerId, SELLER_ID);
	assert.equal(result.value.title, 'Monstera deliciosa enorme');
	assert.equal(result.value.categoryId, 3);
	assert.deepEqual(result.value.types, ['vender']);
	assert.equal(result.value.price, 25);
	assert.equal(result.value.description, 'Con maceta.');
	assert.equal(result.value.size, 'Grande');
	assert.equal(result.value.locationLabel, 'Barcelona, Gràcia');
	// Las coordenadas salen de la ubicación elegida, no se inventan.
	assert.deepEqual(
		{ lat: result.value.lat, lng: result.value.lng },
		{ lat: 41.4036, lng: 2.1565 }
	);
	assert.equal(result.value.photos.length, 1);
	assert.equal(result.value.species, null);
});

test('el precio es opcional y se guarda como null cuando no viene', () => {
	const result = parse(validFields({ price: '' }));

	assert.ok(result.ok);
	assert.equal(result.value.price, null);
});

test('un anuncio de regalo no guarda precio', () => {
	const result = parse(validFields({ types: ['regalar'], price: '25' }));

	assert.ok(result.ok);
	assert.deepEqual(result.value.types, ['regalar']);
	assert.equal(result.value.price, null);
});

test('el tamaño es opcional', () => {
	const result = parse(validFields({ size: '' }));

	assert.ok(result.ok);
	assert.equal(result.value.size, null);
});

test('la especie se guarda solo si se escribió', () => {
	const none = parse(validFields({ species: '   ' }));
	assert.ok(none.ok);
	assert.equal(none.value.species, null);

	const filled = parse(
		validFields({
			species: 'Monstera deliciosa',
			species_scientific: 'Monstera deliciosa Liebm.',
			species_confidence: '0.8'
		})
	);
	assert.ok(filled.ok);
	assert.deepEqual(filled.value.species, {
		name: 'Monstera deliciosa',
		scientific: 'Monstera deliciosa Liebm.',
		confidence: 0.8,
		// Detectada por Pl@ntNet (hay nombre científico) y editable a mano.
		source: 'plantnet'
	});
});

test('sin título no se publica', () => {
	const result = parse(validFields({ title: '   ' }));

	assert.equal(result.ok, false);
	assert.ok(!result.ok);
	assert.equal(result.error, 'Escribe un título para el anuncio.');
});

test('una categoría que no existe no se publica', () => {
	const result = parse(validFields({ category: 'inventada' }));

	assert.ok(!result.ok);
	assert.equal(result.error, 'Elige una categoría para el anuncio.');
});

test('hace falta al menos un tipo de operación', () => {
	const result = parse(validFields({ types: [] }));

	assert.ok(!result.ok);
	assert.equal(result.error, 'Elige al menos un tipo de operación.');
});

test('un tipo inventado no cuenta como tipo de operación', () => {
	const result = parse(validFields({ types: ['subastar'] }));

	assert.ok(!result.ok);
	assert.equal(result.error, 'Elige al menos un tipo de operación.');
});

test('regalar no se combina con vender ni cambiar', () => {
	const result = parse(validFields({ types: ['regalar', 'vender'] }));

	assert.ok(!result.ok);
	assert.equal(result.error, 'Regalar no se puede combinar con vender o cambiar.');
});

test('un precio que no es un número no se publica', () => {
	for (const price of ['abc', '-5', 'Infinity']) {
		const result = parse(validFields({ price }));
		assert.ok(!result.ok, `el precio ${price} no debería pasar`);
		assert.equal(result.error, 'Indica un precio válido.');
	}
});

test('una ubicación fuera de la lista no se publica', () => {
	const result = parse(validFields({ location: 'Casa de mi abuela' }));

	assert.ok(!result.ok);
	assert.equal(result.error, 'Elige una ubicación de la lista.');
});

test('un tamaño fuera de la lista no se publica', () => {
	const result = parse(validFields({ size: 'Enorme' }));

	assert.ok(!result.ok);
	assert.equal(result.error, 'Elige un tamaño válido.');
});

test('sin fotos no hay anuncio', () => {
	const result = parse(validFields(), []);

	assert.ok(!result.ok);
	assert.equal(result.error, 'Añade al menos una foto.');
});

test('no se admiten más de cinco fotos', () => {
	const photos = Array.from({ length: 6 }, (_, i) => photo('image/webp', 1024, `foto-${i}.webp`));
	const result = parse(validFields(), photos);

	assert.ok(!result.ok);
	assert.equal(result.error, 'Puedes subir hasta 5 fotos.');
});

test('una foto que no cabe en el bucket no se sube', () => {
	// 512 KB exactos ya no caben: el bucket rechaza a partir del límite.
	const result = parse(validFields(), [photo('image/webp', MAX_PHOTO_BYTES + 1)]);

	assert.ok(!result.ok);
	assert.equal(result.error, 'Cada foto no puede pasar de 512 KB.');
});

test('una foto que no es imagen no se sube', () => {
	const result = parse(validFields(), [photo('application/pdf', 1024, 'contrato.pdf')]);

	assert.ok(!result.ok);
	assert.equal(result.error, 'Cada foto tiene que ser webp, jpeg o png.');
});

// ──────────────────────────────────────────────────────────
// Escritura: cliente falso
// ──────────────────────────────────────────────────────────

type Call = readonly unknown[];
type FakeError = { message: string };

type FakeOptions = {
	listing?: { publicId: number; title: string } | null;
	listingError?: FakeError | null;
	imagesError?: FakeError | null;
	uploadErrorAt?: number | null;
	categories?: Record<string, unknown>[];
	categoriesError?: FakeError | null;
};

function fakeClient(options: FakeOptions = {}) {
	const calls: Call[] = [];
	const uploads: { path: string; file: unknown; contentType?: string }[] = [];
	const listing = options.listing === undefined ? { publicId: 4321, title: 'Monstera' } : options.listing;

	const client = {
		from(table: string) {
			return {
				insert(payload: unknown) {
					calls.push(['insert', table, payload]);
					if (table === 'listing_images') {
						return Promise.resolve({ error: options.imagesError ?? null });
					}
					return {
						select(columns: string) {
							calls.push(['select', table, columns]);
							return {
								single: async () => ({
									data:
										listing && !options.listingError
											? {
													id: LISTING_ID,
													public_id: listing.publicId,
													title: listing.title
												}
											: null,
									error: options.listingError ?? null
								})
							};
						}
					};
				},
				select(columns: string) {
					calls.push(['select', table, columns]);
					return {
						order: async (column: string, orderOptions?: unknown) => {
							calls.push(['order', column, orderOptions]);
							return {
								data: options.categoriesError ? null : (options.categories ?? []),
								error: options.categoriesError ?? null
							};
						}
					};
				}
			};
		},
		storage: {
			from(bucket: string) {
				calls.push(['storage', bucket]);
				return {
					upload: async (path: string, file: unknown, uploadOptions?: { contentType?: string }) => {
						const index = uploads.length;
						uploads.push({ path, file, contentType: uploadOptions?.contentType });
						calls.push(['upload', path]);
						const shouldFail = options.uploadErrorAt === index;
						return { data: shouldFail ? null : { path }, error: shouldFail ? { message: 'boom' } : null };
					},
					getPublicUrl: (path: string) => ({
						data: { publicUrl: `https://cdn.example/${path}` }
					})
				};
			}
		}
	};

	return {
		client: client as unknown as SupabaseClient<Database>,
		calls,
		uploads
	};
}

function listingInsert(calls: Call[]): Record<string, unknown> {
	const insert = calls.find((call) => call[0] === 'insert' && call[1] === 'listings');
	assert.ok(insert, 'la escritura tiene que insertar el anuncio');
	return insert[2] as Record<string, unknown>;
}

function input(overrides: Partial<Parameters<typeof createListing>[1]> = {}) {
	const parsed = parse(validFields());
	assert.ok(parsed.ok);
	return { ...parsed.value, ...overrides };
}

test('el anuncio se inserta con el vendedor de la sesión y los datos validados', async () => {
	const { client, calls } = fakeClient();
	const created = await createListing(client, input({ photos: [photo()] }));

	assert.deepEqual(created, { publicId: 4321, title: 'Monstera' });

	const payload = listingInsert(calls);
	assert.equal(payload.seller_id, SELLER_ID);
	assert.equal(payload.title, 'Monstera deliciosa enorme');
	assert.equal(payload.category_id, 3);
	assert.equal(payload.price, 25);
	assert.deepEqual(payload.types, ['vender']);
	assert.equal(payload.size, 'Grande');
	assert.equal(payload.location_label, 'Barcelona, Gràcia');
	assert.equal(payload.lat, 41.4036);
	assert.equal(payload.lng, 2.1565);
});

test('las fotos se suben a la carpeta del vendedor y las filas guardan su posición', async () => {
	const first = photo('image/webp', 1024, 'a.webp');
	const second = photo('image/jpeg', 1024, 'b.jpg');
	const { client, calls, uploads } = fakeClient();

	await createListing(client, input({ photos: [first, second] }));

	assert.equal(uploads.length, 2);
	for (const upload of uploads) {
		// Primer segmento = uid del vendedor: es lo que exige la política de Storage.
		assert.ok(upload.path.startsWith(`${SELLER_ID}/${LISTING_ID}/`), upload.path);
		assert.match(upload.path, /^[0-9a-f-]{36}\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.(webp|jpg)$/);
	}
	assert.equal(uploads[0]?.file, first);
	assert.equal(uploads[0]?.contentType, 'image/webp');
	assert.equal(uploads[1]?.contentType, 'image/jpeg');
	assert.notEqual(uploads[0]?.path, uploads[1]?.path);

	const rows = calls.find((call) => call[0] === 'insert' && call[1] === 'listing_images')?.[2] as
		| { position: number; url: string; storage_path: string; listing_id: string }[]
		| undefined;
	assert.ok(rows, 'tiene que insertar las filas de imágenes');
	assert.equal(rows.length, 2);
	assert.deepEqual(
		rows.map((row) => row.position),
		[0, 1]
	);
	// La portada es la primera foto que eligió quien publica.
	assert.ok(rows[0]?.url.endsWith('.webp'));
	assert.equal(rows[0]?.listing_id, LISTING_ID);
	assert.equal(rows[0]?.storage_path, uploads[0]?.path);
});

test('si el anuncio no se pudo crear, el error dice en qué paso falló', async () => {
	const { client, uploads } = fakeClient({ listing: null, listingError: { message: 'boom' } });

	await assert.rejects(createListing(client, input()), (error: FakeError) => {
		assert.match(error.message, /No se pudo crear el anuncio/);
		assert.match(error.message, /boom/);
		return true;
	});
	// Sin anuncio no se sube nada.
	assert.equal(uploads.length, 0);
});

test('si una foto falla a mitad, el error dice qué anuncio quedó y cuántas subieron', async () => {
	const { client, calls } = fakeClient({ uploadErrorAt: 1 });

	await assert.rejects(
		createListing(client, input({ photos: [photo(), photo('image/jpeg', 1024, 'b.jpg')] })),
		(error: FakeError) => {
			assert.match(error.message, /4321/);
			assert.match(error.message, /1 de 2/);
			return true;
		}
	);
	// El anuncio sin fotos no se queda como si nada: no se escriben sus filas.
	assert.ok(!calls.some((call) => call[0] === 'insert' && call[1] === 'listing_images'));
});

test('si las filas de imágenes no se guardan, el error nombra el anuncio creado', async () => {
	const { client } = fakeClient({ imagesError: { message: 'rls' } });

	await assert.rejects(createListing(client, input()), (error: FakeError) => {
		assert.match(error.message, /4321/);
		assert.match(error.message, /rls/);
		return true;
	});
});

test('getCategories devuelve las categorías en su orden', async () => {
	const { client, calls } = fakeClient({
		categories: [
			{ id: 1, slug: 'semillas', name: 'Semillas', position: 0 },
			{ id: 3, slug: 'plantas', name: 'Plantas', position: 2 }
		]
	});

	assert.deepEqual(await getCategories(client), [
		{ id: 1, slug: 'semillas', name: 'Semillas' },
		{ id: 3, slug: 'plantas', name: 'Plantas' }
	]);
	assert.ok(calls.some((call) => call[0] === 'select' && call[1] === 'categories'));
	assert.ok(
		calls.some(
			(call) =>
				call[0] === 'order' &&
				call[1] === 'position' &&
				(call[2] as { ascending?: boolean } | undefined)?.ascending === true
		)
	);
});

test('getCategories lanza el error de la base', async () => {
	const { client } = fakeClient({ categoriesError: { message: 'boom' } });

	await assert.rejects(getCategories(client), (error: FakeError) => {
		assert.equal(error.message, 'boom');
		return true;
	});
});
