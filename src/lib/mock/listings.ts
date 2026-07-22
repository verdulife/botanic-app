export interface MockListing {
	id: string;
	title: string;
	price: number;
	category: string;
	location: string;
	seller: string;
	avatar: string;
}

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
	"Monstera Adansonii",
];

const sellers = ["Maria", "Carlos", "Ana", "Luis", "Elena", "David", "Sofía", "Pablo"];

const avatars = ["bg-rose-400", "bg-sky-400", "bg-amber-400", "bg-emerald-400", "bg-violet-400", "bg-teal-400", "bg-pink-400", "bg-lime-400"];

export const mockListings: MockListing[] = Array.from({ length: 12 }, (_, i) => ({
	id: `listing-${i + 1}`,
	title: names[i % names.length],
	price: Math.floor(Math.random() * 45) + 3,
	category: ["Semillas", "Esquejes", "Brotes", "Plantas", "Tiestos"][i % 5],
	location: ["Madrid", "Barcelona", "Valencia", "Sevilla", "Bilbao"][i % 5],
	seller: sellers[i % sellers.length],
	avatar: avatars[i % avatars.length],
}));

export const categories = ["Todas", "Semillas", "Esquejes", "Brotes", "Plantas", "Tiestos"];
