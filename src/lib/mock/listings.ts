// API de datos del wireframe P2P.
//
// Este módulo es la única vía por la que las páginas consumen listings mock.
// Los datos "realistas" viven en seed.ts (reutiliza la data compartida del seed
// y sirve las imágenes localmente desde /images/seed/). Este archivo mantiene la
// firma consumida por filtros, mapa, scroll y detalle.

export {
	seedListings,
	getListingById,
	userCoords,
	type Listing,
	type ListingType,
	type SellerInfo
} from './seed';
export { seedListings as mockListings } from './seed';
export { type Listing as ClientListing } from './seed';
import type { ListingType } from './seed';

export const categories = [
	'Todas las categorías',
	'Semillas',
	'Esquejes',
	'Plantas',
	'Tiestos',
	'Accesorios',
	'Herramientas',
	'Libros y guías',
	'Otros'
];

export const listingTypes: ListingType[] = ['vender', 'cambiar', 'regalar'];

export const publishedOptions = [
	{ value: 'hoy', label: 'Hoy' },
	{ value: 'semana', label: 'Última semana' },
	{ value: 'mes', label: 'Último mes' },
	{ value: 'cualquiera', label: 'Cualquier fecha' }
] as const;

export type PublishedOption = (typeof publishedOptions)[number]['value'];

export const sortOptions = [
	{ value: 'distancia', label: 'Distancia' },
	{ value: 'relevancia', label: 'Relevancia' },
	{ value: 'novedad', label: 'Novedad' },
	{ value: 'precio-desc', label: 'Precio (mayor a menor)' },
	{ value: 'precio-asc', label: 'Precio (menor a mayor)' }
] as const;

export type SortOption = (typeof sortOptions)[number]['value'];

export const PRICE_MIN = 0;
export const PRICE_MAX = 100;
export const RADIO_MIN = 1;
export const RADIO_MAX = 50;
