import type { CatalogSlot } from "./Catalog";

// Catálogo 9:16 de elementos reutilizables (intros, hooks, tips, quotes,
// outros, transiciones, endings). Cada slot vacío renderiza su placeholder;
// al aprobar un elemento se asigna su componente al slot.
export const catalogSlots: CatalogSlot[] = [
	{ id: "intro", label: "INTRO", frames: 75 },
	{ id: "hook", label: "HOOK", frames: 60 },
	{ id: "tip", label: "TIP", frames: 105 },
	{ id: "quote", label: "QUOTE", frames: 75 },
	{ id: "outro", label: "OUTRO", frames: 90 },
	{ id: "transicion", label: "TRANSICIÓN", frames: 30 },
	{ id: "ending", label: "ENDING", frames: 60 },
];
