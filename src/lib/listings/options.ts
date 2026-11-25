// Vocabulario de la interfaz para filtrar y ordenar anuncios.
//
// Es enumeración de la UI, no dato: los valores de precio y radio son los topes
// de los deslizadores y las etiquetas se muestran tal cual.

import type { ListingType } from './types';

export const categories = [
	'Todas las categorías',
	'Semillas',
	'Esquejes',
	'Plantas',
	'Bulbos',
	'Tiestos',
	'Accesorios',
	'Herramientas',
	'Otros'
];

export const listingTypes: ListingType[] = ['vender', 'cambiar', 'regalar'];

// Tamaños de planta que ofrece el formulario. La base guarda el texto tal cual,
// así que el conjunto vive aquí y lo validan tanto la vista como la escritura.
export const listingSizes = ['Pequeña', 'Mediana', 'Grande'] as const;

export type ListingSize = (typeof listingSizes)[number];

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
