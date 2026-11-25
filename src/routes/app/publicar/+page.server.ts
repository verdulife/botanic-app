import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { LOCATIONS } from '$lib/mock/seed-data';
import { listingPath } from '$lib/listings/ref';
import { createListing, getCategories, parseListingForm } from '$lib/listings/write';

// Publicar es una escritura real: el formulario necesita la sesión para firmar
// el anuncio (`seller_id = auth.uid()`) y las categorías de la base para poder
// validar la elegida.
const LOGIN_REDIRECT = '/app/login?next=/app/publicar';
const WRITE_ERROR = 'No se pudo publicar el anuncio. Inténtalo de nuevo.';

export const load: PageServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
	const { user } = await safeGetSession();
	if (!user) throw redirect(303, LOGIN_REDIRECT);

	let categories;
	try {
		categories = await getCategories(supabase);
	} catch (cause) {
		console.error('[publicar] No se pudieron cargar las categorías:', cause);
		throw error(500, 'No se pudo preparar el formulario');
	}

	// Las ubicaciones son el vocabulario de barrios con el que se siembra la base:
	// elegir una aporta sus coordenadas al anuncio.
	return { categories, locations: LOCATIONS };
};

export const actions: Actions = {
	default: async ({ request, locals: { safeGetSession, supabase } }) => {
		const { user } = await safeGetSession();
		if (!user) throw redirect(303, LOGIN_REDIRECT);

		const formData = await request.formData();

		// La categoría se valida contra la tabla, no contra lo que diga el formulario.
		let categories;
		try {
			categories = await getCategories(supabase);
		} catch (cause) {
			console.error('[publicar] No se pudieron leer las categorías al publicar:', cause);
			return fail(500, { error: WRITE_ERROR });
		}

		const parsed = parseListingForm(formData, {
			sellerId: user.id,
			categories,
			locations: LOCATIONS
		});

		// Un fallo de validación dice qué falta; el formulario ya está relleno.
		if (!parsed.ok) return fail(400, { error: parsed.error });

		let created;
		try {
			created = await createListing(supabase, parsed.value);
		} catch (cause) {
			// El detalle (qué paso falló, qué anuncio quedó a medias) se queda en el
			// log: al visitante no se le filtran mensajes internos de la base.
			console.error('[publicar] No se pudo escribir el anuncio:', cause);
			return fail(500, { error: WRITE_ERROR });
		}

		// El detalle canónico es `/app/anuncio/<slug>-<public_id>`: el número manda.
		throw redirect(303, listingPath(created.title, created.publicId));
	}
};
