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
	import { searchOverlay } from '../../../lib/stores/search-overlay.svelte.ts';
	import { X } from 'lucide-svelte/icons';

	let filters = $derived<Filters>(
		readFiltersFromSearchParams(page.url.searchParams)
	);
	let listings = $derived(applyFiltersAndSort(mockListings, filters));

	let scrollerEl: HTMLDivElement | undefined = $state();
	let currentIndex = $state(0);

	$effect(() => {
		searchOverlay.registerScroller(scrollerEl ?? null);
	});

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
			<h2 class="text-lg">Filtrar</h2>
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
	<div class="bg-black relative flex-1 w-full">
		<div
			bind:this={scrollerEl}
			onscroll={onScroll}
			class="snap-y snap-mandatory absolute inset-0 overflow-y-scroll"
		>
			{#each listings as listing, i (listing.id)}
				<ScrollCard {listing} active={i === currentIndex} />
			{/each}
		</div>
	</div>
{/if}