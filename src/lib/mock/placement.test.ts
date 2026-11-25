import assert from 'node:assert/strict';
import { test } from 'node:test';
import { distanceMeters, placeAround, placeOne, type GeoPoint } from './placement.ts';

/** Mismo LCG que el seed: 9301/49297/233280. Determinista y reproducible. */
function seeded(seed = 1234) {
	let state = seed;
	return () => {
		state = (state * 9301 + 49297) % 233280;
		return state / 233280;
	};
}

const CENTRO_MADRID: GeoPoint = { lat: 40.4168, lng: -3.7038 };

function pairwise(points: GeoPoint[]): number[] {
	const distances: number[] = [];
	for (let i = 0; i < points.length; i++) {
		for (let j = i + 1; j < points.length; j++) {
			distances.push(distanceMeters(points[i]!, points[j]!));
		}
	}
	return distances;
}

function nearestDistances(points: GeoPoint[]): number[] {
	return points.map((point) => {
		const others = points.filter((other) => other !== point);
		return Math.min(...others.map((other) => distanceMeters(point, other)));
	});
}

test('nunca deja dos anuncios más cerca que el suelo duro', () => {
	const points = placeAround(CENTRO_MADRID, 20, seeded(), { floorMeters: 50 });
	const closest = Math.min(...pairwise(points));
	assert.ok(closest >= 50, `la pareja más cercana está a ${closest.toFixed(1)} m`);
});

test('el reparto es orgánico: hay parejas cerca y también huecos grandes', () => {
	const points = placeAround(CENTRO_MADRID, 20, seeded(), {
		floorMeters: 50,
		typicalMeters: 500
	});
	const distances = pairwise(points);

	// Algo de cercanía: sin esto el reparto sería una cuadrícula.
	const closest = Math.min(...distances);
	assert.ok(closest < 250, `no hay ninguna pareja cerca: la más próxima está a ${closest.toFixed(1)} m`);

	// Y algo de aire: el par más lejano supera el kilómetro.
	const farthest = Math.max(...distances);
	assert.ok(farthest > 1000, `el reparto es demasiado compacto: el par más lejano está a ${farthest.toFixed(1)} m`);

	// La distancia típica al vecino más próximo no se pega al suelo ni a la
	// separación típica: eso distingue un reparto orgánico de una rejilla.
	const nearest = nearestDistances(points).sort((a, b) => a - b);
	const median = nearest[Math.floor(nearest.length / 2)]!;
	assert.ok(median > 120, `mediana demasiado apretada: ${median.toFixed(1)} m`);
	assert.ok(median < 700, `mediana demasiado uniforme: ${median.toFixed(1)} m`);
});

test('ocupa el área: hay anuncios lejos del centro', () => {
	const points = placeAround(CENTRO_MADRID, 20, seeded(), { radiusMeters: 1200 });
	const far = points.filter((point) => distanceMeters(CENTRO_MADRID, point) > 900);
	assert.ok(far.length >= 3, `solo ${far.length} anuncios pasan de 900 m del centro`);
});

test('respeta el radio pedido', () => {
	const points = placeAround(CENTRO_MADRID, 30, seeded(), { radiusMeters: 800 });
	for (const point of points) {
		const d = distanceMeters(CENTRO_MADRID, point);
		// El respaldo en espiral puede salir un poco del radio, nunca al doble.
		assert.ok(d <= 1200, `un anuncio está a ${d.toFixed(0)} m con radio 800`);
	}
});

test('es determinista: mismo generador, mismas posiciones', () => {
	const a = placeAround(CENTRO_MADRID, 12, seeded(99));
	const b = placeAround(CENTRO_MADRID, 12, seeded(99));
	assert.deepEqual(a, b);
});

test('devuelve tantas posiciones como se piden', () => {
	assert.equal(placeAround(CENTRO_MADRID, 0, seeded()).length, 0);
	assert.equal(placeAround(CENTRO_MADRID, 1, seeded()).length, 1);
	assert.equal(placeAround(CENTRO_MADRID, 25, seeded()).length, 25);
});

test('placeOne respeta el suelo contra las posiciones ya ocupadas', () => {
	const taken = placeAround(CENTRO_MADRID, 10, seeded(), { floorMeters: 80 });
	const extra = placeOne(CENTRO_MADRID, taken, seeded(7), { floorMeters: 80 });
	for (const point of taken) {
		const d = distanceMeters(extra, point);
		assert.ok(d >= 80, `la posición nueva está a ${d.toFixed(1)} m de una ocupada`);
	}
});
