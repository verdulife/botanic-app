import { redirect } from '@sveltejs/kit';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD = 8;
export const MAX_PASSWORD = 72;

export function validateEmail(email: string): string | null {
	const trimmed = email.trim().toLowerCase();
	if (!trimmed) return 'Introduce tu email.';
	if (!EMAIL_RE.test(trimmed)) return 'Email inválido.';
	if (trimmed.length > 320) return 'Email demasiado largo.';
	return null;
}

export function validatePassword(password: string): string | null {
	if (!password) return 'Introduce una contraseña.';
	if (password.length < MIN_PASSWORD)
		return `La contraseña debe tener al menos ${MIN_PASSWORD} caracteres.`;
	if (password.length > MAX_PASSWORD)
		return `La contraseña debe tener máximo ${MAX_PASSWORD} caracteres.`;
	return null;
}

export function safeNextPath(raw: string | null | undefined, fallback = '/app'): string {
	if (!raw) return fallback;
	if (!raw.startsWith('/')) return fallback;
	if (raw.startsWith('//') || raw.startsWith('/\\')) return fallback;
	return raw;
}

export function redirectToNext(event: { url: URL }, fallback = '/app'): never {
	const next = safeNextPath(event.url.searchParams.get('next'), fallback);
	throw redirect(303, next);
}

export function field(formData: FormData, key: string): string {
	return String(formData.get(key) ?? '').trim();
}