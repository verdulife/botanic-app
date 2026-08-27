<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { page } from '$app/state';
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
	import ScrollCard from '$lib/components/wireframe/ScrollCard.svelte';
	import FiltersPanel from '$lib/components/wireframe/FiltersPanel.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Bookmark, ExternalLink, SkipForward, X } from 'lucide-svelte/icons';

	let filters = $derived<Filters>(
		readFiltersFromSearchParams(page.url.searchParams)
	);
	let listings = $derived(applyFiltersAndSort(mockListings, filters));

	let scrollerEl: HTMLDivElement | undefined = $state();
	let currentIndex = $state(0);

	let filterOpen = $state(false);
	let draft = $state<Filters>(defaultFilters);
	let prevFilterOpen = $state(false);

	onMount(() => {
		const handler = () => (filterOpen = !filterOpen);
		window.addEventListener('botanic:filter-toggle', handler);
		return () => window.removeEventListener('botanic:filter-toggle', handler);
	});

	$effect(() => {
		if (filterOpen && !prevFilterOpen) {
			draft = $state.snapshot(filters);
		}
		prevFilterOpen = filterOpen;
	});

	function gotoNext() {
		if (currentIndex < listings.length - 1) {
			const next = currentIndex + 1;
			currentIndex = next;
			const child = scrollerEl?.children[next] as HTMLElement | undefined;
			child?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	function onScroll() {
		if (!scrollerEl) return;
		const top = scrollerEl.scrollTop;
		const h = scrollerEl.clientHeight;
		const idx = Math.round(top / h);
		if (idx !== currentIndex) currentIndex = idx;
	}

	function applyFilters() {
		pushFiltersToURL(draft);
		filterOpen = false;
	}

	function clearFilters() {
		pushFiltersToURL(defaultFilters);
		draft = $state.snapshot(defaultFilters);
		filterOpen = false;
	}
</script>

<svelte:head>
	<title>Scroll · Botanic</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if filterOpen}
	<div
		transition:fly={{ x: -1000, duration: 280, opacity: 1 }}
		class="bg-card fixed inset-0 z-40 flex flex-col"
	>
		<div class="flex items-center justify-between border-b p-3 sm:p-4">
			<h2 class="font-display text-lg">Filtrar</h2>
			<button
				type="button"
				onclick={() => (filterOpen = false)}
				class="text-muted-foreground hover:text-foreground flex size-9 items-center justify-center rounded-full transition-colors"
				aria-label="Cerrar filtros"
			>
				<X class="size-5" />
			</button>
		</div>
		<div class="scrollbar-hide flex-1 overflow-y-auto p-4">
			<FiltersPanel
				filters={draft}
				onChange={(next) => Object.assign(draft, next)}
			/>
		</div>
		<div class="border-border flex flex-col gap-2 border-t p-4">
			<Button onclick={applyFilters} class="w-full" size="lg">
				Aplicar filtros
			</Button>
			<Button onclick={clearFilters} variant="ghost" class="w-full" size="sm">
				Limpiar filtros
			</Button>
		</div>
	</div>
{:else if listings.length === 0}
	<div class="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
		<p class="text-lg font-medium">No hay anuncios para Scroll</p>
		<p class="text-muted-foreground max-w-sm text-sm">
			Ajusta los filtros o vuelve a la Lista para explorar todos los anuncios.
		</p>
		<a
			href="/app"
			class="text-foreground text-sm font-medium underline-offset-4 hover:underline"
		>
			Volver a la Lista
		</a>
	</div>
{:else}
	<div
		bind:this={scrollerEl}
		onscroll={onScroll}
		class="snap-y snap-mandatory h-full w-full overflow-y-scroll"
	>
		{#each listings as listing, i (listing.id)}
			<ScrollCard {listing} index={i} total={listings.length} />
		{/each}
	</div>

	<div
		class="absolute right-0 bottom-0 left-0 z-30 flex items-center justify-center gap-6 p-6 pb-8 sm:gap-10 sm:pb-10"
	>
		<div class="flex flex-col items-center gap-1.5">
			<button
				type="button"
				onclick={gotoNext}
				class="bg-card/80 text-foreground hover:bg-card flex size-14 items-center justify-center rounded-full border border-foreground/10 backdrop-blur-md transition-colors"
				aria-label="Saltar anuncio"
			>
				<SkipForward class="size-6" />
			</button>
			<span class="text-muted-foreground text-xs">Saltar</span>
		</div>

		<div class="flex flex-col items-center gap-1.5">
			<button
				type="button"
				onclick={gotoNext}
				class="bg-primary text-primary-foreground hover:bg-primary/90 flex size-14 items-center justify-center rounded-full transition-colors"
				aria-label="Guardar anuncio y continuar"
			>
				<Bookmark class="size-6" />
			</button>
			<span class="text-muted-foreground text-xs">Guardar</span>
		</div>

		<div class="flex flex-col items-center gap-1.5">
			<a
				href="/app/anuncio/{listings[currentIndex]?.id ?? ''}"
				class="bg-card/80 text-foreground hover:bg-card flex size-14 items-center justify-center rounded-full border border-foreground/10 backdrop-blur-md transition-colors"
				aria-label="Ver detalle del anuncio"
			>
				<ExternalLink class="size-6" />
			</a>
			<span class="text-muted-foreground text-xs">Detalle</span>
		</div>
	</div>
{/if}