import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getActiveListingsBySeller, getListingByPublicId } from '$lib/listings/query';
import { listingPath, parseListingRef, slugIsStale } from '$lib/listings/ref';

// Cuántos anuncios del mismo vendedor se enseñan en el detalle.
const MAX_SELLER_LISTINGS = 8;

// El detalle se resuelve por el número público que va al final de la URL. Un
// parámetro que no termina en número, o un número que no existe, es un 404; un
// slug que ya no coincide con el título se corrige con un 301 permanente para
// que los enlaces compartidos antiguos sigan llevando al anuncio.
export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
	const ref = parseListingRef(params.slug);
	if (!ref) throw error(404, 'Anuncio no encontrado');

	const listing = await getListingByPublicId(supabase, ref.publicId);
	if (!listing) throw error(404, 'Anuncio no encontrado');

	if (slugIsStale(ref, listing.title)) {
		throw redirect(301, listingPath(listing.title, listing.publicId));
	}

	const sellerListings = await getActiveListingsBySeller(supabase, listing.sellerId, listing.id);

	return {
		listing,
		sellerListings: sellerListings.slice(0, MAX_SELLER_LISTINGS)
	};
};
