import type { Category } from "./posts";

const CATEGORY_LABELS: Record<Category, string> = {
	guias: "Guías",
	noticias: "Noticias",
	comunidad: "Comunidad",
};

export function formatDate(date: string): string {
	const d = new Date(date);
	if (Number.isNaN(d.getTime())) return "";
	return `${d.getDate()}/${d.getMonth() + 1}/${String(d.getFullYear()).slice(-2)}`;
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
