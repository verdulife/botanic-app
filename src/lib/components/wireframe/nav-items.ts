import { Bell, Heart, Plus, Sprout, User } from 'lucide-svelte/icons';

export type NavItem = {
	label: string;
	href: string;
	icon: typeof Sprout;
	match: (path: string) => boolean;
	soon?: boolean;
	action?: boolean;
};

const MI_BOTANIC_PREFIXES = [
	'/app/mi-botanic',
	'/app/perfil',
	'/app/mis-anuncios',
	'/app/borradores',
	'/app/compras',
	'/app/ventas',
	'/app/chat',
	'/app/deseos',
	'/app/deseo',
	'/app/mis-publicaciones',
	'/app/ajustes'
];

export const primaryNavItems: NavItem[] = [
	{
		label: 'Inicio',
		href: '/app',
		icon: Sprout,
		match: (p) =>
			p === '/app' ||
			p === '/app/' ||
			p.startsWith('/app/anuncios') ||
			p.startsWith('/app/anuncio') ||
			p.startsWith('/app/buscar') ||
			p.startsWith('/app/mapa') ||
			p.startsWith('/app/scroll')
	},
	{
		label: 'Favoritos',
		href: '/app/favoritos',
		icon: Heart,
		match: (p) => p.startsWith('/app/favoritos')
	},
	{
		label: 'Anunciar',
		href: '/app/publicar',
		icon: Plus,
		match: (p) => p.startsWith('/app/publicar')
	},
	{
		label: 'Buzón',
		href: '/app/notificaciones',
		icon: Bell,
		match: (p) => p.startsWith('/app/notificaciones')
	},
	{
		label: 'Mi Botanic',
		href: '/app/mi-botanic',
		icon: User,
		match: (p) => MI_BOTANIC_PREFIXES.some((prefix) => p.startsWith(prefix))
	}
];

/**
 * Tabs que aparecen en el header (desktop).
 * Excluye "Inicio" porque el logo y la búsqueda ya llevan a `/app`.
 * En esta versión el header NO muestra tabs (UX § 3 — el header solo lleva Logo + Search + 🔔).
 * Se conserva la constante por si en futuro se reintroducen tabs desktop.
 */
export const headerNavItems: NavItem[] = primaryNavItems.filter(
	(item) => item.label !== 'Inicio' && !item.action
);