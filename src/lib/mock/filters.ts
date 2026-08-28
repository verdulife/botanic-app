import {
	PRICE_MAX,
	PRICE_MIN,
	RADIO_MAX,
	type Listing,
	type ListingType,
	type PublishedOption,
	type SortOption,
	userCoords
} from "./listings";

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
	termino: "",
	categoria: "Todas las categorías",
	ubicacion: "",
	publicado: "cualquiera",
	radio: 10,
	precioMin: PRICE_MIN,
	precioMax: PRICE_MAX,
	tipo: [],
	sort: "novedad"
};

function haversineKm(
	a: { lat: number; lng: number },
	b: { lat: number; lng: number }
): number {
	const toRad = (deg: number) => (deg * Math.PI) / 180;
	const R = 6371; // km
	const dLat = toRad(b.lat - a.lat);
	const dLng = toRad(b.lng - a.lng);
	const lat1 = toRad(a.lat);
	const lat2 = toRad(b.lat);
	const h =
		Math.sin(dLat / 2) ** 2 +
		Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
	return 2 * R * Math.asin(Math.sqrt(h));
}

function matchesCategory(listing: Listing, categoria: string): boolean {
	return categoria === "Todas las categorías" || listing.category === categoria;
}

function matchesLocation(listing: Listing, ubicacion: string): boolean {
	if (!ubicacion.trim()) return true;
	const q = ubicacion.toLowerCase();
	return listing.location.toLowerCase().includes(q);
}

function matchesPublished(
	listing: Listing,
	publicado: PublishedOption,
	now: number
): boolean {
	if (publicado === "cualquiera") return true;
	const age = now - listing.datePosted.getTime();
	const HOUR = 60 * 60 * 1000;
	const DAY = 24 * HOUR;
	switch (publicado) {
		case "hoy":
			return age < 24 * HOUR;
		case "semana":
			return age < 7 * DAY;
		case "mes":
			return age < 30 * DAY;
	}
}

function matchesPrice(listing: Listing, min: number, max: number): boolean {
	return listing.price >= min && listing.price <= max;
}

function matchesType(listing: Listing, tipos: ListingType[]): boolean {
	if (tipos.length === 0) return true;
	return tipos.includes(listing.type);
}

function matchesTerm(listing: Listing, termino: string): boolean {
	const q = termino.trim().toLowerCase();
	if (!q) return true;
	return (
		listing.title.toLowerCase().includes(q) ||
		listing.location.toLowerCase().includes(q) ||
		listing.category.toLowerCase().includes(q)
	);
}

export function filterListings(listings: Listing[], filters: Filters): Listing[] {
	const now = Date.now();
	return listings.filter(
		(l) =>
			matchesTerm(l, filters.termino) &&
			matchesCategory(l, filters.categoria) &&
			matchesLocation(l, filters.ubicacion) &&
			matchesPublished(l, filters.publicado, now) &&
			matchesPrice(l, filters.precioMin, filters.precioMax) &&
			matchesType(l, filters.tipo)
	);
}

export function sortListings(
	listings: Listing[],
	sort: SortOption,
	origin = userCoords
): Listing[] {
	const arr = [...listings];
	switch (sort) {
		case "novedad":
			return arr.sort(
				(a, b) => b.datePosted.getTime() - a.datePosted.getTime()
			);
		case "precio-asc":
			return arr.sort((a, b) => a.price - b.price);
		case "precio-desc":
			return arr.sort((a, b) => b.price - a.price);
		case "distancia":
			return arr.sort(
				(a, b) =>
					haversineKm(origin, a.coordinates) -
					haversineKm(origin, b.coordinates)
			);
		case "relevancia":
			// Sin lógica de relevancia real en el wireframe: orden original
			return arr;
	}
}

export function applyFiltersAndSort(
	listings: Listing[],
	filters: Filters
): Listing[] {
	return sortListings(filterListings(listings, filters), filters.sort);
}
