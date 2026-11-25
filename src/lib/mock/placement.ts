/**
 * Reparto geográfico de los anuncios del seed.
 *
 * El seed antiguo colocaba todos los anuncios de un barrio en el centroide
 * exacto de `LOCATIONS`, así que el mapa enseñaba N marcadores en el mismo
 * píxel. Un jitter aleatorio tampoco sirve: reparte mal y agrupa por azar.
 *
 * Aquí se sortean posiciones con dos reglas a la vez:
 *
 * - **Suelo duro** (`floorMeters`): dos anuncios nunca quedan más cerca que
 *   esto, para que a zoom de calle se distingan.
 * - **Separación típica** (`typicalMeters`): por debajo de esta distancia la
 *   posición solo se acepta con probabilidad `d / typical`, así que lo normal
 *   es que queden separados, pero aparecen parejas y tríos cerca sin que el
 *   mapa parezca una cuadrícula.
 *
 * Todo es determinista: recibe el generador por parámetro y nunca llama a
 * `Math.random`, para que `seed` (preview) y `seed:apply` generen lo mismo.
 */

export type GeoPoint = { lat: number; lng: number };

export type PlacementOptions = {
	/** Radio en metros dentro del cual se reparten las posiciones. */
	radiusMeters?: number;
	/** Distancia mínima garantizada entre dos posiciones. */
	floorMeters?: number;
	/** Distancia a partir de la cual siempre se acepta una posición. */
	typicalMeters?: number;
	/** Intentos orgánicos por posición antes de relajar a solo el suelo. */
	attempts?: number;
};

const DEFAULTS: Required<PlacementOptions> = {
	radiusMeters: 1200,
	floorMeters: 50,
	typicalMeters: 500,
	attempts: 60
};

const METRES_PER_DEGREE_LAT = 111_320;
/** Ángulo áureo: separa bien los puntos del respaldo sin dibujar una rejilla. */
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/** Distancia en metros entre dos coordenadas (haversine). */
export function distanceMeters(a: GeoPoint, b: GeoPoint): number {
	const rad = Math.PI / 180;
	const dLat = (b.lat - a.lat) * rad;
	const dLng = (b.lng - a.lng) * rad;
	const lat1 = a.lat * rad;
	const lat2 = b.lat * rad;
	const h =
		Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
	return 2 * 6_371_000 * Math.asin(Math.min(1, Math.sqrt(h)));
}

function metresPerDegreeLng(lat: number): number {
	return METRES_PER_DEGREE_LAT * Math.cos((lat * Math.PI) / 180);
}

function offsetPoint(centre: GeoPoint, metres: number, angle: number): GeoPoint {
	const north = metres * Math.cos(angle);
	const east = metres * Math.sin(angle);
	return {
		lat: centre.lat + north / METRES_PER_DEGREE_LAT,
		lng: centre.lng + east / metresPerDegreeLng(centre.lat)
	};
}

function nearestDistance(point: GeoPoint, placed: GeoPoint[]): number {
	let nearest = Infinity;
	for (const other of placed) {
		const d = distanceMeters(point, other);
		if (d < nearest) nearest = d;
	}
	return nearest;
}

/**
 * Reparte `count` posiciones alrededor de `centre` sin amontonarlas.
 *
 * `rand` debe ser el generador determinista del seed: se consume en un orden
 * fijo, así que dos ejecuciones con el mismo generador dan el mismo resultado.
 *
 * `existing` permite repartir de forma incremental: las posiciones ya ocupadas
 * cuentan para el suelo y para la separación típica, y solo se devuelven las
 * nuevas.
 */
export function placeAround(
	centre: GeoPoint,
	count: number,
	rand: () => number,
	options: PlacementOptions = {},
	existing: GeoPoint[] = []
): GeoPoint[] {
	const { radiusMeters, floorMeters, typicalMeters, attempts } = { ...DEFAULTS, ...options };
	const taken = [...existing];
	const placed: GeoPoint[] = [];

	const sample = (): GeoPoint => {
		// sqrt reparte uniformemente por área, no por radio: si no, se acumula
		// todo en el centro.
		const distance = radiusMeters * Math.sqrt(rand());
		const angle = rand() * Math.PI * 2;
		return offsetPoint(centre, distance, angle);
	};

	for (let i = 0; i < count; i++) {
		let accepted: GeoPoint | null = null;

		// Fase 1: reparto orgánico. Cerca del suelo casi nunca se acepta; al
		// acercarse a `typicalMeters` se acepta cada vez más.
		for (let attempt = 0; attempt < attempts && !accepted; attempt++) {
			const candidate = sample();
			const nearest = nearestDistance(candidate, taken);
			if (nearest < floorMeters) continue;
			if (nearest < typicalMeters && rand() >= nearest / typicalMeters) continue;
			accepted = candidate;
		}

		// Fase 2: solo el suelo duro. Si el azar no encontró hueco, se relaja la
		// separación típica, nunca la mínima.
		if (!accepted) {
			for (let attempt = 0; attempt < attempts * 4 && !accepted; attempt++) {
				const candidate = sample();
				if (nearestDistance(candidate, taken) >= floorMeters) accepted = candidate;
			}
		}

		// Fase 3: respaldo determinista en espiral. Garantiza el suelo aunque el
		// barrio esté saturado.
		if (!accepted) {
			for (let ring = 1; ring <= 64 && !accepted; ring++) {
				const radius = Math.min(radiusMeters * 1.5, floorMeters * ring * 1.5);
				for (let slot = 0; slot < 8; slot++) {
					const candidate = offsetPoint(centre, radius, GOLDEN_ANGLE * (ring * 8 + slot));
					if (nearestDistance(candidate, taken) >= floorMeters) {
						accepted = candidate;
						break;
					}
				}
			}
		}

		// Fase 4: último recurso. Solo se llega aquí si `count` es absurdo para el
		// área pedida; se acepta la muestra para no devolver menos posiciones de
		// las pedidas.
		const point = accepted ?? sample();
		placed.push(point);
		taken.push(point);
	}

	return placed;
}

/**
 * Busca un hueco libre alrededor de `centre` para un anuncio suelto, contando
 * con las posiciones ya ocupadas.
 */
export function placeOne(
	centre: GeoPoint,
	taken: GeoPoint[],
	rand: () => number,
	options: PlacementOptions = {}
): GeoPoint {
	return placeAround(centre, 1, rand, options, taken)[0]!;
}
