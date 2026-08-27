// Generador de listings mock "realistas" para el wireframe de la webapp.
//
// Reutiliza la misma data compartida del seed (usuarios, categorías, ubicaciones,
// plantillas) para que el cliente muestre lo que luego subirá a Supabase con
// `bun run seed:apply`, pero con las imágenes servidas LOCALMENTE desde
// /images/seed/ (ver DESIGN.md: Fotografía real servida localmente, no por CDN).
//
// El generador es determinista (misma semilla que scripts/seed-mock.ts) para
// que el resultado sea idéntico entre SSR y CSR (sin hydration mismatch).

import {
	CATEGORIES,
	LOCATIONS,
	LISTING_TEMPLATES,
	PLANT_TERMS,
	COLORS,
	SIZES,
	USERS,
	describe,
	mockEmailFor,
	type CategorySlug
} from './seed-data';

export type ListingType = 'vender' | 'cambiar' | 'regalar';

export type SellerInfo = {
	username: string;
	full_name: string;
	bio: string;
	city: string;
	email: string;
};

export type Listing = {
	id: string;
	title: string;
	price: number;
	category: string;
	categorySlug: CategorySlug;
	location: string;
	seller: string;
	sellerInfo: SellerInfo;
	images: string[];
	type: ListingType;
	coordinates: { lat: number; lng: number };
	datePosted: Date;
	description: string;
};

// ──────────────────────────────────────────────────────────
// Imágenes locales por categoría
// ──────────────────────────────────────────────────────────

// Los archivos seed están prefijados por categoría en static/images/seed/.
// Descubrimos los nombres de los webp en static/images/seed/ sin importarlos como
// assets (evita que Vite avise de importar la carpeta pública). La carpeta pública
// se sirve en la raíz, así que cada archivo se referencia como "/images/seed/<nombre>".
// Importante: no iteramos los loaders (no los llamamos), solo usamos las keys.
const seedImagePaths = import.meta.glob('../../../static/images/seed/*.webp') as Record<
	string,
	unknown
>;

// Clasifica cada ruta por su prefijo de categoría (p.ej. "plantas-02-..." → "plantas").
const IMAGES_BY_CATEGORY: Record<CategorySlug, string[]> = {
	semillas: [],
	esquejes: [],
	plantas: [],
	tiestos: [],
	accesorios: [],
	herramientas: [],
	libros: [],
	otros: []
};

// "accesorios" cubre también el prefijo "sustratos" (los sustratos son accesorios).
const PREFIX_TO_SLUG: Record<string, CategorySlug> = {
	semillas: 'semillas',
	esquejes: 'esquejes',
	plantas: 'plantas',
	tiestos: 'tiestos',
	accesorios: 'accesorios',
	sustratos: 'accesorios',
	herramientas: 'herramientas',
	libros: 'libros',
	otros: 'otros'
};

for (const path in seedImagePaths) {
	const name = path.split('/').pop() ?? '';
	const prefix = name.split('-')[0];
	const slug = PREFIX_TO_SLUG[prefix];
	// La carpeta pública se sirve en la raíz: /images/seed/<nombre>.
	if (slug && name) IMAGES_BY_CATEGORY[slug].push(`/images/seed/${name}`);
}

// Centro del usuario mock (Madrid) para calcular distancias
export const userCoords = { lat: 40.4168, lng: -3.7038 };

// ──────────────────────────────────────────────────────────
// RNG determinista (misma semilla que el script)
// ──────────────────────────────────────────────────────────

const LISTING_TYPES: ListingType[] = ['vender', 'cambiar', 'regalar'];

let rngSeed = 1234;
function rand(): number {
	rngSeed = (rngSeed * 9301 + 49297) % 233280;
	return rngSeed / 233280;
}
function pick<T>(arr: T[]): T {
	return arr[Math.floor(rand() * arr.length)];
}
function fillTemplate(tpl: string): string {
	return tpl
		.replace('{plant}', pick(PLANT_TERMS))
		.replace('{color}', pick(COLORS))
		.replace('{size}', pick(Object.keys(SIZES)));
}
const PRICE_RANGES: Record<CategorySlug, number[]> = {
	semillas: [1.5, 4],
	esquejes: [3, 15],
	plantas: [3, 18],
	tiestos: [5, 15],
	accesorios: [2, 8],
	herramientas: [8, 20],
	libros: [5, 12],
	otros: [3, 18]
};

function priceFor(category: CategorySlug): number {
	const [min, max] = PRICE_RANGES[category];
	return Math.round((rand() * (max - min) + min) * 100) / 100;
}

const now = Date.now();
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;

// Distribuye los anuncios en distintos momentos para que los filtros de fecha tengan sentido.
function randomOffset(): number {
	const r = rand();
	if (r < 0.2) return Math.floor(rand() * 12 * HOUR); // últimas 12h
	if (r < 0.5) return Math.floor(rand() * 6 * DAY) + 12 * HOUR; // 12h - 6d
	if (r < 0.8) return Math.floor(rand() * 3 * WEEK) + 6 * DAY; // 6d - 27d
	return Math.floor(rand() * 2 * MONTH) + 27 * DAY; // 27d - 87d
}

// ──────────────────────────────────────────────────────────
// Generación
// ──────────────────────────────────────────────────────────

function buildListings(): Listing[] {
	const listings: Listing[] = [];
	let id = 0;

	for (const user of USERS) {
		const numListings = Math.floor(rand() * (10 - 5 + 1)) + 5; // 5-10 por usuario

		for (let i = 0; i < numListings; i++) {
			const category = pick(CATEGORIES);
			const tpl = pick(LISTING_TEMPLATES[category.slug]);
			const title = fillTemplate(tpl);
			const location = LOCATIONS.find((l) => l.label === user.city) ?? pick(LOCATIONS);

			// 3-5 imágenes desde el pool de la categoría (puede repetir si hay pocas).
			const pool = IMAGES_BY_CATEGORY[category.slug].length
				? IMAGES_BY_CATEGORY[category.slug]
				: IMAGES_BY_CATEGORY.plantas;
			const count = Math.min(pool.length, 3 + Math.floor(rand() * 3));
			const images = Array.from({ length: count }, () => pick(pool));

			const type = pick(LISTING_TYPES);

			// Pequeña variación determinista para que los markers del mapa no se
			// solapen en el punto exacto del barrio.
			const coordsJitter = 0.012;
			const coordinates = {
				lat: location.lat + (rand() - 0.5) * coordsJitter,
				lng: location.lng + (rand() - 0.5) * coordsJitter
			};

			listings.push({
				id: `listing-${++id}`,
				title,
				price: priceFor(category.slug),
				category: category.name,
				categorySlug: category.slug,
				location: location.label,
				seller: user.full_name,
				sellerInfo: {
					username: user.username,
					full_name: user.full_name,
					bio: user.bio,
					city: user.city,
					email: mockEmailFor(user.username)
				},
				images,
				type,
				coordinates,
				datePosted: new Date(now - randomOffset()),
				description: describe(category, title)
			});
		}
	}

	return listings;
}

export const seedListings: Listing[] = buildListings();

// ──────────────────────────────────────────────────────────
// Lookup para el detalle del anuncio
// ──────────────────────────────────────────────────────────

export function getListingById(id: string): Listing | undefined {
	return seedListings.find((l) => l.id === id);
}
