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
	// Dos formas canónicas y nada más: el número solo, o slug + guion + número.
	// Sin el guion obligatorio, `monstera1234` sería otra URL del mismo anuncio; y
	// con ceros a la izquierda, `0123` también. Una sola forma por anuncio.
	const match = /^(?:([a-z0-9]+(?:-[a-z0-9]+)*)-)?([1-9]\d*)$/i.exec(trimmed);
	if (!match) return null;
	const publicId = Number(match[2]);
	if (!Number.isSafeInteger(publicId)) return null;
	return { publicId, slug: match[1] ?? '' };
}

/** `true` cuando el slug de la URL ya no coincide con el título actual. */
export function slugIsStale(ref: ListingRef, title: string): boolean {
	return ref.slug !== '' && ref.slug !== slugify(title);
}
