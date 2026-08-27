/**
 * Seed mock data para desarrollo.
 *
 * Crea 20 mock users con perfiles completos, 8 categorías, y ~140 listings
 * (5-10 por usuario, aleatorio) con imágenes subidas a Supabase Storage.
 *
 * IMPORTANTE: este script crea contenido que se borrará con `wipe-mock.ts` antes
 * de pasar a producción. No usar contra entornos reales.
 *
 * Modos:
 *   bun run scripts/seed-mock.ts            → preview JSON (no escribe nada)
 *   bun run scripts/seed-mock.ts --apply    → ejecuta el seed completo
 *
 * Requiere en .env.local:
 *   - PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 *
 * Las imágenes se leen de static/images/seed/*.webp (generadas con optimize-seed-images.mjs).
 *
 * La data de seed (categorías, usuarios, ubicaciones, plantillas) vive en
 * src/lib/mock/seed-data.ts — la misma que usa el mock del cliente.
 */

import { createClient } from '@supabase/supabase-js';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	CATEGORIES,
	USERS,
	LOCATIONS,
	LISTING_TEMPLATES,
	PLANT_TERMS,
	COLORS,
	SIZES,
	priceFor,
	describe,
	mockEmailFor,
	type CategorySlug
} from '../src/lib/mock/seed-data';

const APPLY = process.argv.includes('--apply');

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE) {
	console.error('Faltan PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local');
	process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
	auth: { autoRefreshToken: false, persistSession: false }
});

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SEED_IMAGES_DIR = resolve(ROOT, 'static/images/seed');
const MOCK_PASSWORD = 'MockPass123!';

export type ListingType = 'vender' | 'cambiar' | 'regalar';
const LISTING_TYPES: ListingType[] = ['vender', 'cambiar', 'regalar'];

// ──────────────────────────────────────────────────────────
// Determinismo del preview vs apply
// ──────────────────────────────────────────────────────────

let rngSeed = 1234;
function setSeed(s: number) {
	rngSeed = s;
}
function rand(): number {
	rngSeed = (rngSeed * 9301 + 49297) % 233280;
	return rngSeed / 233280;
}
function pickSeeded<T>(arr: T[]): T {
	return arr[Math.floor(rand() * arr.length)];
}
function fillTemplateSeeded(tpl: string): string {
	return tpl
		.replace('{plant}', pickSeeded(PLANT_TERMS))
		.replace('{color}', pickSeeded(COLORS))
		.replace('{size}', pickSeeded(Object.keys(SIZES)));
}

function planForUser(
	user: (typeof USERS)[number],
	categoryList: typeof CATEGORIES,
	imageCount: number,
	listingsRange: [number, number]
) {
	const numListings = Math.floor(rand() * (listingsRange[1] - listingsRange[0] + 1)) + listingsRange[0];
	const plan = [];
	for (let i = 0; i < numListings; i++) {
		const category = pickSeeded(categoryList);
		const tpl = pickSeeded(LISTING_TEMPLATES[category.slug]);
		const title = fillTemplateSeeded(tpl);
		const numImages = Math.min(imageCount, Math.floor(rand() * 3) + 1);
		const location = LOCATIONS.find((l) => l.label === user.city) ?? pickSeeded(LOCATIONS);
		plan.push({
			title,
			category: category.slug,
			price: priceFor(category.slug),
			type: pickSeeded(LISTING_TYPES),
			location: location.label,
			images: numImages,
			description_preview: describe(category, title).slice(0, 80) + '…'
		});
	}
	return plan;
}

// ──────────────────────────────────────────────────────────
// Lectura de imágenes
// ──────────────────────────────────────────────────────────

function listSeedImages(): string[] {
	try {
		return readdirSync(SEED_IMAGES_DIR).filter(
			(f) => f.endsWith('.webp') || f.endsWith('.jpg') || f.endsWith('.png')
		);
	} catch {
		return [];
	}
}

// ──────────────────────────────────────────────────────────
// Modo preview
// ──────────────────────────────────────────────────────────

function preview() {
	setSeed(1234);
	const imageFiles = listSeedImages();
	const listingsPerUser: [number, number] = [5, 10];

	const userPlans = USERS.map((u) => ({
		username: u.username,
		email: mockEmailFor(u.username),
		full_name: u.full_name,
		location: u.city,
		listings: planForUser(u, CATEGORIES, imageFiles.length, listingsPerUser)
	}));

	const totalListings = userPlans.reduce((acc, u) => acc + u.listings.length, 0);
	const totalImages = userPlans.reduce(
		(acc, u) => acc + u.listings.reduce((a, l) => a + l.images, 0),
		0
	);

	const summary = {
		mode: 'preview',
		categories: CATEGORIES.length,
		users: USERS.length,
		listings_total: totalListings,
		listings_per_user: '5-10 (uniforme)',
		images_total: totalImages,
		storage_uploads: totalImages,
		db_writes: CATEGORIES.length + USERS.length + totalListings + totalImages,
		images_available_locally: imageFiles.length,
		warning: imageFiles.length === 0 ? 'No hay imágenes en static/images/seed/ — los listings se crearán sin fotos.' : undefined
	};

	const output = {
		summary,
		categories: CATEGORIES,
		users: userPlans
	};

	console.log(JSON.stringify(output, null, 2));
	console.log('\n── Para aplicar este plan, ejecuta:');
	console.log('   bun run scripts/seed-mock.ts --apply');
}

// ──────────────────────────────────────────────────────────
// Modo apply
// ──────────────────────────────────────────────────────────

async function apply() {
	setSeed(1234);
	console.log('Aplicando seed mock…\n');

	const imageFiles = listSeedImages();
	if (imageFiles.length === 0) {
		console.warn('⚠ No hay imágenes en static/images/seed/ — los listings se crearán sin fotos.');
		console.warn('  Ejecuta antes: bun run scripts/optimize-seed-images.mjs (con imágenes en static/images/seed-source/)');
	}

	// 1. Categorías
	console.log(`1. Creando ${CATEGORIES.length} categorías…`);
	const { data: catData, error: catErr } = await supabase
		.from('categories')
		.upsert(CATEGORIES, { onConflict: 'slug' })
		.select('id, slug');
	if (catErr) {
		console.error('Error creando categorías:', catErr);
		process.exit(1);
	}
	const categoryBySlug = Object.fromEntries(catData.map((c) => [c.slug, c.id]));
	console.log(`   ✓ ${catData.length} categorías listas`);

	// 2. Users
	console.log(`\n2. Creando ${USERS.length} mock users…`);
	const userIds: Record<string, { id: string; email: string } & (typeof USERS)[number]> = {};
	const existing = await supabase.auth.admin.listUsers({ perPage: 200 });
	const existingByEmail = Object.fromEntries(existing.data.users.map((u) => [u.email, u]));

	for (const u of USERS) {
		const email = mockEmailFor(u.username);
		let userId;
		if (existingByEmail[email]) {
			userId = existingByEmail[email].id;
			console.log(`   · ${email} (existente)`);
		} else {
			const { data, error } = await supabase.auth.admin.createUser({
				email,
				password: MOCK_PASSWORD,
				email_confirm: true,
				user_metadata: { username: u.username, full_name: u.full_name }
			});
			if (error) {
				console.error(`   ✗ ${email}: ${error.message}`);
				continue;
			}
			userId = data.user.id;
			console.log(`   ✓ ${email}`);
		}
		userIds[u.username] = { id: userId, email, ...u };

		const location = LOCATIONS.find((l) => l.label === u.city);
		await supabase
			.from('profiles')
			.update({
				full_name: u.full_name,
				bio: u.bio,
				location_label: u.city,
				lat: location?.lat ?? null,
				lng: location?.lng ?? null
			})
			.eq('id', userId);
	}

	// 3. Listings
	const listingsPerUser: [number, number] = [5, 10];
	let totalListings = 0;
	let totalImages = 0;
	let uploaded = 0;
	let failedUploads = 0;

	console.log(`\n3. Creando listings (5-10 por usuario, aleatorio)…`);
	for (const u of USERS) {
		const profile = userIds[u.username];
		if (!profile) continue;

		const numListings = Math.floor(rand() * (listingsPerUser[1] - listingsPerUser[0] + 1)) + listingsPerUser[0];

		for (let i = 0; i < numListings; i++) {
			const category = pickSeeded(CATEGORIES);
			const tpl = pickSeeded(LISTING_TEMPLATES[category.slug]);
			const title = fillTemplateSeeded(tpl);
			const numImages = imageFiles.length === 0 ? 0 : Math.min(imageFiles.length, Math.floor(rand() * 3) + 1);
			const location = LOCATIONS.find((l) => l.label === u.city) ?? pickSeeded(LOCATIONS);
			const description = describe(category, title);
			const price = priceFor(category.slug);
			const type = pickSeeded(LISTING_TYPES);

			const { data: listing, error: listErr } = await supabase
				.from('listings')
				.insert({
					seller_id: profile.id,
					title,
					description,
					category_id: categoryBySlug[category.slug],
					price,
					type,
					location_label: location.label,
					lat: location.lat,
					lng: location.lng
				})
				.select('id')
				.single();

			if (listErr) {
				console.error(`   ✗ listing "${title}": ${listErr.message}`);
				continue;
			}
			totalListings++;

			for (let pos = 0; pos < numImages; pos++) {
				const imgFile = imageFiles[Math.floor(rand() * imageFiles.length)];
				const fileBuf = readFileSync(resolve(SEED_IMAGES_DIR, imgFile));
				const ext = imgFile.endsWith('.webp') ? 'webp' : imgFile.endsWith('.png') ? 'png' : 'jpg';
				const storagePath = `${profile.id}/${listing.id}/${crypto.randomUUID()}.${ext}`;

				const { error: upErr } = await supabase.storage
					.from('listing-images')
					.upload(storagePath, fileBuf, {
						contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
						upsert: false
					});

				if (upErr) {
					failedUploads++;
					continue;
				}

				const { data: pub } = supabase.storage.from('listing-images').getPublicUrl(storagePath);

				await supabase.from('listing_images').insert({
					listing_id: listing.id,
					url: pub.publicUrl,
					storage_path: storagePath,
					position: pos
				});
				uploaded++;
				totalImages++;
			}
		}
	}

	console.log(`\n✓ Seed completo:`);
	console.log(`   · ${CATEGORIES.length} categorías`);
	console.log(`   · ${Object.keys(userIds).length} mock users (password: ${MOCK_PASSWORD})`);
	console.log(`   · ${totalListings} listings`);
	console.log(`   · ${uploaded}/${totalImages} imágenes subidas a Storage (${failedUploads} fallidas)`);
	console.log(`\nPara wipear antes de producción:`);
	console.log(`   bun run scripts/wipe-mock.ts`);
	console.log(`   bun run scripts/wipe-mock.ts --dry-run  # preview primero`);
}

// ──────────────────────────────────────────────────────────

if (APPLY) {
	apply().catch((err) => {
		console.error('Error fatal:', err);
		process.exit(1);
	});
} else {
	preview();
}
