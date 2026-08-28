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

export function getPlantCare(species: string): PlantCare | undefined {
	return plantCareBySpecies[species?.toLowerCase().trim()];
}
