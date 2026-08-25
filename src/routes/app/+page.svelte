<script lang="ts">
	import { page } from "$app/state";
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { Map, Heart, SlidersHorizontal, MapPin, X } from "lucide-svelte/icons";
	import { mockListings, categories } from "$lib/mock/listings";
	import {
		applyFiltersAndSort,
		defaultFilters,
		type Filters
	} from "$lib/mock/filters";
	import {
		readFiltersFromSearchParams,
		pushFiltersToURL
	} from "$lib/mock/url-filters";
	import FiltersPanel from "$lib/components/wireframe/FiltersPanel.svelte";

	let filters = $derived<Filters>(
		readFiltersFromSearchParams(page.url.searchParams)
	);

	let listings = $derived(applyFiltersAndSort(mockListings, filters));

	let mobileFiltersOpen = $state(false);
	let mobileDraft = $state<Filters>(defaultFilters);
	let prevMobileOpen = $state(false);

	$effect(() => {
		if (typeof document === "undefined") return;
		const html = document.documentElement;
		html.style.overflow = mobileFiltersOpen ? "hidden" : "";
		return () => {
			html.style.overflow = "";
		};
	});

	$effect(() => {
		if (mobileFiltersOpen && !prevMobileOpen) {
			Object.assign(mobileDraft, $state.snapshot(filters));
		}
		prevMobileOpen = mobileFiltersOpen;
	});

	function updateFilters(next: Filters) {
		pushFiltersToURL(next);
	}

	function applyMobileDraft() {
		updateFilters(mobileDraft);
		mobileFiltersOpen = false;
	}

	function selectCategory(cat: string) {
		updateFilters({ ...filters, categoria: cat });
	}

	function clearCategoryFilter() {
		updateFilters({ ...filters, categoria: defaultFilters.categoria });
	}
</script>

<svelte:head>
	<title>Inicio · Botanic</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="flex w-full flex-col">
	<!-- Segunda línea del header: categorías (desktop) + botones (siempre) -->
	<div
		class="border-border bg-card sticky top-14 z-10 border-b md:top-16"
	>
		<div
			class="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8"
		>
			<!-- Categorías: solo desktop (en móvil están dentro del modal de filtros) -->
			<nav
				class="hidden min-w-0 flex-1 md:block"
				aria-label="Categorías"
			>
				<div class="scrollbar-hide flex gap-2 overflow-x-auto">
					{#each categories as cat}
						<button
							onclick={() => selectCategory(cat)}
							type="button"
							class="shrink-0"
						>
							<Badge
								variant={filters.categoria === cat ? "default" : "secondary"}
								class="cursor-pointer whitespace-nowrap rounded-full px-3.5 py-1 text-xs"
							>
								{cat}
							</Badge>
						</button>
					{/each}
				</div>
			</nav>

			<!-- Botones: Filtrar a la izquierda, Modo mapa + Guardados agrupados a la derecha -->
			<div
				class="flex w-full items-center justify-between gap-2 lg:w-auto"
			>
				<!-- Filtrar: solo móvil (en desktop está el sidebar) -->
				<Button
					onclick={() => (mobileFiltersOpen = !mobileFiltersOpen)}
					variant={mobileFiltersOpen ? "default" : "outline"}
					size="sm"
					class="gap-1.5 lg:hidden"
					aria-expanded={mobileFiltersOpen}
				>
					<SlidersHorizontal class="size-3.5" />
					Filtrar
				</Button>

				<div class="flex items-center gap-2">
					<Button href="/app/mapa" variant="outline" size="sm" class="gap-1.5">
						<Map class="size-3.5" />
						Modo mapa
					</Button>
					<Button href="/app/guardados" variant="ghost" size="sm" class="gap-1.5">
						<Heart class="size-3.5" />
						Guardados
					</Button>
				</div>
			</div>
		</div>

		<!-- Panel de filtros inline (solo mobile) -->
		<div
			class="grid transition-[grid-template-rows] duration-300 ease-out lg:hidden"
			style:grid-template-rows={mobileFiltersOpen ? "1fr" : "0fr"}
			inert={!mobileFiltersOpen}
		>
			<div class="overflow-hidden">
				<div class="border-border bg-card border-t">
					<div
						class="flex max-h-[calc(100dvh-3.5rem-4rem-3.25rem)] flex-col"
					>
						<div class="flex-1 overflow-y-auto p-4">
							<FiltersPanel
								filters={mobileDraft}
								onChange={(next) => Object.assign(mobileDraft, next)}
							/>
						</div>
						<div class="border-border bg-card border-t p-4">
							<Button onclick={applyMobileDraft} class="w-full" size="lg">
								Aplicar filtros
							</Button>
</div>
	</div>
			</div>
		</div>
	</div>
</div>

<!-- Filtro sidebar fijo (solo desktop) -->
<aside class="fixed top-[116px] bottom-0 left-8 z-30 hidden w-72 lg:block">
	<Card.Root class="flex h-full flex-col overflow-hidden rounded-none border-0 bg-transparent shadow-none ring-0 [--card-spacing:0px]">
		<Card.Content class="flex-1 overflow-y-auto pt-6 pr-0 pb-0 pl-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
			<FiltersPanel {filters} onChange={updateFilters} />
		</Card.Content>
	</Card.Root>
</aside>

<!-- Contenido principal -->
<div class="flex flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:flex-row lg:px-8">
	<!-- FEED principal -->
		<div class="flex flex-1 flex-col gap-6 lg:ml-80">
			<!-- Indicador de categoría activa (cuando hay filtro distinto a "Todas") -->
			{#if filters.categoria !== defaultFilters.categoria}
				<div class="flex items-center gap-2 text-sm">
					<span class="text-muted-foreground">Filtrando por:</span>
					<Badge variant="default" class="gap-1 rounded-full pr-1">
						{filters.categoria}
						<button
							onclick={clearCategoryFilter}
							type="button"
							class="hover:bg-primary-foreground/20 ml-1 rounded-full p-0.5"
							aria-label="Quitar filtro de categoría"
						>
							<X class="size-3" />
						</button>
					</Badge>
				</div>
			{/if}

			<!-- GRID -->
			{#if listings.length === 0}
				<Card.Root class="border-dashed">
					<Card.Content class="flex flex-col items-center gap-2 py-12 text-center">
						<p class="text-muted-foreground text-sm">
							No hay anuncios que coincidan con los filtros.
						</p>
						<Button
							onclick={() => updateFilters({ ...defaultFilters, sort: filters.sort })}
							variant="outline"
							size="sm"
						>
							Limpiar filtros
						</Button>
					</Card.Content>
				</Card.Root>
			{:else}
				<section
					aria-label="Anuncios"
					class="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4"
				>
					{#each listings as listing (listing.id)}
						<a
							href="/app/anuncio/{listing.id}"
							class="group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
						>
							<div class="flex flex-col">
								<div class="border-border bg-muted relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border transition-opacity group-hover:opacity-90">
									<span class="text-muted-foreground text-xs">Imagen</span>
									{#if listing.type === "regalar"}
										<Badge
											variant="default"
											class="absolute top-2 left-2 text-[10px] tracking-wider uppercase"
										>
											Regalo
										</Badge>
									{:else if listing.type === "cambiar"}
										<Badge
											variant="secondary"
											class="absolute top-2 left-2 text-[10px] tracking-wider uppercase"
										>
											Cambio
										</Badge>
									{/if}
								</div>
								<div class="flex flex-col gap-1 px-1 pt-2.5 pb-4">
									<div class="flex items-center justify-between">
										<span class="text-muted-foreground text-[10px] tracking-wider uppercase">
											{listing.category}
										</span>
										<span class="text-foreground text-sm font-semibold">
											{listing.price} €
										</span>
									</div>
									<span class="text-sm leading-snug font-medium">
										{listing.title}
									</span>
									<div class="text-muted-foreground flex items-center gap-1.5 text-xs">
										<span class="truncate">{listing.seller}</span>
										<span aria-hidden="true">·</span>
										<MapPin class="size-3" />
										<span class="truncate">{listing.location}</span>
									</div>
								</div>
							</div>
						</a>
					{/each}
				</section>
			{/if}
		</div>
	</div>
</div>

<style>
	.scrollbar-hide {
		scrollbar-width: none;
		-ms-overflow-style: none;
	}
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
</style>
