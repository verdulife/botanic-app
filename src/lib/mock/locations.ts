// Ubicaciones para el deseo: alcance jerárquico (país, comunidad, provincia,
// ciudad). Datos estáticos para el wireframe; en producción vivirían en una
// tabla/API y el deseo guardaría el alcance estructurado.

export type LocationScope = 'pais' | 'comunidad' | 'provincia' | 'ciudad';

export type Comunidad = {
	name: string;
	provincias: string[];
};

export const COMUNIDADES: Comunidad[] = [
	{
		name: 'Andalucía',
		provincias: ['Almería', 'Cádiz', 'Córdoba', 'Granada', 'Huelva', 'Jaén', 'Málaga', 'Sevilla']
	},
	{ name: 'Aragón', provincias: ['Huesca', 'Teruel', 'Zaragoza'] },
	{ name: 'Principado de Asturias', provincias: ['Asturias'] },
	{ name: 'Islas Baleares', provincias: ['Islas Baleares'] },
	{ name: 'Islas Canarias', provincias: ['Las Palmas', 'Santa Cruz de Tenerife'] },
	{ name: 'Cantabria', provincias: ['Cantabria'] },
	{
		name: 'Castilla-La Mancha',
		provincias: ['Albacete', 'Ciudad Real', 'Cuenca', 'Guadalajara', 'Toledo']
	},
	{
		name: 'Castilla y León',
		provincias: ['Ávila', 'Burgos', 'León', 'Palencia', 'Salamanca', 'Segovia', 'Soria', 'Valladolid', 'Zamora']
	},
	{ name: 'Cataluña', provincias: ['Barcelona', 'Girona', 'Lleida', 'Tarragona'] },
	{ name: 'Extremadura', provincias: ['Badajoz', 'Cáceres'] },
	{ name: 'Galicia', provincias: ['A Coruña', 'Lugo', 'Ourense', 'Pontevedra'] },
	{ name: 'Comunidad de Madrid', provincias: ['Madrid'] },
	{ name: 'Región de Murcia', provincias: ['Murcia'] },
	{ name: 'Comunidad Foral de Navarra', provincias: ['Navarra'] },
	{ name: 'País Vasco', provincias: ['Álava', 'Guipúzcoa', 'Vizcaya'] },
	{ name: 'La Rioja', provincias: ['La Rioja'] },
	{ name: 'Comunidad Valenciana', provincias: ['Alicante', 'Castellón', 'Valencia'] }
];

// Ciudades presentes en el seed; cubren el alcance "ciudad" del wireframe.
export const CIUDADES = [
	'Madrid',
	'Barcelona',
	'Valencia',
	'Sevilla',
	'Bilbao',
	'Málaga',
	'Zaragoza',
	'Granada'
];

export function allProvincias(): string[] {
	return COMUNIDADES.flatMap((c) => c.provincias);
}

export function provinciaToComunidad(provincia: string): string | undefined {
	return COMUNIDADES.find((c) => c.provincias.includes(provincia))?.name;
}

/** Etiqueta legible del deseo según el alcance elegido. */
export function composeLocationLabel(scope: LocationScope, value: string): string {
	switch (scope) {
		case 'pais':
			return 'Todo el país';
		case 'comunidad':
			return value;
		case 'provincia':
			return `${value} (provincia)`;
		case 'ciudad':
			return value;
	}
}