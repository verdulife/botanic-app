// Identificación de especie vía Pl@ntNet. La clave vive solo aquí (server);
// el cliente envía la foto de portada como data-uri jpeg (convertida en canvas,
// Pl@ntNet rechaza webp) y recibe candidatas normalizadas.

import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';
import type { IdentifyResult } from '$lib/identify-plant';

const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB

type PlntNetSpecies = {
	scientificNameWithoutAuthor?: string;
	genus?: { scientificNameWithoutAuthor?: string };
	family?: { scientificNameWithoutAuthor?: string };
	commonNames?: string[];
};

type PlntNetResult = { score?: number; species?: PlntNetSpecies };

export const POST: RequestHandler = async ({ request }) => {
	const apiKey = env.PLANTNET_API_KEY?.trim();
	if (!apiKey) {
		return json({ error: 'PLANTNET_API_KEY no configurada' }, { status: 500 });
	}

	let image: unknown;
	try {
		const body = (await request.json()) as { image?: unknown };
		image = body.image;
	} catch {
		return json({ error: 'Cuerpo inválido' }, { status: 400 });
	}

	if (typeof image !== 'string' || !image.startsWith('data:image/')) {
		return json({ error: 'Imagen inválida' }, { status: 400 });
	}

	const comma = image.indexOf(',');
	const base64 = comma >= 0 ? image.slice(comma + 1) : image;
	let bytes: Buffer;
	try {
		bytes = Buffer.from(base64, 'base64');
	} catch {
		return json({ error: 'Imagen inválida' }, { status: 400 });
	}
	if (bytes.length === 0 || bytes.length > MAX_IMAGE_BYTES) {
		return json({ error: 'Imagen demasiado grande' }, { status: 400 });
	}

	const form = new FormData();
	form.append('organs', 'leaf');
	form.append('images', new Blob([new Uint8Array(bytes)], { type: 'image/jpeg' }), 'plant.jpg');

	const url = `https://my-api.plantnet.org/v2/identify/all?lang=es&api-key=${encodeURIComponent(apiKey)}`;

	let res: Response;
	try {
		res = await fetch(url, { method: 'POST', body: form });
	} catch (err) {
		console.error('[identify-plant] Pl@ntNet fetch error', err);
		return json({ error: 'No se pudo contactar con el identificador' }, { status: 502 });
	}

	const raw = (await res.json().catch(() => null)) as {
		results?: PlntNetResult[];
		remainingIdentificationRequests?: number;
	} | null;

	if (!res.ok || !raw) {
		console.error('[identify-plant] Pl@ntNet error', res.status, raw);
		return json({ error: 'La identificación falló' }, { status: 502 });
	}

	const results: IdentifyResult[] = (raw.results ?? [])
		.slice(0, 5)
		.map((r) => {
			const s = r.species;
			const common = s?.commonNames?.[0];
			return {
				name: (
					typeof common === 'string' && common.trim()
						? common
						: s?.scientificNameWithoutAuthor
				)
					?.trim()
					.slice(0, 120) ?? '',
				scientific: s?.scientificNameWithoutAuthor ?? '',
				genus: s?.genus?.scientificNameWithoutAuthor,
				family: s?.family?.scientificNameWithoutAuthor,
				confidence: typeof r?.score === 'number' ? r.score : 0
			};
		})
		.filter((r) => r.name && r.scientific);

	return json({
		results,
		remaining:
			typeof raw.remainingIdentificationRequests === 'number'
				? raw.remainingIdentificationRequests
				: null
	});
};