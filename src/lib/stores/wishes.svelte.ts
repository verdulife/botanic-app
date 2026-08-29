// Deseos del usuario en memoria (mock), patrón `favorites`.
// Se siembra con los deseos de ejemplo; `add` prepara al principio de la lista.

import { mockWishes, type Wish } from '$lib/mock/wishes';

class WishesState {
	list = $state<Wish[]>(mockWishes);

	add = (wish: Wish) => {
		this.list = [wish, ...this.list];
	};

	toggleAlert = (id: string) => {
		this.list = this.list.map((w) => (w.id === id ? { ...w, alert: !w.alert } : w));
	};
}

export const wishes = new WishesState();