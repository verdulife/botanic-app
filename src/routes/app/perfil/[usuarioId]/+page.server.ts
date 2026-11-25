import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getActiveListingsBySeller, getProfileByUsername } from '$lib/listings/query';

// La URL lleva el nombre de usuario, no el uuid: es lo que se comparte y lo que
// sale en los enlaces. El uuid que necesitan los anuncios sale del propio perfil.
// Un nombre que no existe es un 404; un error de base no, porque un fallo de la
// consulta no es un usuario ausente.
export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
	const seller = await getProfileByUsername(supabase, params.usuarioId);
	if (!seller) throw error(404, 'Usuario no encontrado');

	const listings = await getActiveListingsBySeller(supabase, seller.id);

	// `seller` y no `profile`: el layout ya devuelve `profile` con la sesión de
	// quien mira, y la página lo sobrescribiría.
	return { seller, listings };
};
