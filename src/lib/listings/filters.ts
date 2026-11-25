// Filtrado y ordenación de anuncios sobre el modelo de vista de ./types.ts.
//
// Este módulo sustituye a `src/lib/mock/filters.ts` para las rutas que ya leen de
// la base. Los nombres de los campos de `Filters` se mantienen en español a
// propósito: son el vocabulario de la URL, compartido con ./options.ts y con
// `src/lib/mock/url-filters.ts` mientras el mock siga vivo (T12).

import { DEFAULT_ORIGIN, distanceKm } from './geo.ts';
import { PRICE_MAX, PRICE_MIN, type PublishedOption, type SortOption } from './options.ts';
import type { Coordinates, Listing, ListingType } from './types';

export type Filters = {
	termino: string;
	categoria: string;
	ubicacion: string;
	publicado: PublishedOption;
	radio: number;
	precioMin: number;
	precioMax: number;
	tipo: ListingType[];
	sort: SortOption;
};

export const defaultFilters: Filters = {
	termino: '',
	categoria: 'Todas las categorías',
	ubicacion: '',
	publicado: 'cualquiera',
	radio: 10,
	precioMin: PRICE_MIN,
	precioMax: PRICE_MAX,
	tipo: [],
	sort: 'novedad'
};

const ALL_CATEGORIES = 'Todas las categorías';
const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

function matchesTerm(listing: Listing, termino: string): boolean {
	const q = termino.trim().toLowerCase();
	if (!q) return true;
	return (
		listing.title.toLowerCase().includes(q) ||
		listing.location.toLowerCase().includes(q) ||
		listing.category.toLowerCase().includes(q)
	);
}

function matchesCategory(listing: Listing, categoria: string): boolean {
	return categoria === ALL_CATEGORIES || listing.category === categoria;
}

function matchesLocation(listing: Listing, ubicacion: string): boolean {
	if (!ubicacion.trim()) return true;
	return listing.location.toLowerCase().includes(ubicacion.toLowerCase());
}

function matchesPublished(listing: Listing, publicado: PublishedOption, now: number): boolean {
	if (publicado === 'cualquiera') return true;
	const age = now - listing.datePosted.getTime();
	switch (publicado) {
		case 'hoy':
			return age < DAY_MS;
		case 'semana':
			return age < 7 * DAY_MS;
		case 'mes':
			return age < 30 * DAY_MS;
	}
}

function matchesPrice(listing: Listing, min: number, max: number): boolean {
	return listing.price >= min && listing.price <= max;
}

function matchesType(listing: Listing, tipos: ListingType[]): boolean {
	if (tipos.length === 0) return true;
	// OR: el anuncio encaja si soporta cualquiera de los tipos filtrados.
	return tipos.some((tipo) => listing.type.includes(tipo));
}

export function filterListings(listings: Listing[], filters: Filters): Listing[] {
	const now = Date.now();
	return listings.filter(
		(listing) =>
			matchesTerm(listing, filters.termino) &&
			matchesCategory(listing, filters.categoria) &&
			matchesLocation(listing, filters.ubicacion) &&
			matchesPublished(listing, filters.publicado, now) &&
			matchesPrice(listing, filters.precioMin, filters.precioMax) &&
			matchesType(listing, filters.tipo)
	);
}

// Un anuncio sin posición no tiene distancia: va al final en vez de fingir un
// punto de partida.
function compareDistance(origin: Coordinates, a: Listing, b: Listing): number {
	if (!a.coordinates && !b.coordinates) return 0;
	if (!a.coordinates) return 1;
	if (!b.coordinates) return -1;
	return distanceKm(origin, a.coordinates) - distanceKm(origin, b.coordinates);
}

export function sortListings(
	listings: Listing[],
	sort: SortOption,
	origin: Coordinates = DEFAULT_ORIGIN
): Listing[] {
	const arr = [...listings];
	switch (sort) {
		case 'novedad':
			return arr.sort((a, b) => b.datePosted.getTime() - a.datePosted.getTime());
		case 'precio-asc':
			return arr.sort((a, b) => a.price - b.price);
		case 'precio-desc':
			return arr.sort((a, b) => b.price - a.price);
		case 'distancia':
			return arr.sort((a, b) => compareDistance(origin, a, b));
		case 'relevancia':
			// Sin lógica de relevancia real: orden original.
			return arr;
	}
}

export function applyFiltersAndSort(listings: Listing[], filters: Filters): Listing[] {
	return sortListings(filterListings(listings, filters), filters.sort);
}
