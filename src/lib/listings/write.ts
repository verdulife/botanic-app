/**
 * Escritura de anuncios contra Supabase.
 *
 * El cliente llega por petición, igual que en la lectura (./query.ts): este
 * módulo no abre conexiones ni guarda estado. El vendedor sale siempre de la
 * sesión (`seller_id = auth.uid()` lo exige la RLS), nunca de lo que diga el
 * formulario.
 *
 * Un anuncio son tres escrituras encadenadas: la fila en `listings`, los
 * ficheros en Storage y las filas de `listing_images`. No hay transacción que
 * las cubra, así que cada fallo se lanza con el contexto suficiente para saber
 * qué quedó escrito: nunca se devuelve un anuncio a medias como si estuviera
 * completo.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Json } from '$lib/supabase/types';
import type { ListingType, PlantSpecies } from './types';
import { ACCEPTED_PHOTO_TYPES, MAX_PHOTO_BYTES, MAX_PHOTOS, extensionFor } from './image.ts';
import { listingSizes } from './options.ts';

/** Bucket de las fotos del anuncio, con su límite por fichero. */
export const LISTING_IMAGES_BUCKET = 'listing-images';

/** Topes de texto: los mismos que caben en una tarjeta y en el detalle. */
export const MAX_TITLE_LENGTH = 120;
export const MAX_DESCRIPTION_LENGTH = 2000;

const LISTING_TYPES: readonly ListingType[] = ['vender', 'cambiar', 'regalar'];

/** Categoría del formulario, tal y como sale de la tabla `categories`. */
export type CategoryOption = { id: number; slug: string; name: string };

/** Ubicación elegible. Las coordenadas son del barrio, no de una casa. */
export type LocationOption = { label: string; lat: number; lng: number };

/** Anuncio ya validado, listo para escribirse. */
export type ListingInput = {
	sellerId: string;
	title: string;
	categoryId: number;
	types: ListingType[];
	// `null` cuando no hay precio: se regala, se cambia sin precio orientativo o
	// simplemente no se indicó.
	price: number | null;
	description: string;
	size: string | null;
	locationLabel: string;
	lat: number;
	lng: number;
	species: PlantSpecies | null;
	photos: File[];
};

export type ParseListingOptions = {
	/** `uid` de la sesión: el vendedor y el primer segmento de la carpeta. */
	sellerId: string;
	categories: readonly CategoryOption[];
	locations: readonly LocationOption[];
};

export type ParseListingResult =
	| { ok: true; value: ListingInput }
	| { ok: false; error: string };

/** Anuncio publicado: lo que hace falta para llevar al detalle canónico. */
export type CreatedListing = { publicId: number; title: string };

function text(form: FormData, key: string): string {
	const value = form.get(key);
	return typeof value === 'string' ? value.trim() : '';
}

function readPhotos(form: FormData): File[] {
	return form
		.getAll('photos')
		.filter((value): value is File => value instanceof File && value.size > 0);
}

// El jsonb de `species` es opcional: solo se escriben las claves que existen.
function readSpecies(form: FormData): PlantSpecies | null {
	const name = text(form, 'species');
	if (!name) return null;

	const species: PlantSpecies = { name };
	const scientific = text(form, 'species_scientific');
	const genus = text(form, 'species_genus');
	const family = text(form, 'species_family');
	if (scientific) species.scientific = scientific;
	if (genus) species.genus = genus;
	if (family) species.family = family;

	const confidence = Number(text(form, 'species_confidence'));
	if (Number.isFinite(confidence) && confidence > 0) species.confidence = confidence;
	// Un nombre científico solo llega desde Pl@ntNet; el resto se escribe a mano.
	species.source = scientific ? 'plantnet' : 'manual';

	return species;
}

function readTypes(form: FormData): ListingType[] {
	const values = form
		.getAll('types')
		.filter((value): value is string => typeof value === 'string');
	return LISTING_TYPES.filter((type) => values.includes(type));
}

function readPrice(form: FormData, types: ListingType[]): { ok: true; value: number | null } | { ok: false } {
	// Regalar es gratuito por definición: no se guarda un precio que la interfaz
	// no enseña.
	if (types.includes('regalar')) return { ok: true, value: null };

	const raw = text(form, 'price');
	if (!raw) return { ok: true, value: null };

	const price = Number(raw.replace(',', '.'));
	if (!Number.isFinite(price) || price < 0 || price > 99_999_999) return { ok: false };
	return { ok: true, value: Math.round(price * 100) / 100 };
}

/**
 * Valida el formulario y lo convierte en lo que se escribe. Función pura: no
 * toca el cliente ni la red, así que se prueba sin base de datos.
 *
 * El primer problema encontrado se devuelve como mensaje: el formulario enseña
 * uno a la vez, igual que hacía la vista.
 */
export function parseListingForm(
	form: FormData,
	options: ParseListingOptions
): ParseListingResult {
	const title = text(form, 'title');
	if (!title) return { ok: false, error: 'Escribe un título para el anuncio.' };
	if (title.length > MAX_TITLE_LENGTH) {
		return { ok: false, error: `El título no puede pasar de ${MAX_TITLE_LENGTH} caracteres.` };
	}

	const slug = text(form, 'category');
	const category = options.categories.find((candidate) => candidate.slug === slug);
	if (!category) return { ok: false, error: 'Elige una categoría para el anuncio.' };

	const types = readTypes(form);
	if (types.length === 0) {
		return { ok: false, error: 'Elige al menos un tipo de operación.' };
	}
	if (types.includes('regalar') && types.length > 1) {
		return { ok: false, error: 'Regalar no se puede combinar con vender o cambiar.' };
	}

	const price = readPrice(form, types);
	if (!price.ok) return { ok: false, error: 'Indica un precio válido.' };

	const description = text(form, 'description');
	if (description.length > MAX_DESCRIPTION_LENGTH) {
		return {
			ok: false,
			error: `La descripción no puede pasar de ${MAX_DESCRIPTION_LENGTH} caracteres.`
		};
	}

	const size = text(form, 'size') || null;
	if (size && !(listingSizes as readonly string[]).includes(size)) {
		return { ok: false, error: 'Elige un tamaño válido.' };
	}

	const locationLabel = text(form, 'location');
	const location = options.locations.find(
		(candidate) => candidate.label.toLowerCase() === locationLabel.toLowerCase()
	);
	if (!location) return { ok: false, error: 'Elige una ubicación de la lista.' };

	const photos = readPhotos(form);
	if (photos.length === 0) return { ok: false, error: 'Añade al menos una foto.' };
	if (photos.length > MAX_PHOTOS) {
		return { ok: false, error: `Puedes subir hasta ${MAX_PHOTOS} fotos.` };
	}
	for (const photo of photos) {
		// El bucket tiene el límite por fichero: lo que no quepa se rechaza aquí y
		// no a mitad de la subida.
		if (!(ACCEPTED_PHOTO_TYPES as readonly string[]).includes(photo.type)) {
			return { ok: false, error: 'Cada foto tiene que ser webp, jpeg o png.' };
		}
		if (photo.size > MAX_PHOTO_BYTES) {
			return { ok: false, error: 'Cada foto no puede pasar de 512 KB.' };
		}
	}

	return {
		ok: true,
		value: {
			sellerId: options.sellerId,
			title,
			categoryId: category.id,
			types,
			price: price.value,
			description,
			size,
			locationLabel: location.label,
			lat: location.lat,
			lng: location.lng,
			species: readSpecies(form),
			photos
		}
	};
}

function toSpeciesJson(species: PlantSpecies | null): Json | null {
	if (!species) return null;
	const json: Record<string, Json> = { name: species.name };
	if (species.scientific) json.scientific = species.scientific;
	if (species.genus) json.genus = species.genus;
	if (species.family) json.family = species.family;
	if (typeof species.confidence === 'number') json.confidence = species.confidence;
	if (species.source) json.source = species.source;
	return json;
}

/**
 * Categorías del formulario, en el orden que fija `position`.
 *
 * Un error de base se lanza: sin categorías no hay formulario, y un desplegable
 * vacío parecería que la app no tiene categorías.
 */
export async function getCategories(
	supabase: SupabaseClient<Database>
): Promise<CategoryOption[]> {
	const { data, error } = await supabase
		.from('categories')
		.select('id, slug, name')
		.order('position', { ascending: true });

	if (error) {
		console.error('[listings] No se pudieron leer las categorías:', error.message);
		throw error;
	}

	return (data ?? []).map((row) => ({ id: row.id, slug: row.slug, name: row.name }));
}

/**
 * Publica un anuncio: fila, fotos y filas de imágenes.
 *
 * Devuelve el número público y el título, que son lo que necesita la URL del
 * detalle. Cualquier fallo se lanza con el paso y lo que quedó escrito: un
 * anuncio sin fotos no puede parecer publicado.
 */
export async function createListing(
	supabase: SupabaseClient<Database>,
	input: ListingInput
): Promise<CreatedListing> {
	const { data: listing, error } = await supabase
		.from('listings')
		.insert({
			seller_id: input.sellerId,
			title: input.title,
			description: input.description || null,
			category_id: input.categoryId,
			price: input.price,
			location_label: input.locationLabel,
			lat: input.lat,
			lng: input.lng,
			types: input.types,
			size: input.size,
			species: toSpeciesJson(input.species)
		})
		.select('id, public_id, title')
		.single();

	if (error || !listing) {
		throw new Error(
			`No se pudo crear el anuncio: ${error?.message ?? 'la base no devolvió la fila'}`,
			{ cause: error ?? undefined }
		);
	}

	// La carpeta empieza por el `uid` de quien sube: es lo que exige la política
	// de Storage (`auth.uid()::text = (storage.foldername(name))[1]`).
	const uploaded: { path: string; url: string }[] = [];
	for (const [index, photo] of input.photos.entries()) {
		const path = `${input.sellerId}/${listing.id}/${crypto.randomUUID()}.${extensionFor(photo.type)}`;
		const { error: uploadError } = await supabase.storage
			.from(LISTING_IMAGES_BUCKET)
			.upload(path, photo, { contentType: photo.type, cacheControl: '3600', upsert: false });

		if (uploadError) {
			throw new Error(
				`El anuncio ${listing.public_id} se creó, pero la foto ${index + 1} no se pudo subir ` +
					`(${uploaded.length} de ${input.photos.length}): ${uploadError.message}`,
				{ cause: uploadError }
			);
		}

		const { data: publicUrl } = supabase.storage.from(LISTING_IMAGES_BUCKET).getPublicUrl(path);
		uploaded.push({ path, url: publicUrl.publicUrl });
	}

	const { error: imagesError } = await supabase.from('listing_images').insert(
		uploaded.map((image, position) => ({
			listing_id: listing.id,
			storage_path: image.path,
			url: image.url,
			position
		}))
	);

	if (imagesError) {
		throw new Error(
			`El anuncio ${listing.public_id} y sus ${uploaded.length} fotos se subieron, ` +
				`pero no se pudieron guardar las filas de imágenes: ${imagesError.message}`,
			{ cause: imagesError }
		);
	}

	return { publicId: listing.public_id, title: listing.title };
}
