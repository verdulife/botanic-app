// Lectura de anuncios contra Supabase.
//
// El cliente llega por petición (patrón de src/routes/app/+layout.server.ts):
// este módulo no abre conexiones ni guarda estado. Un error de base se lanza: no
// se convierte en lista vacía ni en `null`, porque un fallo de la consulta no es
// un mercado sin anuncios y quien carga la página decide qué hacer con él.

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Json } from '$lib/supabase/types';
import type { Coordinates, Listing, ListingType, PlantSpecies, SellerInfo } from './types';

// Columnas reales del esquema: `categories` (name, slug), `profiles` (username,
// full_name, bio, location_label, lat, lng, rating, review_count — el correo vive
// en auth y no se expone) y `listing_images` (url, position).
//
// El `select` va como literal y no como concatenación: el cliente tipado lo
// interpreta en tiempo de compilación y un `string` genérico se rechaza.
const LISTING_SELECT = `id, public_id, title, price, description, types, species, size, lat, lng,
	location_label, created_at, categories!listings_category_id_fkey ( name, slug ),
	profiles!listings_seller_id_fkey ( username, full_name, bio, location_label, lat, lng, rating, review_count ),
	listing_images ( url, position )`;

type CategoryEmbed = Pick<Database['public']['Tables']['categories']['Row'], 'name' | 'slug'> | null;

type SellerEmbed = Pick<
	Database['public']['Tables']['profiles']['Row'],
	| 'username'
	| 'full_name'
	| 'bio'
	| 'location_label'
	| 'lat'
	| 'lng'
	| 'rating'
	| 'review_count'
> | null;

type ImageEmbed = Pick<Database['public']['Tables']['listing_images']['Row'], 'url' | 'position'>;

// Fila tal y como la devuelve el `select` de arriba: las columnas del anuncio
// más el vendedor, la categoría y las imágenes embebidas.
type ListingRow = Pick<
	Database['public']['Tables']['listings']['Row'],
	| 'id'
	| 'public_id'
	| 'title'
	| 'price'
	| 'description'
	| 'types'
	| 'species'
	| 'size'
	| 'lat'
	| 'lng'
	| 'location_label'
	| 'created_at'
> & {
	categories: CategoryEmbed;
	profiles: SellerEmbed;
	listing_images: ImageEmbed[];
};

const LISTING_TYPES: readonly ListingType[] = ['vender', 'cambiar', 'regalar'];

function toListingTypes(values: string[]): ListingType[] {
	return values.filter((value): value is ListingType =>
		(LISTING_TYPES as readonly string[]).includes(value)
	);
}

// El jsonb de `species` es opcional y de forma variable: se valida campo a campo
// en vez de confiar en el tipo de la base.
function toPlantSpecies(value: Json | null): PlantSpecies | undefined {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
	if (typeof value.name !== 'string' || !value.name) return undefined;

	const species: PlantSpecies = { name: value.name };
	if (typeof value.scientific === 'string') species.scientific = value.scientific;
	if (typeof value.genus === 'string') species.genus = value.genus;
	if (typeof value.family === 'string') species.family = value.family;
	if (typeof value.confidence === 'number') species.confidence = value.confidence;
	if (value.source === 'manual' || value.source === 'plantnet') species.source = value.source;
	return species;
}

function toSellerInfo(row: ListingRow): SellerInfo {
	const profile = row.profiles;
	return {
		username: profile?.username ?? '',
		full_name: profile?.full_name ?? '',
		bio: profile?.bio ?? '',
		city: profile?.location_label ?? '',
		rating: profile?.rating ?? 0,
		reviewCount: profile?.review_count ?? 0
	};
}

// Una latitud y una longitud son una posición solo si vienen las dos: media
// pareja no sitúa nada.
function asCoordinates(lat: number | null, lng: number | null): Coordinates | null {
	if (lat === null || lng === null) return null;
	return { lat, lng };
}

// La posición del anuncio: manda la suya; si no tiene, la del vendedor; si
// tampoco, el anuncio no tiene posición y se queda sin coordenadas. Nunca se
// rellena con un punto de conveniencia: el (0,0) del mapa cae en el golfo de
// Guinea y pondría el anuncio donde no está.
function toCoordinates(row: ListingRow): Coordinates | null {
	const own = asCoordinates(row.lat, row.lng);
	if (own) return own;
	return asCoordinates(row.profiles?.lat ?? null, row.profiles?.lng ?? null);
}

function toListing(row: ListingRow): Listing {
	const profile = row.profiles;
	const images = [...(row.listing_images ?? [])].sort((a, b) => a.position - b.position);

	return {
		id: row.id,
		publicId: row.public_id,
		title: row.title,
		price: row.price ?? 0,
		category: row.categories?.name ?? '',
		categorySlug: row.categories?.slug ?? '',
		// `location_label` del anuncio manda; si falta, la del vendedor.
		location: row.location_label ?? profile?.location_label ?? '',
		seller: profile?.full_name ?? profile?.username ?? '',
		sellerInfo: toSellerInfo(row),
		images: images.map((image) => image.url),
		type: toListingTypes(row.types),
		coordinates: toCoordinates(row),
		datePosted: new Date(row.created_at),
		description: row.description ?? '',
		species: toPlantSpecies(row.species),
		size: row.size ?? undefined
		// `wishId` queda sin mapear: `listings` aún no tiene `wish_id`.
	};
}

export async function getActiveListings(supabase: SupabaseClient<Database>): Promise<Listing[]> {
	const { data, error } = await supabase
		.from('listings')
		.select(LISTING_SELECT)
		.eq('status', 'active')
		.order('created_at', { ascending: false })
		.order('position', { referencedTable: 'listing_images' });

	if (error) {
		console.error('[listings] No se pudieron leer los anuncios:', error.message);
		throw error;
	}

	return (data ?? []).map(toListing);
}

// La edición y el borrado van por uuid; la lectura pública, por número.
//
// `null` solo significa que el anuncio no existe. Un error de base se lanza: un
// fallo de la consulta no es un anuncio ausente.
export async function getListingByPublicId(
	supabase: SupabaseClient<Database>,
	publicId: number
): Promise<Listing | null> {
	const { data, error } = await supabase
		.from('listings')
		.select(LISTING_SELECT)
		.eq('public_id', publicId)
		.order('position', { referencedTable: 'listing_images' })
		.maybeSingle();

	if (error) {
		console.error('[listings] No se pudo leer el anuncio:', error.message);
		throw error;
	}

	return data ? toListing(data) : null;
}

export async function getListingById(
	supabase: SupabaseClient<Database>,
	id: string
): Promise<Listing | null> {
	const { data, error } = await supabase
		.from('listings')
		.select(LISTING_SELECT)
		.eq('id', id)
		.order('position', { referencedTable: 'listing_images' })
		.maybeSingle();

	if (error) {
		console.error('[listings] No se pudo leer el anuncio:', error.message);
		throw error;
	}

	return data ? toListing(data) : null;
}
