import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getActiveListings } from '$lib/listings/query';

// El scroll se lee de la base. Si la consulta falla, la página falla con un 500:
// un error de base no puede parecer un mercado sin anuncios.
export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	try {
		return { listings: await getActiveListings(supabase) };
	} catch (cause) {
		console.error('[scroll] No se pudieron cargar los anuncios:', cause);
		throw error(500, 'No se pudieron cargar los anuncios');
	}
};
