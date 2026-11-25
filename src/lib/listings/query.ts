// Lectura de anuncios contra Supabase.
//
// El cliente llega por petición (patrón de src/routes/app/+layout.server.ts):
// este módulo no abre conexiones ni guarda estado. Los errores de base no se
// lanzan: se registran y la lectura devuelve vacío, para que una caída de la
// consulta no tumbe la página.

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Json } from '$lib/supabase/types';
import type { Listing, ListingType, PlantSpecies, SellerInfo } from './types';

// Columnas reales del esquema: `categories` (name, slug), `profiles` (username,
// full_name, bio, location_label, lat, lng — sin `rating`, `review_count` ni
// `email`) y `listing_images` (url, position).
//
// El `select` va como literal y no como concatenación: el cliente tipado lo
// interpreta en tiempo de compilación y un `string` genérico se rechaza.
const LISTING_SELECT = `id, title, price, description, types, species, size, lat, lng,
	location_label, created_at, categories!listings_category_id_fkey ( name, slug ),
	profiles!listings_seller_id_fkey ( username, full_name, bio, location_label, lat, lng ),
	listing_images ( url, position )`;

type CategoryEmbed = Pick<Database['public']['Tables']['categories']['Row'], 'name' | 'slug'> | null;

type SellerEmbed = Pick<
	Database['public']['Tables']['profiles']['Row'],
	'username' | 'full_name' | 'bio' | 'location_label' | 'lat' | 'lng'
> | null;

type ImageEmbed = Pick<Database['public']['Tables']['listing_images']['Row'], 'url' | 'position'>;

// Fila tal y como la devuelve el `select` de arriba: las columnas del anuncio
// más el vendedor, la categoría y las imágenes embebidas.
type ListingRow = Pick<
	Database['public']['Tables']['listings']['Row'],
	| 'id'
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
		// `profiles` todavía no guarda valoraciones.
		rating: 0,
		reviewCount: 0
	};
}

function toListing(row: ListingRow): Listing {
	const profile = row.profiles;
	const images = [...(row.listing_images ?? [])].sort((a, b) => a.position - b.position);

	return {
		id: row.id,
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
		// Sin coordenadas propias se usa el centro del vendedor; el mapa necesita
		// un número siempre.
		coordinates: {
			lat: row.lat ?? profile?.lat ?? 0,
			lng: row.lng ?? profile?.lng ?? 0
		},
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
		return [];
	}

	return (data ?? []).map(toListing);
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
		return null;
	}

	return data ? toListing(data) : null;
}
