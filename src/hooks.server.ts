import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const APP_PREFIX = '/app';
const REALM = 'Botanic';
const APP_PASSWORD = env.APP_PASSWORD ?? '';

function unauthorized(): Response {
	return new Response('Acceso restringido', {
		status: 401,
		headers: { 'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"` }
	});
}

function checkBasicAuth(header: string | null, expected: string): boolean {
	if (!header || !header.startsWith('Basic ')) return false;
	try {
		const [, b64] = header.split(' ');
		const decoded = Buffer.from(b64, 'base64').toString('utf8');
		const sep = decoded.indexOf(':');
		if (sep < 0) return false;
		const pass = decoded.slice(sep + 1);
		return pass === expected;
	} catch {
		return false;
	}
}

export const handle: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;

	if (!pathname.startsWith(APP_PREFIX)) {
		return resolve(event);
	}

	event.setHeaders({ 'X-Robots-Tag': 'noindex, nofollow' });

	if (!APP_PASSWORD) {
		throw redirect(307, '/');
	}

	if (!checkBasicAuth(event.request.headers.get('authorization'), APP_PASSWORD)) {
		return unauthorized();
	}

	return resolve(event);
};
