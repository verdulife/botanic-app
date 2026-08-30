// Sugiere una descripción de venta con un LLM de tier gratuito (coste 0).
// Proveedor: Groq si GROQ_API_KEY está configurada; si no, Gemini con
// GEMINI_API_KEY. La clave vive solo aquí (server). Recibe los datos del
// anuncio y devuelve una descripción breve en español, tono segunda mano.

import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

type Care = { watering: string; light: string; toxicity: string };

type SuggestBody = {
	species?: string;
	category?: string;
	size?: string;
	type?: string[];
	location?: string;
	price?: number | null;
	care?: Care | null;
};

const MAX_FIELD = 80;
const TYPE_LABELS: Record<string, string> = {
	vender: 'venta',
	cambiar: 'cambio',
	regalar: 'regalo'
};

function clamp(s: string | undefined, fallback: string): string {
	const v = (s ?? '').trim();
	return v ? v.slice(0, MAX_FIELD) : fallback;
}

function buildPrompt(b: SuggestBody): string {
	const lines: string[] = [];
	if (b.category) lines.push(`Categoría: ${clamp(b.category, '')}`);
	if (b.species) lines.push(`Especie: ${clamp(b.species, '')}`);
	if (b.size) lines.push(`Tamaño: ${clamp(b.size, '')}`);
	const typeLabel = (b.type ?? [])
		.map((t) => TYPE_LABELS[t] ?? t)
		.filter(Boolean)
		.join(' y ');
	if (typeLabel) lines.push(`Operación: ${typeLabel}`);
	if (b.price != null) lines.push(`Precio: ${b.price} €`);
	if (b.location) lines.push(`Ubicación: ${clamp(b.location, '')}`);
	if (b.care) {
		lines.push(
			`Cuidados: Riego ${b.care.watering.toLowerCase()}, luz ${b.care.light.toLowerCase()}${
				b.care.toxicity !== 'No tóxica' ? `, toxicidad: ${b.care.toxicity.toLowerCase()}` : ''
			}`
		);
	}

	const productData = lines.join('\n');

	const TEMPLATE: string[] = [
		'Genera un título y una descripción para un anuncio de un marketplace P2P de plantas entre personas amantes de las plantas.',
		'',
		'Usa los datos como fuente de verdad, pero redacta de forma natural y orgánica. No es necesario incluir todos los datos ni repetirlos literalmente. Selecciona la información que resulte más útil y conecta las ideas con naturalidad.',
		'',
		'* No inventes ni deduzcas información que no esté en los datos.',
		'* Mantén correctamente nombres, especies, variedades, medidas, cantidades y precios cuando corresponda.',
		'* Español natural de España.',
		'* Tono cercano, cálido y humano, como alguien que comparte o vende una planta a otra persona aficionada a las plantas.',
		'* Evita sonar como una tienda, un catálogo o una ficha técnica.',
		'* Evita enumerar datos cuando puedan integrarse naturalmente en una frase.',
		'* Título: claro, atractivo y descriptivo. Máximo 80 caracteres.',
		'* La ubicación puede mencionarse si aporta valor, pero no es obligatorio incluirla.',
		'* No es necesario utilizar todos los datos disponibles.',
		'* No uses emojis ni hashtags.',
		'* No uses lenguaje exagerado, frases genéricas ni afirmaciones no respaldadas por los datos.',
		'* No uses los caracteres "—" ni "–". Utiliza comas, puntos o conectores naturales.',
		'',
		'Datos del anuncio:',
		productData
	];

	return TEMPLATE.join('\n');
}

// Extrae { title, description } de la respuesta del LLM: intenta JSON primero y
// cae al formato de dos líneas "Título:…/Descripción:…". Nunca campos vacíos.
function parseSuggest(content: string, fallbackTitle: string): { title: string; description: string } {
	const cleaned = content.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
	try {
		const obj = JSON.parse(cleaned) as { title?: unknown; description?: unknown };
		if (obj && typeof obj.title === 'string' && typeof obj.description === 'string') {
			return {
				title: obj.title.trim().slice(0, 120),
				description: obj.description.trim().slice(0, 600)
			};
		}
	} catch {
		// sigue con el fallback de líneas
	}
	const lines = content.split('\n').map((s) => s.trim()).filter(Boolean);
	const ti = lines.findIndex((l) => /^t[íi]tulo\s*:/i.test(l));
	if (ti >= 0) {
		const t = lines[ti].replace(/^t[íi]tulo\s*:\s*/i, '').trim();
		const d = lines.slice(ti + 1).join(' ').replace(/^descripci[óo]n\s*:\s*/i, '').trim();
		if (t && d) return { title: t.slice(0, 120), description: d.slice(0, 600) };
	}
	return { title: fallbackTitle.slice(0, 120), description: content.trim().slice(0, 600) };
}

async function callGroq(prompt: string): Promise<string> {
	const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${env.GROQ_API_KEY}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			model: 'openai/gpt-oss-20b',
			temperature: 0.4,
			top_p: 1,
			reasoning_effort: 'low',
			max_completion_tokens: 300,
			stream: false,
			response_format: {
				type: 'json_schema',
				json_schema: {
					name: 'listing',
					strict: true,
					schema: {
						type: 'object',
						properties: {
							title: { type: 'string' },
							description: { type: 'string' }
						},
						required: ['title', 'description'],
						additionalProperties: false
					}
				}
			},
			messages: [{ role: 'user', content: prompt }]
		})
	});
	const data = (await res.json().catch(() => null)) as {
		error?: { message?: string };
		choices?: { message?: { content?: string } }[];
	};
	if (!res.ok) throw new Error(data?.error?.message ?? `Groq HTTP ${res.status}`);
	return data?.choices?.[0]?.message?.content?.trim() ?? '';
}

async function callGemini(prompt: string): Promise<string> {
	const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(env.GEMINI_API_KEY ?? '')}`;
	const res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			contents: [{ parts: [{ text: prompt }] }],
			generationConfig: { maxOutputTokens: 320, temperature: 0.7 }
		})
	});
	const data = (await res.json().catch(() => null)) as {
		error?: { message?: string };
		candidates?: { content?: { parts?: { text?: string }[] } }[];
	};
	if (!res.ok) throw new Error(data?.error?.message ?? `Gemini HTTP ${res.status}`);
	const parts = data?.candidates?.[0]?.content?.parts ?? [];
	return parts.map((p) => p.text ?? '').join('').trim();
}

export const POST: RequestHandler = async ({ request }) => {
	const groqKey = env.GROQ_API_KEY?.trim();
	const geminiKey = env.GEMINI_API_KEY?.trim();
	if (!groqKey && !geminiKey) {
		return json(
			{ error: 'No hay clave de IA configurada (GROQ_API_KEY o GEMINI_API_KEY)' },
			{ status: 503 }
		);
	}

	let body: SuggestBody;
	try {
		body = (await request.json()) as SuggestBody;
	} catch {
		return json({ error: 'Cuerpo inválido' }, { status: 400 });
	}

	if (!body || typeof body !== 'object') {
		return json({ error: 'Cuerpo inválido' }, { status: 400 });
	}

	const care = body.care && typeof body.care === 'object' ? body.care : null;
	const clean: SuggestBody = {
		species: typeof body.species === 'string' ? body.species : undefined,
		category: typeof body.category === 'string' ? body.category : undefined,
		size: typeof body.size === 'string' ? body.size : undefined,
		location: typeof body.location === 'string' ? body.location : undefined,
		type: Array.isArray(body.type)
			? body.type.filter((t): t is string => typeof t === 'string').slice(0, 3)
			: undefined,
		price: typeof body.price === 'number' && Number.isFinite(body.price) ? body.price : null,
		care
	};

	try {
		const fallbackTitle = clamp(clean.species, '') || clamp(clean.category, 'Planta');
		// gpt-oss puede devolver contenido vacío en respuestas cortas; reintentamos
		// una vez antes de rendirnos.
		let raw = '';
		for (let attempt = 0; attempt < 2 && !raw.trim(); attempt++) {
			raw = groqKey
				? await callGroq(buildPrompt(clean))
				: await callGemini(buildPrompt(clean));
		}
		const { title, description } = parseSuggest(raw, fallbackTitle);
		if (!description) {
			console.error('[suggest-description] respuesta vacía del LLM', JSON.stringify(raw));
			return json({ error: 'La IA no devolvió una descripción' }, { status: 502 });
		}
		return json({ title, description });
	} catch (err) {
		console.error('[suggest-description] error', err);
		return json(
			{ error: err instanceof Error ? err.message : 'La IA falló' },
			{ status: 502 }
		);
	}
};