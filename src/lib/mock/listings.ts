// API de datos del wireframe P2P.
//
// Este módulo es la única vía por la que las páginas consumen listings mock.
// Los datos "realistas" viven en seed.ts (reutiliza la data compartida del seed
// y sirve las imágenes localmente desde /images/seed/). Este archivo mantiene la
// firma consumida por filtros, mapa, scroll y detalle.

export {
	seedListings,
	getListingById,
	getListingsBySeller,
	userCoords,
	type Listing,
	type ListingType,
	type SellerInfo,
	type PlantSpecies
} from './seed';
export { seedListings as mockListings } from './seed';
export { type Listing as ClientListing } from './seed';
export { getPlantCare, getPlantCareForSpecies, type PlantCare } from './plant-care';
import { LOCATIONS } from './seed-data';
import { userCoords, type Listing } from './seed';
import type { ListingType } from './seed';

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

// ──────────────────────────────────────────────────────────
// Agregación de vendedores para el mapa
// ──────────────────────────────────────────────────────────

export type SellerMarker = {
	username: string;
	full_name: string;
	rating: number;
	reviewCount: number;
	count: number;
	lat: number;
	lng: number;
};

export type SellerChip = {
	lat: number;
	lng: number;
	count: number;
	members: SellerMarker[];
};

// Hash determinista estable por username: da la posición y el tint del avatar.
function hashSeed(s: string): number {
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return (h >>> 0) / 4294967296;
}

// Posición del vendedor en el mapa: su barrio base + un jitter determinista por
// username (±0.004°, ~400 m) para que vendedores del mismo barrio no se solapen.
export function sellerPosition(
	city: string,
	username: string
): { lat: number; lng: number } {
	const base = LOCATIONS.find((l) => l.label === city);
	const lat0 = base?.lat ?? userCoords.lat;
	const lng0 = base?.lng ?? userCoords.lng;
	const k = hashSeed(username);
	return {
		lat: lat0 + (k - 0.5) * 0.008,
		lng: lng0 + (((k * 1.618033988749895) % 1) - 0.5) * 0.008
	};
}

// Agrupa listings (ya filtrados) por vendedor. `count` respeta los filtros
// activos; la posición es siempre el barrio del vendedor, independiente de filtros.
export function aggregateSellers(listings: Listing[]): SellerMarker[] {
	const byUser = new Map<string, SellerMarker>();
	for (const l of listings) {
		const { username, full_name, rating, reviewCount, city } = l.sellerInfo;
		const existing = byUser.get(username);
		if (existing) {
			existing.count += 1;
		} else {
			const { lat, lng } = sellerPosition(city, username);
			byUser.set(username, {
				username,
				full_name,
				rating,
				reviewCount,
				count: 1,
				lat,
				lng
			});
		}
	}
	return [...byUser.values()];
}

// Topes de markers individuales y de chips por nivel de zoom.
export function mapCapsForZoom(zoom: number): {
	maxMarkers: number;
	maxChips: number;
} {
	if (zoom < 11) return { maxMarkers: 6, maxChips: 3 };
	if (zoom < 13) return { maxMarkers: 12, maxChips: 4 };
	if (zoom < 15) return { maxMarkers: 20, maxChips: 5 };
	return { maxMarkers: Number.POSITIVE_INFINITY, maxChips: 0 };
}

// Distribuye los vendedores ocultos (los peor valorados que no entran en el cap de
// markers) en chips por celda de una grid cuyo tamaño decrece con el zoom. Si la
// grid produce más chips que `maxChips`, fusiona los sobrantes en el chip vecino
// más cercano hasta cumplir el tope.
export function clusterSellers(
	sellers: SellerMarker[],
	zoom: number,
	maxMarkers: number,
	maxChips: number
): { markers: SellerMarker[]; chips: SellerChip[] } {
	const ranked = [...sellers].sort(
		(a, b) =>
			b.rating - a.rating ||
			b.reviewCount - a.reviewCount ||
			a.full_name.localeCompare(b.full_name)
	);

	const markers = ranked.slice(0, maxMarkers);
	const hidden = ranked.slice(maxMarkers);
	if (hidden.length === 0 || maxChips < 1) return { markers, chips: [] };

	// Celda de ~80 px: en un visor de 256*2^zoom px por 360° → grados por celda.
	const cellDeg = (80 * 360) / (256 * Math.pow(2, zoom));
	const buckets = new Map<string, SellerMarker[]>();
	for (const s of hidden) {
		const key = `${Math.floor(s.lat / cellDeg)}:${Math.floor(s.lng / cellDeg)}`;
		const arr = buckets.get(key);
		if (arr) arr.push(s);
		else buckets.set(key, [s]);
	}

	const chips: SellerChip[] = [...buckets.values()].map((members) => ({
		lat: centroid(members).lat,
		lng: centroid(members).lng,
		count: members.length,
		members
	}));

	// Cap a chips: conservamos los más poblados y fusionamos los sobrantes en el
	// chip sobreviviente más cercano (por centroide).
	while (chips.length > maxChips) {
		const survivors = chips
			.sort((a, b) => b.members.length - a.members.length)
			.slice(0, maxChips);
		const orphans = chips.slice(maxChips);
		for (const orphan of orphans) {
			let nearest = survivors[0];
			let best = Number.POSITIVE_INFINITY;
			for (const s of survivors) {
				const d = (s.lat - orphan.lat) ** 2 + (s.lng - orphan.lng) ** 2;
				if (d < best) {
					best = d;
					nearest = s;
				}
			}
			nearest.members.push(...orphan.members);
			nearest.lat = centroid(nearest.members).lat;
			nearest.lng = centroid(nearest.members).lng;
			nearest.count = nearest.members.length;
		}
		chips.length = 0;
		chips.push(...survivors);
	}

	return { markers, chips };
}

function centroid(sellers: SellerMarker[]): { lat: number; lng: number } {
	let lat = 0;
	let lng = 0;
	let w = 0;
	for (const s of sellers) {
		lat += s.lat * s.count;
		lng += s.lng * s.count;
		w += s.count;
	}
	return { lat: lat / w, lng: lng / w };
}

// ──────────────────────────────────────────────────────────
// Anti-apilado: colisión en espacio de píxel
// ──────────────────────────────────────────────────────────

export type PixelPoint = { x: number; y: number };

// Resuelve colisiones chip↔chip en píxeles: mientras exista un par más cercano
// que `minDistance` (entre centros), absorbe el chip de menos miembros en el de
// más y recomputa el centroide. Converge rápido (máx. 5 chips).
export function resolveChipCollisions(
	chips: SellerChip[],
	toPixel: (lat: number, lng: number) => PixelPoint,
	minDistance = 88
): SellerChip[] {
	if (chips.length < 2) return chips;
	const working = chips.map((c) => {
		const p = toPixel(c.lat, c.lng);
		return { chip: c, x: p.x, y: p.y };
	});

	while (working.length > 1) {
		let bestA = -1;
		let bestB = -1;
		let bestD2 = minDistance * minDistance;
		for (let i = 0; i < working.length; i++) {
			for (let j = i + 1; j < working.length; j++) {
				const dx = working[i].x - working[j].x;
				const dy = working[i].y - working[j].y;
				const d2 = dx * dx + dy * dy;
				if (d2 < bestD2) {
					bestD2 = d2;
					bestA = i;
					bestB = j;
				}
			}
		}
		if (bestA < 0) break;

		// Absorbe el de menos miembros en el de más; a igualdad, el primero.
		const [keep, drop] =
			working[bestA].chip.members.length >= working[bestB].chip.members.length
				? [bestA, bestB]
				: [bestB, bestA];
		working[keep].chip.members.push(...working[drop].chip.members);
		working[keep].chip.count = working[keep].chip.members.length;
		working[keep].chip.lat = centroid(working[keep].chip.members).lat;
		working[keep].chip.lng = centroid(working[keep].chip.members).lng;
		const p = toPixel(working[keep].chip.lat, working[keep].chip.lng);
		working[keep].x = p.x;
		working[keep].y = p.y;
		working.splice(drop, 1);
	}

	return working.map((w) => w.chip);
}

export type ChipNudge = {
	chip: SellerChip;
	offsetX: number;
	offsetY: number;
};

// Tamaños estimados (píxeles) de la pill del vendedor y del chip; tunables.
const CHIP_SIZE = { w: 96, h: 36 };
const SELLER_PILL_SIZE = { w: 190, h: 44 };
const NUDGE_GAP = 8;

// Aparta cada chip del rect de los markers de vendedor con el empuje mínimo por
// el eje de menor penetración (AABB). Determinista: solo depende de las posiciones.
export function nudgeChipsFromMarkers(
	chips: SellerChip[],
	markers: SellerMarker[],
	toPixel: (lat: number, lng: number) => PixelPoint
): ChipNudge[] {
	return chips.map((chip) => {
		const p = toPixel(chip.lat, chip.lng);
		const cx = p.x + CHIP_SIZE.w / 2;
		const cy = p.y + CHIP_SIZE.h / 2;
		let offsetX = 0;
		let offsetY = 0;
		for (const m of markers) {
			const mp = toPixel(m.lat, m.lng);
			const mx = mp.x + SELLER_PILL_SIZE.w / 2;
			const my = mp.y + SELLER_PILL_SIZE.h / 2;
			const hw = (CHIP_SIZE.w + SELLER_PILL_SIZE.w) / 2 + NUDGE_GAP;
			const hh = (CHIP_SIZE.h + SELLER_PILL_SIZE.h) / 2 + NUDGE_GAP;
			const dx = cx - mx;
			const dy = cy - my;
			if (Math.abs(dx) >= hw || Math.abs(dy) >= hh) continue;
			const penX = hw - Math.abs(dx);
			const penY = hh - Math.abs(dy);
			if (penX < penY) {
				offsetX += (dx >= 0 ? 1 : -1) * penX;
			} else {
				offsetY += (dy >= 0 ? 1 : -1) * penY;
			}
		}
		return {
			chip,
			offsetX: Math.round(offsetX),
			offsetY: Math.round(offsetY)
		};
	});
}
