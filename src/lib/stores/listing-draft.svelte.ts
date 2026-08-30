// Borradores del formulario de publicación (localStorage).
// Persisten entre sesiones y permiten retomar un anuncio sin publicar.
// Post-wireframe migrarán a Supabase (tabla `drafts` + storage de imágenes).

import { browser } from '$app/environment';
import type { ListingType } from '$lib/mock/listings';

export type ListingDraft = {
	id: string;
	savedAt: string;
	category: string;
	plantSize: string;
	images: string[];
	title: string;
	type: ListingType[];
	price: string;
	speciesInput: string;
	speciesMeta: {
		scientific?: string;
		genus?: string;
		family?: string;
		confidence?: number;
	} | null;
	description: string;
	locationInput: string;
};

const KEY = 'botanic_publicar_draft';

class ListingDraftState {
	list = $state<ListingDraft[]>([]);
	#loaded = false;

	load() {
		if (!browser || this.#loaded) return;
		this.#loaded = true;
		try {
			const raw = localStorage.getItem(KEY);
			const arr = raw ? (JSON.parse(raw) as ListingDraft[]) : [];
			this.list = Array.isArray(arr) ? arr : [];
		} catch {
			this.list = [];
		}
	}

	persist() {
		if (browser) localStorage.setItem(KEY, JSON.stringify(this.list));
	}

	save(draft: ListingDraft) {
		const i = this.list.findIndex((d) => d.id === draft.id);
		if (i >= 0) {
			this.list[i] = draft;
		} else {
			this.list = [draft, ...this.list];
		}
		this.persist();
	}

	remove(id: string) {
		this.list = this.list.filter((d) => d.id !== id);
		this.persist();
	}

	get(id: string): ListingDraft | undefined {
		return this.list.find((d) => d.id === id);
	}

	get mostRecent(): ListingDraft | null {
		return this.list[0] ?? null;
	}
}

export const listingDraft = new ListingDraftState();