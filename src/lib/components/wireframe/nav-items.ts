import { Heart, Plus, Sprout, Store, Users } from "lucide-svelte/icons";

export type NavItem = {
	label: string;
	href: string;
	icon: typeof Sprout;
	match: (path: string) => boolean;
	soon?: boolean;
	action?: boolean;
};

export const primaryNavItems: NavItem[] = [
	{
		label: "Inicio",
		href: "/app",
		icon: Sprout,
		match: (p) =>
			p === "/app" ||
			p === "/app/" ||
			p.startsWith("/app/anuncios") ||
			p.startsWith("/app/anuncio") ||
			p.startsWith("/app/publicar") ||
			p.startsWith("/app/mis-anuncios") ||
			p.startsWith("/app/guardados") ||
			p.startsWith("/app/compras") ||
			p.startsWith("/app/ventas") ||
			p.startsWith("/app/buscar") ||
			p.startsWith("/app/mapa")
	},
	{
		label: "Deseos",
		href: "/app/deseos",
		icon: Heart,
		match: (p) => p.startsWith("/app/deseo")
	},
	{
		label: "Anunciar",
		href: "/app/publicar",
		icon: Plus,
		match: () => false,
		action: true
	},
	{
		label: "Comunidad",
		href: "/app/comunidad",
		icon: Users,
		match: (p) =>
			p.startsWith("/app/comunidad") ||
			p.startsWith("/app/hilo") ||
			p.startsWith("/app/mis-publicaciones")
	},
	{
		label: "Market",
		href: "/app/market",
		icon: Store,
		match: (p) => p.startsWith("/app/market"),
		soon: true
	}
];

/**
 * Tabs que aparecen en el header (desktop).
 * Excluye "Inicio" porque el logo y la búsqueda ya llevan a `/app`.
 * Excluye items con `action: true` (Anunciar) porque en desktop vive como botón CTA propio.
 * El bottom nav móvil sí muestra los 5 items.
 */
export const headerNavItems: NavItem[] = primaryNavItems.filter(
	(item) => item.label !== "Inicio" && !item.action
);
