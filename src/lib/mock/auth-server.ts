// Autenticación mock (server-only) para la fase de wireframe/UI.
// Simula sesión, registro y login sin depender de Supabase. El estado se
// persiste en `.mock-auth/users.json` (gitignored) para sobrevivir reinicios.
//
// Los usuarios devueltos por `getSessionData` son estructuralmente compatibles
// con los tipos de Supabase (`User`/`Session`), así que los consumidores de
// `page.data.user` / `page.data.profile` no cambian.

import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Cookies } from '@sveltejs/kit';
import type { Session, User } from '@supabase/supabase-js';
import type { Database } from '$lib/supabase/types';
import { USERS, mockEmailFor } from '$lib/mock/seed-data';

export const MOCK_SESSION_COOKIE = 'botanic_mock_session';
export const MOCK_SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 días
export const MOCK_DEMO_PASSWORD = 'botanic123';

export const DEMO_ACCOUNT = {
	email: mockEmailFor(USERS[0].username), // ana-mock@botanic.test
	password: MOCK_DEMO_PASSWORD
};

type MockProfile = Database['public']['Tables']['profiles']['Row'];

type StoredUser = {
	id: string;
	email: string;
	passwordHash: string;
	email_confirmed_at: string | null;
	profile: MockProfile;
};

const STORE_DIR = join(process.cwd(), '.mock-auth');
const STORE_FILE = join(STORE_DIR, 'users.json');

let cache: StoredUser[] | null = null;

function hashPassword(password: string): string {
	const salt = randomBytes(8).toString('hex');
	const hash = createHash('sha256').update(`${salt}:${password}`).digest('hex');
	return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
	const [salt, hash] = stored.split(':');
	if (!salt || !hash) return false;
	const candidate = createHash('sha256').update(`${salt}:${password}`).digest('hex');
	return candidate === hash;
}

function loadUsers(): StoredUser[] {
	if (cache) return cache;
	if (existsSync(STORE_FILE)) {
		try {
			const raw = readFileSync(STORE_FILE, 'utf8');
			cache = JSON.parse(raw) as StoredUser[];
		} catch {
			cache = [];
		}
	} else {
		cache = [];
	}
	if (cache.length === 0) {
		cache = seedUsers();
		saveUsers();
	}
	return cache;
}

function saveUsers(): void {
	if (!cache) return;
	mkdirSync(STORE_DIR, { recursive: true });
	writeFileSync(STORE_FILE, JSON.stringify(cache, null, 2), 'utf8');
}

function nowIso(): string {
	return new Date().toISOString();
}

function seedUsers(): StoredUser[] {
	const createdAt = nowIso();
	return USERS.map((u) => ({
		id: `user_${u.username}`,
		email: mockEmailFor(u.username),
		passwordHash: hashPassword(MOCK_DEMO_PASSWORD),
		email_confirmed_at: createdAt,
		profile: {
			id: `user_${u.username}`,
			username: u.username,
			full_name: u.full_name,
			bio: u.bio,
			avatar_url: null,
			location_label: u.city,
			lat: null,
			lng: null,
			created_at: createdAt,
			updated_at: createdAt
		}
	}));
}

function usernameFromEmail(email: string): string {
	const base = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_');
	let username = base.slice(0, 20);
	if (username.length < 3) username = username.padEnd(3, '_');
	if (username.length < 3 || !username) username = 'usuario';
	const users = loadUsers();
	let candidate = username;
	let n = 1;
	while (users.some((u) => u.profile.username === candidate)) {
		const suffix = String(n++);
		candidate = `${username.slice(0, 20 - suffix.length)}${suffix}`;
	}
	return candidate;
}

function findUserByEmail(email: string): StoredUser | null {
	const normalized = email.trim().toLowerCase();
	return loadUsers().find((u) => u.email === normalized) ?? null;
}

export function signIn(
	email: string,
	password: string
): { user: StoredUser } | { error: string } {
	const user = findUserByEmail(email);
	if (!user) {
		return { error: 'No existe una cuenta con ese email. Compruébalo o crea una cuenta.' };
	}
	if (!verifyPassword(password, user.passwordHash)) {
		return { error: 'La contraseña no es correcta. Inténtalo de nuevo.' };
	}
	return { user };
}

export function signUp(
	email: string,
	password: string
): { user: StoredUser } | { error: string } {
	const normalized = email.trim().toLowerCase();
	if (findUserByEmail(normalized)) {
		return { error: 'Ya existe una cuenta con ese email. Inicia sesión.' };
	}

	const now = nowIso();
	const user: StoredUser = {
		id: randomUUID(),
		email: normalized,
		passwordHash: hashPassword(password),
		email_confirmed_at: now, // auto-confirmado (no hay email en el mock)
		profile: {
			id: randomUUID(),
			username: usernameFromEmail(normalized),
			full_name: null,
			bio: null,
			avatar_url: null,
			location_label: null,
			lat: null,
			lng: null,
			created_at: now,
			updated_at: now
		}
	};

	loadUsers().push(user);
	saveUsers();
	return { user };
}

export function getUserById(id: string): StoredUser | null {
	return loadUsers().find((u) => u.id === id) ?? null;
}

export function getUserByEmail(email: string): StoredUser | null {
	return findUserByEmail(email);
}

export function usernameExists(username: string, excludeUserId?: string): boolean {
	return loadUsers().some((u) => u.id !== excludeUserId && u.profile.username === username);
}

export function getMockProfile(id: string): MockProfile | null {
	return getUserById(id)?.profile ?? null;
}

export function updateProfile(id: string, patch: Partial<MockProfile>): void {
	const user = getUserById(id);
	if (!user) return;
	user.profile = { ...user.profile, ...patch, updated_at: nowIso() };
	saveUsers();
}

export function setSessionCookie(cookies: Cookies, userId: string): void {
	cookies.set(MOCK_SESSION_COOKIE, userId, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: MOCK_SESSION_MAX_AGE
	});
}

export function clearSessionCookie(cookies: Cookies): void {
	cookies.delete(MOCK_SESSION_COOKIE, { path: '/' });
}

export function getSessionUser(cookies: Cookies): StoredUser | null {
	const id = cookies.get(MOCK_SESSION_COOKIE);
	if (!id) return null;
	return getUserById(id);
}

// Convierte un usuario del store a la forma esperada por `safeGetSession`,
// compatible con los tipos `Session` / `User` de Supabase.
export function getSessionData(
	user: StoredUser
): { session: Session; user: User } {
	const { profile, ...rest } = user;
	const supaUser = {
		id: rest.id,
		email: rest.email,
		email_confirmed_at: rest.email_confirmed_at,
		role: 'authenticated',
		aud: 'authenticated',
		app_metadata: {},
		user_metadata: {},
		created_at: profile.created_at,
		updated_at: profile.updated_at
	} as unknown as User;

	const session = {
		access_token: 'mock-access-token',
		refresh_token: 'mock-refresh-token',
		expires_in: MOCK_SESSION_MAX_AGE,
		expires_at: Math.floor(Date.now() / 1000) + MOCK_SESSION_MAX_AGE,
		token_type: 'bearer',
		user: supaUser
	} as unknown as Session;

	return { session, user: supaUser };
}