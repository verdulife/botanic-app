class FavoritesState {
	ids = $state<Set<string>>(new Set());

	isFavorite = (id: string) => this.ids.has(id);

	toggle = (id: string) => {
		if (this.ids.has(id)) {
			this.ids.delete(id);
		} else {
			this.ids.add(id);
		}
		// Reasignar para que el rune detecte el cambio en clientes `$derived`.
		this.ids = new Set(this.ids);
	};
}

export const favorites = new FavoritesState();