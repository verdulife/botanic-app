// Datos de cuidados por especie.
//
// Mock del dataset que post-wireframe vivirá en la tabla `plant_care` de
// Supabase (mismo shape). Actualmente solo cubrimos algunas especies de
// PLANT_TERMS para visualizar los dos estados (con datos / sin datos -> la
// sección se oculta). Ver architecture.md "Identificación y cuidados de plantas".

export type PlantCare = {
	watering: 'Baja' | 'Media' | 'Alta';
	light: 'Sombra' | 'Luz indirecta' | 'Luz directa';
	ph: string;
	toxicity: 'No tóxica' | 'Tóxica' | 'Tóxica para mascotas';
};

export const plantCareBySpecies: Record<string, PlantCare> = {
	pothos: {
		watering: 'Media',
		light: 'Luz indirecta',
		ph: '6.0 – 7.0',
		toxicity: 'Tóxica para mascotas'
	},
	'monstera deliciosa': {
		watering: 'Media',
		light: 'Luz indirecta',
		ph: '5.5 – 7.0',
		toxicity: 'Tóxica para mascotas'
	},
	'sansevieria trifasciata': {
		watering: 'Baja',
		light: 'Luz indirecta',
		ph: '5.5 – 7.0',
		toxicity: 'Tóxica para mascotas'
	},
	'ficus lyrata': {
		watering: 'Media',
		light: 'Luz indirecta',
		ph: '6.0 – 7.0',
		toxicity: 'Tóxica para mascotas'
	},
	'calathea orbifolia': {
		watering: 'Alta',
		light: 'Sombra',
		ph: '6.0 – 7.0',
		toxicity: 'No tóxica'
	},
	'suculenta echeveria': {
		watering: 'Baja',
		light: 'Luz directa',
		ph: '6.0 – 7.5',
		toxicity: 'No tóxica'
	},
	'cactus columnar': {
		watering: 'Baja',
		light: 'Luz directa',
		ph: '7.0 – 8.0',
		toxicity: 'No tóxica'
	},
	'orquídea phalaenopsis': {
		watering: 'Media',
		light: 'Luz indirecta',
		ph: '5.5 – 6.5',
		toxicity: 'No tóxica'
	},
	romero: {
		watering: 'Baja',
		light: 'Luz directa',
		ph: '6.0 – 7.5',
		toxicity: 'No tóxica'
	},
	'helecho boston': {
		watering: 'Alta',
		light: 'Sombra',
		ph: '6.0 – 7.0',
		toxicity: 'No tóxica'
	}
};

// Alias (nombres científicos/comunes que devuelve Pl@ntNet) → clave de
// `plantCareBySpecies`, para que una especie detectada resuelva cuidados.
const ALIASES: Record<string, string> = {
	'epipremnum aureum': 'pothos',
	'epipremnum pinnatum': 'pothos',
	'golden pothos': 'pothos',
	'devil\'s ivy': 'pothos',
	'monstera deliciosa': 'monstera deliciosa',
	'swiss cheese plant': 'monstera deliciosa',
	'snake plant': 'sansevieria trifasciata',
	'sansevieria': 'sansevieria trifasciata',
	'ficus lyrata': 'ficus lyrata',
	'fiddle leaf fig': 'ficus lyrata',
	'calathea orbifolia': 'calathea orbifolia',
	'echeveria': 'suculenta echeveria',
	'suculenta': 'suculenta echeveria',
	'salvia rosmarinus': 'romero',
	'nephrolepis exaltata': 'helecho boston',
	'phalaenopsis': 'orquídea phalaenopsis',
	'orquídea': 'orquídea phalaenopsis'
};

export function getPlantCare(species: string): PlantCare | undefined {
	const key = species?.toLowerCase().trim();
	if (!key) return undefined;
	return plantCareBySpecies[key] ?? plantCareBySpecies[ALIASES[key]];
}

// Resuelve cuidados desde una especie estructurada (PlantSpecies): prueba el
// nombre de display y, si no, el científico (lo que devuelve Pl@ntNet).
export function getPlantCareForSpecies(
	species: { name: string; scientific?: string } | undefined
): PlantCare | undefined {
	if (!species) return undefined;
	return getPlantCare(species.name) ?? getPlantCare(species.scientific ?? '');
}
