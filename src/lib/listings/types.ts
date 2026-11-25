// Modelo de vista de un anuncio: la forma que consumen los componentes.
//
// No es la forma de la fila de base de datos (esa la da `$lib/supabase/types`):
// el mapeo de fila a vista vive en ./query.ts.

// Operaciones posibles sobre un anuncio. "Vender" y "cambiar" son combinables;
// "regalar" va siempre solo.
export type ListingType = 'vender' | 'cambiar' | 'regalar';

// Slug de categoría. No es un conjunto cerrado: las categorías viven en la tabla
// `categories` y la base puede añadir más sin tocar el código.
export type CategorySlug = string;

// Punto en el mapa, en grados decimales. Las operaciones geométricas viven en
// ./geo.ts.
export type Coordinates = { lat: number; lng: number };

// Especie identificada (manual o vía Pl@ntNet). `name` es el nombre de display
// (nombre común si existe, si no científico) y la clave usada por plant-care.
export type PlantSpecies = {
	name: string;
	scientific?: string;
	genus?: string;
	family?: string;
	confidence?: number;
	source?: 'manual' | 'plantnet';
};

export type SellerInfo = {
	username: string;
	full_name: string;
	bio: string;
	// `profiles.location_label` del vendedor.
	city: string;
	// No se lee de `profiles` (el correo vive en auth y no se expone): queda fuera
	// del modelo de vista salvo que quien lo construya lo tenga a mano.
	email?: string;
	// `profiles.rating` y `profiles.review_count`, tal y como los guarda la base.
	rating: number;
	reviewCount: number;
};

/**
 * @property publicId Número público del anuncio. Es lo que identifica el anuncio
 * en la URL (`/app/anuncio/<slug>-<publicId>`, ver ./ref.ts): el uuid `id` queda
 * para editar y borrar.
 */
export type Listing = {
	id: string;
	publicId: number;
	title: string;
	price: number;
	category: string;
	categorySlug: CategorySlug;
	location: string;
	seller: string;
	sellerInfo: SellerInfo;
	images: string[];
	type: ListingType[];
	// `null` cuando el anuncio no tiene posición: ni el anuncio ni su vendedor
	// tienen coordenadas guardadas. No se inventa un punto (el (0,0) cae en el
	// golfo de Guinea): quien dibuja el mapa descarta el anuncio.
	coordinates: Coordinates | null;
	datePosted: Date;
	description: string;
	species?: PlantSpecies;
	size?: string;
	wishId?: string;
};
