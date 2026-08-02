import type { Category } from "./posts";

const CATEGORY_LABELS: Record<Category, string> = {
	guias: "Guías",
	noticias: "Noticias",
	comunidad: "Comunidad",
};

const dateFormatter = new Intl.DateTimeFormat("es-ES", {
	day: "numeric",
	month: "long",
	year: "numeric",
});

export function formatDate(date: string): string {
	const d = new Date(date);
	return Number.isNaN(d.getTime()) ? "" : dateFormatter.format(d);
}

export function categoryLabel(category: Category): string {
	return CATEGORY_LABELS[category];
}

export function escapeXml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}
