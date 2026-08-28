<script lang="ts">
	import { page } from '$app/state';
	import FiltersPanel from "$lib/components/wireframe/FiltersPanel.svelte";
	import { Input } from "$lib/components/ui/input";
	import { Button } from "$lib/components/ui/button";
	import * as Select from "$lib/components/ui/select";
	import { mockListings, sortOptions, type SortOption } from "$lib/mock/listings";
	import { type Filters } from "$lib/mock/filters";
	import { readVista, pushVistaToURL, type Vista } from "$lib/mock/url-filters";
	import { searchOverlay } from "../../stores/search-overlay.svelte.ts";
	import { goto } from "$app/navigation";
	import {
		LayoutList,
		Map,
		GalleryVertical,
		Search,
		LayoutGrid,
		MapPin
	} from "lucide-svelte/icons";

	const vistaItems: { value: Vista; label: string; route: string; icon: typeof LayoutList }[] =
		[
			{ value: "lista", label: "Lista", route: "/app", icon: LayoutList },
			{ value: "mapa", label: "Mapa", route: "/app/mapa", icon: Map },
			{ value: "scroll", label: "Scroll", route: "/app/scroll", icon: GalleryVertical }
		];

	const CATEGORY_ICON = LayoutGrid;

	type Suggestion =
		| { kind: "listing"; id: string; title: string; price: number; image: string }
		| { kind: "categoria"; label: string }
		| { kind: "ubicacion"; label: string };

	type Props = {
		filters: Filters;
		onChange: (next: Filters) => void;
	};

	let { filters, onChange }: Props = $props();

	let currentVista = $derived<Vista>(
		readVista(page.url.searchParams, page.url.pathname)
	);

	let suggestions = $derived.by(() => {
		const q = filters.termino.trim().toLowerCase();
		const out: Suggestion[] = [];
		const pushListing = (l: (typeof mockListings)[number]) => {
			if (out.some((s) => s.kind === "listing" && s.id === l.id)) return;
			if (q && !l.title.toLowerCase().includes(q)) return;
			out.push({
				kind: "listing",
				id: l.id,
				title: l.title,
				price: l.price,
				image: l.images[0]
			});
		};
		const pushCategoria = (label: string) => {
			if (out.some((s) => s.kind === "categoria" && s.label === label)) return;
			if (q && !label.toLowerCase().includes(q)) return;
			out.push({ kind: "categoria", label });
		};
		const pushUbicacion = (label: string) => {
			if (out.some((s) => s.kind === "ubicacion" && s.label === label)) return;
			if (q && !label.toLowerCase().includes(q)) return;
			out.push({ kind: "ubicacion", label });
		};

		for (const l of mockListings) {
			pushListing(l);
			pushUbicacion(l.location);
			pushCategoria(l.category);
			if (out.length >= 6) return out;
		}
		return out;
	});

	function patch(partial: Partial<Filters>) {
		onChange({ ...filters, ...partial });
	}

	function changeVista(route: string) {
		searchOverlay.closeSearch();
		pushVistaToURL(route);
	}

	function applySuggestion(s: Suggestion) {
		searchOverlay.closeSearch();
		if (s.kind === "listing") {
			goto(`/app/anuncio/${s.id}`);
			return;
		}
		if (s.kind === "categoria") {
			patch({ categoria: s.label });
		} else {
			patch({ ubicacion: s.label });
		}
	}

	function confirmSearch() {
		searchOverlay.closeSearch();
	}
</script>

<div class="mx-auto flex w-full max-w-xl flex-col gap-3 p-3 sm:p-4">
	<!-- Grupo 1: selector de vista (3 pills, icono / texto) -->
	<div class="flex gap-2">
		{#each vistaItems as item (item.value)}
			<button
				type="button"
				onclick={() => changeVista(item.route)}
				class={[
					'bg-card border-border flex flex-1 items-center justify-center gap-2 rounded-full border px-3 py-2.5 transition-colors',
					currentVista === item.value
						? 'bg-still-500/15 text-foreground'
						: 'text-muted-foreground hover:bg-muted'
				].join(' ')}
				aria-pressed={currentVista === item.value}
			>
				<item.icon class="size-5" />
				<span class="text-sm font-medium">{item.label}</span>
			</button>
		{/each}
	</div>

	<!-- Grupo 2: búsqueda por término + autocomplete -->
	<div class="bg-card flex h-[40dvh] flex-col gap-2 rounded-2xl border border-border px-4 pt-4">
		<p class="text-base font-medium">¿Qué estás buscando?</p>
		<div class="relative">
			<Search
				class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2"
			/>
			<Input
				class="h-12 pl-10"
				type="search"
				placeholder="Buscar plantas, esquejes, ubicaciones…"
				value={filters.termino}
				oninput={(e) =>
					patch({ termino: (e.currentTarget as HTMLInputElement).value })}
				onkeydown={(e) => {
					if (e.key === "Enter") {
						e.preventDefault();
						confirmSearch();
					}
				}}
			/>
		</div>
		{#if suggestions.length > 0}
			<div class="relative mt-1 flex min-h-0 flex-1 flex-col">
				<ul class="scrollbar-hide flex min-h-0 flex-1 flex-col overflow-y-auto">
					{#each suggestions as s (s.kind === "listing" ? s.id : s.label)}
						<li>
							<button
								type="button"
								onclick={() => applySuggestion(s)}
								class="text-foreground hover:bg-muted flex w-full items-center gap-3 rounded-lg px-1 py-2 text-left transition-colors"
							>
								{#if s.kind === "listing"}
									<img
										src={s.image}
										alt={s.title}
										class="bg-muted size-11 shrink-0 rounded-md object-cover"
										loading="lazy"
									/>
								{:else if s.kind === "categoria"}
									<span
										class="bg-muted text-muted-foreground flex size-11 shrink-0 items-center justify-center rounded-md"
									>
										<LayoutGrid class="size-5" />
									</span>
								{:else}
									<span
										class="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-md"
									>
										<MapPin class="size-5" />
									</span>
								{/if}
								<span class="flex min-w-0 flex-1 flex-col">
									<span class="truncate text-sm font-medium">
										{s.kind === "listing" ? s.title : s.label}
									</span>
									{#if s.kind === "listing"}
										<span class="text-muted-foreground text-xs tabular-nums">
											{s.price} €
										</span>
									{:else if s.kind === "categoria"}
										<span class="text-muted-foreground text-xs">Categoría</span>
									{:else}
										<span class="text-muted-foreground text-xs">Ubicación</span>
									{/if}
								</span>
							</button>
						</li>
					{/each}
				</ul>
				<div
					class="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-card to-transparent"
					aria-hidden="true"
				></div>
			</div>
		{/if}
	</div>

	<!-- Grupo 3: ordenado -->
	<div class="bg-card flex flex-col gap-2 rounded-2xl border border-border p-4">
		<p class="text-base font-medium">Ordenar por</p>
		<Select.Root
			type="single"
			value={filters.sort}
			onValueChange={(v) => patch({ sort: v as SortOption })}
		>
			<Select.Trigger class="h-12 w-full">
				<Select.Value class="capitalize" />
			</Select.Trigger>
			<Select.Content class="border-border/50">
				{#each sortOptions as opt}
					<Select.Item value={opt.value} label={opt.label} />
				{/each}
			</Select.Content>
		</Select.Root>
		<Button class="mt-1 h-12 w-full" onclick={confirmSearch}>Aplicar</Button>
	</div>

	<!-- Grupo 4: filtros -->
	<div class="bg-card flex flex-col rounded-2xl border border-border px-4 pt-2 pb-4">
		<FiltersPanel {filters} {onChange} showSort={false} />
		<Button class="h-12 w-full" onclick={confirmSearch}>Aplicar</Button>
	</div>
</div>
