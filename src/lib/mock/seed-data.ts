// Datos de seed compartidos entre el mock del cliente (src/lib/mock/) y el
// script scripts/seed-mock.ts. Fuente única de la data para que el wireframe y
// lo que sube a Supabase muestren los mismos usuarios, categorías y ubicaciones.

export type CategorySlug =
	| 'semillas'
	| 'esquejes'
	| 'plantas'
	| 'tiestos'
	| 'accesorios'
	| 'herramientas'
	| 'libros'
	| 'otros';

export type Category = {
	slug: CategorySlug;
	name: string;
	position: number;
};

export const CATEGORIES: Category[] = [
	{ slug: 'semillas', name: 'Semillas', position: 0 },
	{ slug: 'esquejes', name: 'Esquejes', position: 1 },
	{ slug: 'plantas', name: 'Plantas', position: 2 },
	{ slug: 'tiestos', name: 'Tiestos', position: 3 },
	{ slug: 'accesorios', name: 'Accesorios', position: 4 },
	{ slug: 'herramientas', name: 'Herramientas', position: 5 },
	{ slug: 'libros', name: 'Libros y guías', position: 6 },
	{ slug: 'otros', name: 'Otros', position: 7 }
];

export type LocationSeed = { label: string; lat: number; lng: number };

export const LOCATIONS: LocationSeed[] = [
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

export type UserSeed = {
	username: string;
	full_name: string;
	bio: string;
	city: string;
	rating: number;
	reviewCount: number;
};

export const USERS: UserSeed[] = [
	{ username: 'mock_ana', full_name: 'Ana Ruiz', bio: 'Coleccionista de pothos y monsteras. Intercambia esquejes en Madrid.', city: 'Madrid, Malasaña', rating: 4.9, reviewCount: 38 },
	{ username: 'mock_luis', full_name: 'Luis Ortega', bio: 'Vendo plantas de mi terraza en Barcelona. Buenos precios.', city: 'Barcelona, Gràcia', rating: 4.6, reviewCount: 21 },
	{ username: 'mock_maria', full_name: 'María Sánchez', bio: 'Semillas de huerta urbana. Experimentos con tomates y albahaca.', city: 'Valencia, Ruzafa', rating: 4.7, reviewCount: 15 },
	{ username: 'mock_carlos', full_name: 'Carlos Mendoza', bio: 'Suculentas y cactus. Tengo de todo, desde pequeños hasta grandes.', city: 'Sevilla, Triana', rating: 4.5, reviewCount: 9 },
	{ username: 'mock_elena', full_name: 'Elena Vega', bio: 'Me encantan las calatheas y las plantas tropicales raras.', city: 'Madrid, Chamberí', rating: 5.0, reviewCount: 12 },
	{ username: 'mock_diego', full_name: 'Diego Marín', bio: 'Herramientas de jardinería restauradas. Tijeras, regaderas, palas.', city: 'Bilbao, Indautxu', rating: 4.4, reviewCount: 7 },
	{ username: 'mock_sofia', full_name: 'Sofía Castro', bio: 'Tiestos de cerámica hechos a mano en el barrio.', city: 'Barcelona, Poblenou', rating: 4.8, reviewCount: 25 },
	{ username: 'mock_javier', full_name: 'Javier Romero', bio: 'Libros y guías sobre plantas. También vendo revistas especializadas.', city: 'Madrid, Centro', rating: 4.6, reviewCount: 18 },
	{ username: 'mock_lucía', full_name: 'Lucía Navarro', bio: 'Hierbas aromáticas y plantas culinarias. Menta, romero, albahaca.', city: 'Málaga, Centro', rating: 4.3, reviewCount: 6 },
	{ username: 'mock_pablo', full_name: 'Pablo Iglesias', bio: 'Tiestos grandes para terrazas y patios. Varias medidas.', city: 'Valencia, El Carme', rating: 4.7, reviewCount: 11 },
	{ username: 'mock_carmen', full_name: 'Carmen Reyes', bio: 'Plantas de interior fáciles de cuidar. Ideal para principiantes.', city: 'Sevilla, Centro', rating: 4.8, reviewCount: 30 },
	{ username: 'mock_andres', full_name: 'Andrés Gil', bio: 'Sustratos y abonos. Mezclas especiales para cactus y orquídeas.', city: 'Zaragoza, Centro', rating: 4.4, reviewCount: 5 },
	{ username: 'mock_paula', full_name: 'Paula Vidal', bio: 'Helechos y plantas de sombra. Tengo un patio inglés y me sobran.', city: 'Granada, Albayzín', rating: 4.9, reviewCount: 44 },
	{ username: 'mock_miguel', full_name: 'Miguel Ángel Santos', bio: 'Esquejes de plantas aromáticas y culinarias. Precios populares.', city: 'Madrid, Centro', rating: 4.1, reviewCount: 3 },
	{ username: 'mock_rosa', full_name: 'Rosa Moya', bio: 'Compro y vendo plantas. Especialidad: pothos y tradescantias.', city: 'Barcelona, Eixample', rating: 4.5, reviewCount: 16 },
	{ username: 'mock_jorge', full_name: 'Jorge Belmonte', bio: 'Pequeño vivero urbano. Vendo lo que voy reproduciendo.', city: 'Madrid, Chamberí', rating: 4.7, reviewCount: 22 },
	{ username: 'mock_inés', full_name: 'Inés Pino', bio: 'Plantas de regalo. Preparo sets para cumpleaños y eventos.', city: 'Valencia, Ruzafa', rating: 4.6, reviewCount: 8 },
	{ username: 'mock_raul', full_name: 'Raúl Bravo', bio: 'Kokedamas y arreglos con musgo. Aprendí en Japón.', city: 'Sevilla, Centro', rating: 5.0, reviewCount: 63 },
	{ username: 'mock_clara', full_name: 'Clara Rubio', bio: 'Plantas carnívoras. Tengo droseras, nepentes y venus atrapamoscas.', city: 'Bilbao, Indautxu', rating: 4.8, reviewCount: 27 },
	{ username: 'mock_david', full_name: 'David Pascual', bio: 'Regalo esquejes a quien venga a recogerlos. Solo materiales de poda.', city: 'Madrid, Malasaña', rating: 4.2, reviewCount: 4 }
];

export function mockEmailFor(username: string): string {
	return username.replace('mock_', '') + '-mock@botanic.test';
}

export const PLANT_TERMS = [
	'pothos', 'monstera deliciosa', 'monstera adansonii', 'calathea orbifolia', 'calathea medallion',
	'ficus lyrata', 'ficus elastica', 'sansevieria trifasciata', 'helecho boston',
	'hiedra variegada', 'jazmín de interior', 'geranio', 'albahaca', 'romero', 'menta',
	'suculenta echeveria', 'cactus columnar', 'orquídea phalaenopsis', 'lavanda',
	'rosal mini', 'tradescantia', 'potho neón', 'begonia maculata', 'anthurium',
	'kentia', 'areca', 'dracaena marginata', 'yucca', 'codiaeum variegatum'
];

export const LISTING_TEMPLATES: Record<CategorySlug, string[]> = {
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

export const SIZES = { small: 8, medium: 12, large: 16, xl: 20 };
export const COLORS = ['terracota', 'blanco mate', 'verde salvia', 'gris antracita', 'beig cálido'];

export function priceFor(category: CategorySlug): number {
	if (category === 'libros') return Math.round((Math.random() * 12 + 5) * 100) / 100;
	if (category === 'semillas') return Math.round((Math.random() * 4 + 1.5) * 100) / 100;
	if (category === 'herramientas') return Math.round((Math.random() * 20 + 8) * 100) / 100;
	if (category === 'tiestos') return Math.round((Math.random() * 15 + 5) * 100) / 100;
	if (category === 'accesorios') return Math.round((Math.random() * 8 + 2) * 100) / 100;
	return Math.round((Math.random() * 18 + 3) * 100) / 100;
}

export function describe(category: Category, title: string): string {
	const intros: Record<string, string> = {
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
