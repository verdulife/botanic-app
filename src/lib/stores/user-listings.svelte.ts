// Anuncios publicados por el usuario en memoria (mock), patrón `wishes`.
// Se siembra vacío; `add` prepone el anuncio recién creado para que el detalle
// pueda resolverlo mientras no exista persistencia real.

import type { Listing } from '$lib/mock/listings';

class UserListingsState {
	list = $state<Listing[]>([]);

	add = (listing: Listing) => {
		this.list = [listing, ...this.list];
	};

	getById = (id: string): Listing | undefined => {
		return this.list.find((l) => l.id === id);
	};
}

export const userListings = new UserListingsState();