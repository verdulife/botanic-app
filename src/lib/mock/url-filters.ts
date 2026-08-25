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

export function pushFiltersToURL(filters: Filters, base = "/app"): Promise<void> {
	const url = buildFiltersURL(filters, base);
	return goto(url, { replaceState: true, keepFocus: true, noScroll: true });
}
