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
 */

import { createClient } from '@supabase/supabase-js';
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

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

// ──────────────────────────────────────────────────────────
// Datos mock
// ──────────────────────────────────────────────────────────

const CATEGORIES = [
	{ slug: 'semillas', name: 'Semillas', position: 0 },
	{ slug: 'esquejes', name: 'Esquejes', position: 1 },
	{ slug: 'plantas', name: 'Plantas', position: 2 },
	{ slug: 'tiestos', name: 'Tiestos', position: 3 },
	{ slug: 'accesorios', name: 'Accesorios', position: 4 },
	{ slug: 'herramientas', name: 'Herramientas', position: 5 },
	{ slug: 'libros', name: 'Libros y guías', position: 6 },
	{ slug: 'otros', name: 'Otros', position: 7 }
];

const LOCATIONS = [
	{ label: 'Madrid, Centro', lat: 40.4168, lng: -3.7038 },
	{ label: 'Madrid, Malasaña', lat: 40.4258, lng: -3.7068 },
	{ label: 'Madrid, Chamberí', lat: 40.4316, lng: -3.7043 },
	{ label: 'Barcelona, Gràcia', lat: 41.4036, lng: 2.1565 },
	{ label: 'Barcelona, Eixample', lat: 41.3874, lng: 2.1686 },
	{ label: 'Barcelona, Poblenou', lat: 41.4042, lng: 2.1993 },
	{ label: 'Valencia, Ruzafa', lat: 39.4636, lng: -0.3753 },
	{ label: 'Valencia, El Carme', lat: 39.4793, lng: -0.3822 },
	{ label: 'Sevilla, Triana', lat: 37.382, lng: -6.002 },
	{ label: 'Sevilla, Centro', lat: 37.3886, lng: -5.9823 },
	{ label: 'Bilbao, Indautxu', lat: 43.263, lng: -2.935 },
	{ label: 'Málaga, Centro', lat: 36.7213, lng: -4.4214 },
	{ label: 'Zaragoza, Centro', lat: 41.6488, lng: -0.8891 },
	{ label: 'Granada, Albayzín', lat: 37.1802, lng: -3.5932 }
];

const USERS = [
	{ username: 'mock_ana', full_name: 'Ana Ruiz', bio: 'Coleccionista de pothos y monsteras. Intercambia esquejes en Madrid.', city: 'Madrid, Malasaña' },
	{ username: 'mock_luis', full_name: 'Luis Ortega', bio: 'Vendo plantas de mi terraza en Barcelona. Buenos precios.', city: 'Barcelona, Gràcia' },
	{ username: 'mock_maria', full_name: 'María Sánchez', bio: 'Semillas de huerta urbana. Experimentos con tomates y albahaca.', city: 'Valencia, Ruzafa' },
	{ username: 'mock_carlos', full_name: 'Carlos Mendoza', bio: 'Suculentas y cactus. Tengo de todo, desde pequeños hasta grandes.', city: 'Sevilla, Triana' },
	{ username: 'mock_elena', full_name: 'Elena Vega', bio: 'Me encantan las calatheas y las plantas tropicales raras.', city: 'Madrid, Chamberí' },
	{ username: 'mock_diego', full_name: 'Diego Marín', bio: 'Herramientas de jardinería restauradas. Tijeras, regaderas, palas.', city: 'Bilbao, Indautxu' },
	{ username: 'mock_sofia', full_name: 'Sofía Castro', bio: 'Tiestos de cerámica hechos a mano en el barrio.', city: 'Barcelona, Poblenou' },
	{ username: 'mock_javier', full_name: 'Javier Romero', bio: 'Libros y guías sobre plantas. También vendo revistas especializadas.', city: 'Madrid, Centro' },
	{ username: 'mock_lucía', full_name: 'Lucía Navarro', bio: 'Hierbas aromáticas y plantas culinarias. Menta, romero, albahaca.', city: 'Málaga, Centro' },
	{ username: 'mock_pablo', full_name: 'Pablo Iglesias', bio: 'Tiestos grandes para terrazas y patios. Varias medidas.', city: 'Valencia, El Carme' },
	{ username: 'mock_carmen', full_name: 'Carmen Reyes', bio: 'Plantas de interior fáciles de cuidar. Ideal para principiantes.', city: 'Sevilla, Centro' },
	{ username: 'mock_andres', full_name: 'Andrés Gil', bio: 'Sustratos y abonos. Mezclas especiales para cactus y orquídeas.', city: 'Zaragoza, Centro' },
	{ username: 'mock_paula', full_name: 'Paula Vidal', bio: 'Helechos y plantas de sombra. Tengo un patio inglés y me sobran.', city: 'Granada, Albayzín' },
	{ username: 'mock_miguel', full_name: 'Miguel Ángel Santos', bio: 'Esquejes de plantas aromáticas y culinarias. Precios populares.', city: 'Madrid, Centro' },
	{ username: 'mock_rosa', full_name: 'Rosa Moya', bio: 'Compro y vendo plantas. Especialidad: pothos y tradescantias.', city: 'Barcelona, Eixample' },
	{ username: 'mock_jorge', full_name: 'Jorge Belmonte', bio: 'Pequeño vivero urbano. Vendo lo que voy reproduciendo.', city: 'Madrid, Chamberí' },
	{ username: 'mock_inés', full_name: 'Inés Pino', bio: 'Plantas de regalo. Preparo sets para cumpleaños y eventos.', city: 'Valencia, Ruzafa' },
	{ username: 'mock_raul', full_name: 'Raúl Bravo', bio: 'Kokedamas y arreglos con musgo. Aprendí en Japón.', city: 'Sevilla, Centro' },
	{ username: 'mock_clara', full_name: 'Clara Rubio', bio: 'Plantas carnívoras. Tengo droseras, nepentes y venus atrapamoscas.', city: 'Bilbao, Indautxu' },
	{ username: 'mock_david', full_name: 'David Pascual', bio: 'Regalo esquejes a quien venga a recogerlos. Solo materiales de poda.', city: 'Madrid, Malasaña' }
];

// Plantillas de listing por categoría
const PLANT_TERMS = [
	'pothos', 'monstera deliciosa', 'monstera adansonii', 'calathea orbifolia', 'calathea medallion',
	'ficus lyrata', 'ficus elastica', 'sansevieria trifasciata', 'helecho boston',
	'hiedra variegada', 'jazmín de interior', 'geranio', 'albahaca', 'romero', 'menta',
	'suculenta echeveria', 'cactus columnar', 'orquídea phalaenopsis', 'lavanda',
	'rosal mini', 'tradescantia', 'potho neón', 'begonia maculata', 'anthurium',
	'kentia', 'areca', 'dracaena marginata', 'yucca', 'codiaeum variegatum'
];

const LISTING_TEMPLATES = {
	semillas: [
		'Semillas de {plant} · sobre con ~30 unidades',
		'Semillas {plant} · cosecha propia 2024',
		'Semillas ecológicas de {plant} · 20 unidades',
		'Semillas {plant} · pack para principiantes'
	],
	esquejes: [
		'Esquejes de {plant} listos para enraizar',
		'Esquejes {plant} · 3 tallos con nudos',
		'Esquejes de {plant} enraizados en agua',
		'Esquejes {plant} · pack de 5 unidades'
	],
	plantas: [
		'{plant} en maceta de 12cm · bien enraizada',
		'{plant} · planta adulta, 40cm de altura',
		'{plant} en tiesto de barro · recién trasplantada',
		'{plant} pequeña · ideal para escritorio'
	],
	tiestos: [
		'Tiesto de cerámica {color} · {size}cm de diámetro',
		'Maceta de barro {size}cm · con plato',
		'Tiesto autorriego {size}cm · beige',
		'Maceta colgante de macramé + tiesto {size}cm'
	],
	accesorios: [
		'Sustrato universal · saco de {size}L',
		'Turbia para orquídeas · bolsa de {size}L',
		'Fertilizante líquido · {size}ml',
		'Perlas de arcilla expandida · bolsa {size}L'
	],
	herramientas: [
		'Tijeras de podar · acero inoxidable',
		'Regadera {size}L · boquilla fina',
		'Pulverizador {size}ml · para humidificar',
		'Pala de mano y rastrillo · set de 2'
	],
	libros: [
		'Libro: "Plantas de interior para principiantes"',
		'Guía práctica de propagación · 120 páginas',
		'Manual de suculentas · tapa blanda',
		'Revista "Verde es vida" · números sueltos'
	],
	otros: [
		'Kokedama de {plant} · con musgo sphagnum',
		'Tutor de musgo para plantas trepadoras',
		'Set de maceteros pequeños · pack de 3',
		'Humificador decorativo de terracota'
	]
};

const SIZES = { small: 8, medium: 12, large: 16, xl: 20 };
const COLORS = ['terracota', 'blanco mate', 'verde salvia', 'gris antracita', 'beig cálido'];

// ──────────────────────────────────────────────────────────
// Funciones auxiliares
// ──────────────────────────────────────────────────────────

function pick(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function pickN(arr, n) {
	const copy = [...arr];
	const out = [];
	for (let i = 0; i < n && copy.length; i++) {
		const idx = Math.floor(Math.random() * copy.length);
		out.push(copy.splice(idx, 1)[0]);
	}
	return out;
}

function fillTemplate(tpl) {
	return tpl
		.replace('{plant}', pick(PLANT_TERMS))
		.replace('{color}', pick(COLORS))
		.replace('{size}', pick(Object.keys(SIZES)));
}

function describe(category, title) {
	const intros = {
		semillas: 'Recogidas a mano. Germinación probada en mi jardín.',
		esquejes: 'Proceden de una planta madre sana. Enraizan en 2-3 semanas en agua.',
		plantas: 'Cuidados fáciles. Incluye instrucciones básicas de riego y luz.',
		tiestos: 'Esmaltado a mano. Aguanta heladas suaves.',
		accesorios: 'Producto sin abrir, comprado en vivero local.',
		herramientas: 'Acero inoxidable, ergonómicas.',
		libros: 'Como nuevo, sin marcas.',
		otros: 'Hecho a mano en mi taller.'
	};
	return `${intros[category.slug] ?? 'Buen estado general.'} ${title}.`;
}

function priceFor(category) {
	if (category === 'libros') return Math.round((Math.random() * 12 + 5) * 100) / 100;
	if (category === 'semillas') return Math.round((Math.random() * 4 + 1.5) * 100) / 100;
	if (category === 'herramientas') return Math.round((Math.random() * 20 + 8) * 100) / 100;
	if (category === 'tiestos') return Math.round((Math.random() * 15 + 5) * 100) / 100;
	if (category === 'accesorios') return Math.round((Math.random() * 8 + 2) * 100) / 100;
	return Math.round((Math.random() * 18 + 3) * 100) / 100;
}

// Determinismo del preview vs apply
let rngSeed = 1234;
function setSeed(s) {
	rngSeed = s;
}
function rand() {
	rngSeed = (rngSeed * 9301 + 49297) % 233280;
	return rngSeed / 233280;
}
function pickSeeded(arr) {
	return arr[Math.floor(rand() * arr.length)];
}
function pickNSeeded(arr, n) {
	const copy = [...arr];
	const out = [];
	for (let i = 0; i < n && copy.length; i++) {
		const idx = Math.floor(rand() * copy.length);
		out.push(copy.splice(idx, 1)[0]);
	}
	return out;
}
function fillTemplateSeeded(tpl) {
	return tpl
		.replace('{plant}', pickSeeded(PLANT_TERMS))
		.replace('{color}', pickSeeded(COLORS))
		.replace('{size}', pickSeeded(Object.keys(SIZES)));
}

function planForUser(user, categoryList, imageCount, listingsRange) {
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
			price: priceFor(category),
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

function listSeedImages() {
	try {
		const files = readdirSync(SEED_IMAGES_DIR).filter(
			(f) => f.endsWith('.webp') || f.endsWith('.jpg') || f.endsWith('.png')
		);
		return files;
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
	const listingsPerUser = [5, 10];

	const userPlans = USERS.map((u) => ({
		username: u.username,
		email: u.email.replace('@', '-mock@'),
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
	const userIds = {};
	const existing = await supabase.auth.admin.listUsers({ perPage: 200 });
	const existingByEmail = Object.fromEntries(existing.data.users.map((u) => [u.email, u]));

	for (const u of USERS) {
		const email = u.username.replace('mock_', '') + '-mock@botanic.test';
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
	const listingsPerUser = [5, 10];
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
			const price = priceFor(category);

			const { data: listing, error: listErr } = await supabase
				.from('listings')
				.insert({
					seller_id: profile.id,
					title,
					description,
					category_id: categoryBySlug[category.slug],
					price,
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