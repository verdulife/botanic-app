<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { page } from '$app/state';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { X } from 'lucide-svelte/icons';
	import { mockListings } from '$lib/mock/listings';
	import {
		applyFiltersAndSort,
		defaultFilters,
		type Filters
	} from '$lib/mock/filters';
	import {
		readFiltersFromSearchParams,
		pushFiltersToURL
	} from '$lib/mock/url-filters';
	import FiltersPanel from '$lib/components/wireframe/FiltersPanel.svelte';
	import { MapPin } from 'lucide-svelte/icons';

	let filters = $derived<Filters>(
		readFiltersFromSearchParams(page.url.searchParams)
	);

	let listings = $derived(applyFiltersAndSort(mockListings, filters));

	let mobileFiltersOpen = $state(false);
	let mobileDraft = $state<Filters>(defaultFilters);
	let prevMobileOpen = $state(false);

	onMount(() => {
		const handler = () => (mobileFiltersOpen = !mobileFiltersOpen);
		window.addEventListener('botanic:filter-toggle', handler);
		return () => window.removeEventListener('botanic:filter-toggle', handler);
	});

	$effect(() => {
		if (typeof document === 'undefined') return;
		const html = document.documentElement;
		html.style.overflow = mobileFiltersOpen ? 'hidden' : '';
		return () => {
			html.style.overflow = '';
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

	function clearFilters() {
		updateFilters(defaultFilters);
		mobileDraft = $state.snapshot(defaultFilters);
		mobileFiltersOpen = false;
	}
</script>

<svelte:head>
	<title>Inicio · Botanic</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="flex w-full flex-col">
	<!-- Filtro sidebar fijo (solo desktop) -->
	<aside class="fixed top-[80px] bottom-0 left-8 z-30 hidden w-72 lg:top-[104px] lg:block">
		<Card.Root class="flex h-full flex-col overflow-hidden rounded-none border-0 bg-transparent shadow-none ring-0 [--card-spacing:0px]">
			<Card.Content class="flex-1 overflow-y-auto pt-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
				<FiltersPanel {filters} onChange={updateFilters} />
			</Card.Content>
		</Card.Root>
	</aside>

	<!-- Contenido principal -->
	<div class="flex flex-col gap-6 px-4 pt-16 sm:px-6 md:pt-24 lg:flex-row lg:px-8">
		<div class="flex flex-1 flex-col gap-6 lg:ml-80">
			<!-- GRID -->
			{#if listings.length === 0}
				<Card.Root class="border-dashed">
					<Card.Content class="flex flex-col items-center gap-2 py-12 text-center">
						<p class="text-muted-foreground text-sm">
							No hay anuncios que coincidan con los filtros.
						</p>
						<Button onclick={clearFilters} variant="outline" size="sm">
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
									{#if listing.type === 'regalar'}
										<Badge
											variant="default"
											class="absolute top-2 left-2 text-[10px] tracking-wider uppercase"
										>
											Regalo
										</Badge>
									{:else if listing.type === 'cambiar'}
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

<!-- Overlay de filtros (mobile, full-viewport) -->
{#if mobileFiltersOpen}
	<div
		transition:fly={{ x: -1000, duration: 280, opacity: 1 }}
		class="bg-card fixed inset-0 z-40 flex flex-col lg:hidden"
	>
		<div class="flex items-center justify-between border-b p-3 sm:p-4">
			<h2 class="font-display text-lg">Filtrar</h2>
			<button
				type="button"
				onclick={() => (mobileFiltersOpen = false)}
				class="text-muted-foreground hover:text-foreground flex size-9 items-center justify-center rounded-full transition-colors"
				aria-label="Cerrar filtros"
			>
				<X class="size-5" />
			</button>
		</div>
		<div class="scrollbar-hide flex-1 overflow-y-auto p-4">
			<FiltersPanel
				filters={mobileDraft}
				onChange={(next) => Object.assign(mobileDraft, next)}
			/>
		</div>
		<div class="border-border flex flex-col gap-2 border-t p-4">
			<Button onclick={applyMobileDraft} class="w-full" size="lg">
				Aplicar filtros
			</Button>
			<Button onclick={clearFilters} variant="ghost" class="w-full" size="sm">
				Limpiar filtros
			</Button>
		</div>
	</div>
{/if}