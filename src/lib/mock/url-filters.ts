import { goto } from "$app/navigation";
import { defaultFilters, type Filters } from "./filters";
import {
	RADIO_MAX,
	RADIO_MIN,
	type ListingType,
	type PublishedOption,
	type SortOption
} from "./listings";

const validSorts: SortOption[] = [
	"distancia",
	"relevancia",
	"novedad",
	"precio-desc",
	"precio-asc"
];

const validPublished: PublishedOption[] = ["hoy", "semana", "mes", "cualquiera"];

const validTypes: ListingType[] = ["vender", "cambiar", "regalar"];

// ──────────────────────────────────────────────────────────
// Vista (modo de presentación del P2P)
// ──────────────────────────────────────────────────────────

export type Vista = "lista" | "mapa" | "match";

export const VISTA_DEFAULT: Vista = "lista";

const validVistas: Vista[] = ["lista", "mapa", "match"];

function isVista(v: string | null): v is Vista {
	return v !== null && validVistas.includes(v as Vista);
}

/**
 * Resuelve la vista activa. La ruta es la fuente de verdad; el URL param `?vista=`
 * solo se consulta como fallback para links antiguos.
 */
export function readVista(searchParams: URLSearchParams, pathname?: string): Vista {
	if (pathname) {
		const normalized = pathname.replace(/\/+$/, "") || "/";
		if (normalized === "/app") return "lista";
		if (normalized.startsWith("/app/mapa")) return "mapa";
		if (normalized.startsWith("/app/match")) return "match";
	}
	const v = searchParams.get("vista");
	return isVista(v) ? v : VISTA_DEFAULT;
}

// ──────────────────────────────────────────────────────────
// Filters
// ──────────────────────────────────────────────────────────

function isSort(v: string | null): v is SortOption {
	return v !== null && validSorts.includes(v as SortOption);
}

function isPublished(v: string | null): v is PublishedOption {
	return v !== null && validPublished.includes(v as PublishedOption);
}

function parseTypes(v: string | null): ListingType[] {
	if (!v) return [];
	return v
		.split(",")
		.map((s) => s.trim())
		.filter((s): s is ListingType =>
			validTypes.includes(s as ListingType)
		);
}

export function readFiltersFromSearchParams(
	searchParams: URLSearchParams
): Filters {
	const categoria = searchParams.get("categoria") ?? defaultFilters.categoria;
	const ubicacion = searchParams.get("ubicacion") ?? "";
	const publicadoRaw = searchParams.get("publicado");
	const publicado: PublishedOption = isPublished(publicadoRaw)
		? publicadoRaw
		: defaultFilters.publicado;
	const radioRaw = searchParams.get("radio");
	const radioNum = radioRaw !== null ? Number(radioRaw) : defaultFilters.radio;
	const radio =
		Number.isFinite(radioNum) && radioNum >= RADIO_MIN && radioNum <= RADIO_MAX
			? radioNum
			: defaultFilters.radio;
	const precioMinRaw = searchParams.get("precioMin");
	const precioMaxRaw = searchParams.get("precioMax");
	const precioMin = precioMinRaw !== null ? Number(precioMinRaw) : defaultFilters.precioMin;
	const precioMax = precioMaxRaw !== null ? Number(precioMaxRaw) : defaultFilters.precioMax;
	const tipo = parseTypes(searchParams.get("tipo"));
	const sortRaw = searchParams.get("sort");
	const sort: SortOption = isSort(sortRaw) ? sortRaw : defaultFilters.sort;

	return {
		categoria,
		ubicacion,
		publicado,
		radio,
		precioMin: Number.isFinite(precioMin) ? precioMin : defaultFilters.precioMin,
		precioMax: Number.isFinite(precioMax) ? precioMax : defaultFilters.precioMax,
		tipo,
		sort
	};
}

function toSearchParams(filters: Filters): URLSearchParams {
	const sp = new URLSearchParams();
	if (filters.categoria !== defaultFilters.categoria)
		sp.set("categoria", filters.categoria);
	if (filters.ubicacion.trim()) sp.set("ubicacion", filters.ubicacion);
	if (filters.publicado !== defaultFilters.publicado)
		sp.set("publicado", filters.publicado);
	if (filters.radio !== defaultFilters.radio)
		sp.set("radio", String(filters.radio));
	if (filters.precioMin !== defaultFilters.precioMin)
		sp.set("precioMin", String(filters.precioMin));
	if (filters.precioMax !== defaultFilters.precioMax)
		sp.set("precioMax", String(filters.precioMax));
	if (filters.tipo.length > 0) sp.set("tipo", filters.tipo.join(","));
	if (filters.sort !== defaultFilters.sort) sp.set("sort", filters.sort);
	return sp;
}

export function buildFiltersURL(filters: Filters, base = "/app"): string {
	const sp = toSearchParams(filters);
	const qs = sp.toString();
	return qs ? `${base}?${qs}` : base;
}

/**
 * Push filters preserving current path. Si no se pasa `base`, usa
 * `window.location.pathname` para mantener la ruta del P2P (lista/mapa/match).
 */
export function pushFiltersToURL(filters: Filters, base?: string): Promise<void> {
	const route =
		base ?? (typeof window !== "undefined" ? window.location.pathname : "/app");
	const url = buildFiltersURL(filters, route);
	return goto(url, { replaceState: true, keepFocus: true, noScroll: true });
}

/**
 * Navega a la ruta de la vista preservando los filtros activos.
 * La vista ya queda implícita en la ruta (`/app`, `/app/mapa`, `/app/match`).
 */
export function pushVistaToURL(targetRoute: string): Promise<void> {
	const current = new URLSearchParams(
		typeof window !== "undefined" ? window.location.search : ""
	);
	const filters = readFiltersFromSearchParams(current);
	return goto(buildFiltersURL(filters, targetRoute), {
		replaceState: true,
		keepFocus: true,
		noScroll: true
	});
}
