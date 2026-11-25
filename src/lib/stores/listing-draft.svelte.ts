// Borradores del formulario de publicación (localStorage).
// Persisten entre sesiones y permiten retomar un anuncio sin publicar.
// Las fotos se guardan como vista previa en data URL: es el fichero ya comprimido,
// así que un borrador recuperado puede volver a publicarse sin la imagen original.

import { browser } from '$app/env';
import type { ListingType } from '$lib/listings/types';

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
		if (!browser) return;
		// Cinco fotos comprimidas se acercan al tope del almacén del navegador: un
		// borrador que no cabe se pierde, pero no puede tumbar el formulario.
		try {
			localStorage.setItem(KEY, JSON.stringify(this.list));
		} catch (err) {
			console.warn('[borradores] no se pudo guardar el borrador:', err);
		}
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