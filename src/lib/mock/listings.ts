export type ListingType = "vender" | "cambiar" | "regalar";

export type Listing = {
	id: string;
	title: string;
	price: number;
	category: string;
	location: string;
	seller: string;
	images: string[];
	type: ListingType;
	coordinates: { lat: number; lng: number };
	datePosted: Date;
};

const names = [
	"Monstera Deliciosa",
	"Esqueje de Pothos",
	"Semillas de Suculentas",
	"Brote de Albahaca",
	"Planta de Aloe Vera",
	"Tiesto Cerámico 20cm",
	"Esqueje de Hiedra",
	"Semillas de Tomate Cherry",
	"Planta de Lavanda",
	"Tiesto Macramé Colgante",
	"Brote de Menta",
	"Monstera Adansonii"
];

const sellers = ["Maria", "Carlos", "Ana", "Luis", "Elena", "David", "Sofía", "Pablo"];

const images = [
	'https://picsum.photos/seed/botanic-img-1/120/120',
	'https://picsum.photos/seed/botanic-img-2/120/120',
	'https://picsum.photos/seed/botanic-img-3/120/120',
	'https://picsum.photos/seed/botanic-img-4/120/120',
	'https://picsum.photos/seed/botanic-img-5/120/120',
	'https://picsum.photos/seed/botanic-img-6/120/120',
	'https://picsum.photos/seed/botanic-img-7/120/120',
	'https://picsum.photos/seed/botanic-img-8/120/120'
];

const categoryNames = ["Semillas", "Esquejes", "Plantas", "Tiestos", "Accesorios"];

const locationNames = ["Madrid", "Barcelona", "Valencia", "Sevilla", "Bilbao"];

const typeNames: ListingType[] = ["vender", "cambiar", "regalar"];

// Centro del usuario mock (Madrid) para calcular distancias
const userCoords = { lat: 40.4168, lng: -3.7038 };

const cityCoords: Record<string, { lat: number; lng: number }> = {
	Madrid: { lat: 40.4168, lng: -3.7038 },
	Barcelona: { lat: 41.3851, lng: 2.1734 },
	Valencia: { lat: 39.4699, lng: -0.3763 },
	Sevilla: { lat: 37.3891, lng: -5.9845 },
	Bilbao: { lat: 43.263, lng: -2.935 }
};

const now = Date.now();
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;

function randomOffset(): number {
	// Distribuye los anuncios en distintos momentos para que los filtros de fecha tengan sentido
	const r = Math.random();
	if (r < 0.2) return Math.floor(Math.random() * 12 * HOUR); // últimas 12h
	if (r < 0.5) return Math.floor(Math.random() * 6 * DAY) + 12 * HOUR; // 12h - 6d
	if (r < 0.8) return Math.floor(Math.random() * 3 * WEEK) + 6 * DAY; // 6d - 27d
	return Math.floor(Math.random() * 2 * MONTH) + 27 * DAY; // 27d - 87d
}

export const mockListings: Listing[] = Array.from({ length: 12 }, (_, i) => {
	const location = locationNames[i % locationNames.length];
	const baseCoords = cityCoords[location] ?? userCoords;
	// Añade una pequeña variación a las coordenadas para que no todas coincidan
	const coordinates = {
		lat: baseCoords.lat + (Math.random() - 0.5) * 0.05,
		lng: baseCoords.lng + (Math.random() - 0.5) * 0.05
	};
	// 3, 4 o 5 imágenes por listing (rotación desde el pool de 8)
	const imageCount = 3 + (i % 3);
	const start = i % images.length;
	const listingImages = Array.from(
		{ length: imageCount },
		(_, k) => images[(start + k) % images.length]
	);
	return {
		id: `listing-${i + 1}`,
		title: names[i % names.length],
		price: Math.floor(Math.random() * 45) + 3,
		category: categoryNames[i % categoryNames.length],
		location,
		seller: sellers[i % sellers.length],
		images: listingImages,
		type: typeNames[i % typeNames.length],
		coordinates,
		datePosted: new Date(now - randomOffset())
	};
});

export const categories = [
	"Todas las categorías",
	"Semillas",
	"Esquejes",
	"Plantas",
	"Tiestos",
	"Accesorios"
];

export const listingTypes: ListingType[] = ["vender", "cambiar", "regalar"];

export const publishedOptions = [
	{ value: "hoy", label: "Hoy" },
	{ value: "semana", label: "Última semana" },
	{ value: "mes", label: "Último mes" },
	{ value: "cualquiera", label: "Cualquier fecha" }
] as const;

export type PublishedOption = (typeof publishedOptions)[number]["value"];

export const sortOptions = [
	{ value: "distancia", label: "Distancia" },
	{ value: "relevancia", label: "Relevancia" },
	{ value: "novedad", label: "Novedad" },
	{ value: "precio-desc", label: "Precio (mayor a menor)" },
	{ value: "precio-asc", label: "Precio (menor a mayor)" }
] as const;

export type SortOption = (typeof sortOptions)[number]["value"];

export const PRICE_MIN = 0;
export const PRICE_MAX = 100;
export const RADIO_MIN = 1;
export const RADIO_MAX = 50;

export { userCoords };
