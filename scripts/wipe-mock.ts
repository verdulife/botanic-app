/**
 * Wipe mock data antes de pasar a producción.
 *
 * Borra:
 *  - Auth users cuyo email contiene "-mock@botanic.test" (cascade borra profiles)
 *  - Storage objects del bucket listing-images cuyos paths pertenecen a mock users
 *
 * Idempotente. Ejecutar con `bun run scripts/wipe-mock.ts [--dry-run]`.
 *
 * Requiere: SUPABASE_SERVICE_ROLE_KEY en .env.local.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRY_RUN = process.argv.includes('--dry-run');

if (!SUPABASE_URL || !SERVICE_ROLE) {
	console.error('Faltan PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local');
	process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
	auth: { autoRefreshToken: false, persistSession: false }
});

const MOCK_DOMAIN = 'botanic.test';

async function listMockUsers() {
	const all = [];
	let page = 1;
	while (true) {
		const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 100 });
		if (error) throw error;
		all.push(...data.users);
		if (data.users.length < 100) break;
		page++;
	}
	return all.filter((u) => u.email?.includes(MOCK_DOMAIN));
}

async function listStoragePaths(userIds) {
	const all = [];
	for (const uid of userIds) {
		const { data, error } = await supabase.storage
			.from('listing-images')
			.list(uid, { limit: 1000 });
		if (error) {
			console.warn(`  [warn] list(${uid}): ${error.message}`);
			continue;
		}
		for (const folder of data ?? []) {
			const { data: files, error: innerErr } = await supabase.storage
				.from('listing-images')
				.list(`${uid}/${folder.name}`, { limit: 1000 });
			if (innerErr) continue;
			for (const f of files ?? []) {
				all.push(`${uid}/${folder.name}/${f.name}`);
			}
		}
	}
	return all;
}

async function main() {
	const prefix = DRY_RUN ? '[DRY-RUN] ' : '';
	console.log(`${prefix}Buscando mock users…`);
	const mockUsers = await listMockUsers();

	if (mockUsers.length === 0) {
		console.log('No hay mock users. Nada que wipe.');
		return;
	}

	console.log(`${prefix}Encontrados ${mockUsers.length} mock users:`);
	for (const u of mockUsers) {
		console.log(`  · ${u.email} (${u.id})`);
	}

	const userIds = mockUsers.map((u) => u.id);

	console.log(`\n${prefix}Listando archivos en storage…`);
	const paths = await listStoragePaths(userIds);
	console.log(`${prefix}Encontrados ${paths.length} archivos en listing-images/`);

	if (DRY_RUN) {
		console.log(`\n[DRY-RUN] Esto es lo que se borraría. Añade --apply (o quita --dry-run) para ejecutar.`);
		return;
	}

	if (paths.length > 0) {
		const { error: storageErr } = await supabase.storage
			.from('listing-images')
			.remove(paths);
		if (storageErr) {
			console.error(`Error borrando storage: ${storageErr.message}`);
		} else {
			console.log(`✓ Storage: ${paths.length} archivos borrados`);
		}
	}

	const { error: usersErr, data: deletedData } = await supabase.auth.admin
		.deleteUsers(userIds);
	if (usersErr) {
		console.error(`Error borrando users: ${usersErr.message}`);
		process.exit(1);
	}
	const deleted = Array.isArray(deletedData) ? deletedData.length : userIds.length;
	console.log(`✓ Auth users: ${deleted} borrados (cascade borra profiles, listings, listing_images, etc.)`);

	console.log('\n✓ Wipe completo.');
}

main().catch((err) => {
	console.error('Error fatal:', err);
	process.exit(1);
});