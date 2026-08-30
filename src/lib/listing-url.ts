// Utilidades para las URLs del detalle de anuncio en formato Wallapop:
// `/app/anuncio/{slug-del-titulo}-{token}`. El token (10 chars, sin guiones) es
// el id real del anuncio; al estar libre de guiones se extrae como el segmento
// tras el último '-', sin ambigüedad con el slug.

const TOKEN_CHARS = '0123456789abcdefghijklmnopqrstuvwxyz';

export function slugify(title: string): string {
	return title
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 60)
		.replace(/-+$/g, '');
}

// Token determinista para el seed (misma apariencia en SSR y CSR). No toca el
// RNG compartido del generador de listings.
export function listingToken(index: number): string {
	let x = (index * 2654435761 + 123456789) % 2147483647;
	let s = '';
	for (let i = 0; i < 10; i++) {
		x = (x * 48271) % 2147483647;
		s += TOKEN_CHARS[x % 36];
	}
	return s;
}

// Token aleatorio para anuncios publicados por el usuario.
export function randomListingToken(): string {
	const arr = new Uint32Array(10);
	crypto.getRandomValues(arr);
	let s = '';
	for (const v of arr) s += TOKEN_CHARS[v % 36];
	return s;
}

export function listingHref(listing: { id: string; title: string }): string {
	const slug = slugify(listing.title) || 'anuncio';
	return `/app/anuncio/${slug}-${listing.id}`;
}

export function parseAnuncioParam(param: string): { id: string; slug: string } {
	const lastDash = param.lastIndexOf('-');
	if (lastDash <= 0) return { id: '', slug: param };
	return { id: param.slice(lastDash + 1), slug: param.slice(0, lastDash) };
}