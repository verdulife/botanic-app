// Deseos de seed por vendedor, para el bloque "Quiere cambiar por" del detalle
// de anuncios de tipo cambio. Solo algunos vendedores tienen deseos (el resto
// no → se ven ambos casos). No confundir con `wishes.ts` (los del usuario
// autenticado).

import type { Wish } from './wishes';

export const sellerWishesByUsername: Record<string, Wish[]> = {
	mock_ana: [
		{
			id: 'seller-wish-ana-1',
			keywords: 'Monstera deliciosa',
			category: 'Plantas',
			priceMin: null,
			priceMax: 25,
			location: 'Madrid, Malasaña',
			status: 'activo',
			alert: true,
			matches: 3
		},
		{
			id: 'seller-wish-ana-2',
			keywords: 'Calathea orbifolia',
			category: 'Plantas',
			priceMin: null,
			priceMax: 20,
			location: 'Madrid, Malasaña',
			status: 'activo',
			alert: true,
			matches: 1
		},
		{
			id: 'seller-wish-ana-3',
			keywords: 'Tiestos de cerámica (15–20 cm)',
			category: 'Tiestos',
			priceMin: null,
			priceMax: 12,
			location: 'Madrid, Malasaña',
			status: 'pausado',
			alert: false,
			matches: 2
		}
	],
	mock_luis: [
		{
			id: 'seller-wish-luis-1',
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
			id: 'seller-wish-luis-2',
			keywords: 'Suculentas Echeveria',
			category: 'Plantas',
			priceMin: null,
			priceMax: 10,
			location: 'Barcelona, Gràcia',
			status: 'activo',
			alert: false,
			matches: 2
		}
	],
	mock_maria: [
		{
			id: 'seller-wish-maria-1',
			keywords: 'Semillas de tomates cherry',
			category: 'Semillas',
			priceMin: null,
			priceMax: 5,
			location: 'Valencia, Ruzafa',
			status: 'activo',
			alert: true,
			matches: 4
		},
		{
			id: 'seller-wish-maria-2',
			keywords: 'Hierbas aromáticas',
			category: 'Semillas',
			priceMin: null,
			priceMax: 8,
			location: 'Valencia, Ruzafa',
			status: 'activo',
			alert: true,
			matches: 3
		}
	]
};