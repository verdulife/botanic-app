// Geometría de anuncios: el origen por defecto y la distancia entre dos puntos.
//
// Vive fuera de ./filters.ts porque el mapa también necesita el origen: la vista
// inicial y el orden por distancia tienen que coincidir.

import type { Coordinates } from './types';

// Madrid, Centro. Es el origen mientras no haya geolocalización del visitante:
// sin sesión no hay posición guardada y el mapa necesita un centro de partida.
export const DEFAULT_ORIGIN: Coordinates = { lat: 40.4168, lng: -3.7038 };

const EARTH_RADIUS_KM = 6371;

/** Distancia en kilómetros entre dos puntos (haversine). */
export function distanceKm(from: Coordinates, to: Coordinates): number {
	const toRad = (deg: number) => (deg * Math.PI) / 180;
	const dLat = toRad(to.lat - from.lat);
	const dLng = toRad(to.lng - from.lng);
	const lat1 = toRad(from.lat);
	const lat2 = toRad(to.lat);
	const h =
		Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
	return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}
