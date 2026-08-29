// Deseos mock para el wireframe de la webapp.
// Mismo espíritu que listings.ts: el módulo es la única vía por la que las
// páginas consumen deseos simulados mientras no exista el schema real.

import type { LocationScope } from './locations';

export type WishStatus = 'activo' | 'pausado';

export function wishPriceLabel(w: Wish): string {
	if (w.priceMin !== null && w.priceMax !== null) return `${w.priceMin}–${w.priceMax} €`;
	if (w.priceMax !== null) return `Hasta ${w.priceMax} €`;
	if (w.priceMin !== null) return `Desde ${w.priceMin} €`;
	return 'Precio libre';
}

export type Wish = {
	id: string;
	keywords: string;
	category: string;
	priceMin: number | null;
	priceMax: number | null;
	location: string;
	locationScope?: LocationScope;
	status: WishStatus;
	alert: boolean;
	matches: number;
};

export const mockWishes: Wish[] = [
	{
		id: 'wish-1',
		keywords: 'Monstera deliciosa',
		category: 'Plantas',
		priceMin: null,
		priceMax: 25,
		location: 'Madrid, Centro',
		status: 'activo',
		alert: true,
		matches: 3
	},
	{
		id: 'wish-2',
		keywords: 'Esquejes de pothos',
		category: 'Esquejes',
		priceMin: 0,
		priceMax: null,
		location: 'Barcelona, Gràcia',
		status: 'activo',
		alert: true,
		matches: 5
	},
	{
		id: 'wish-3',
		keywords: 'Semillas de tomates cherry',
		category: 'Semillas',
		priceMin: null,
		priceMax: 8,
		location: 'Valencia, Ruzafa',
		status: 'pausado',
		alert: false,
		matches: 1
	},
	{
		id: 'wish-4',
		keywords: 'Tiestos de cerámica (15–20 cm)',
		category: 'Tiestos',
		priceMin: 0,
		priceMax: 12,
		location: 'Sevilla, Triana',
		status: 'activo',
		alert: false,
		matches: 2
	}
];