/**
 * URL del anuncio, al estilo Wallapop: texto legible más el número público.
 *
 *   /app/anuncio/monstera-deliciosa-enorme-1234
 *
 * El slug es decorativo: solo se deriva del título para que el enlace se lea y se
 * comparta bien. Lo que identifica el anuncio es el número final (`public_id`,
 * entero indexado), así que cambiar el título no rompe ningún enlace.
 */

const MAX_SLUG_LENGTH = 60;
const FALLBACK_SLUG = 'anuncio';

/** Convierte un título en un slug: minúsculas, sin acentos y con guiones. */
export function slugify(title: string): string {
	const slug = title
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, MAX_SLUG_LENGTH)
		.replace(/-+$/g, '');
	return slug || FALLBACK_SLUG;
}

/** Ruta canónica del anuncio. */
export function listingPath(title: string, publicId: number): string {
	return `/app/anuncio/${slugify(title)}-${publicId}`;
}

export type ListingRef = { publicId: number; slug: string };

/**
 * Lee el parámetro de la ruta. Acepta `slug-1234` y `1234`.
 *
 * Devuelve `null` si no termina en un número: es preferible un 404 a resolver un
 * anuncio con una URL inventada.
 */
export function parseListingRef(param: string): ListingRef | null {
	const trimmed = param.trim();
	if (!trimmed || trimmed.startsWith('-')) return null;
	const match = /^(.*?)-?(\d+)$/.exec(trimmed);
	if (!match) return null;
	const slug = match[1] ?? '';
	// El slug de la URL solo puede tener letras, números y guiones: así se
	// rechazan cosas como `+5` o `a/b-5` en vez de resolverlas por accidente.
	if (slug !== '' && !/^[a-z0-9-]+$/i.test(slug)) return null;
	const publicId = Number(match[2]);
	if (!Number.isSafeInteger(publicId) || publicId <= 0) return null;
	return { publicId, slug };
}

/** `true` cuando el slug de la URL ya no coincide con el título actual. */
export function slugIsStale(ref: ListingRef, title: string): boolean {
	return ref.slug !== '' && ref.slug !== slugify(title);
}
