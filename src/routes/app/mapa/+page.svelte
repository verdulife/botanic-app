<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { page } from '$app/state';
	import { mockListings, userCoords } from '$lib/mock/listings';
	import { applyFiltersAndSort, defaultFilters, type Filters } from '$lib/mock/filters';
	import { readFiltersFromSearchParams, pushFiltersToURL } from '$lib/mock/url-filters';
	import FiltersPanel from '$lib/components/wireframe/FiltersPanel.svelte';
	import { Button } from '$lib/components/ui/button';
	import { X } from 'lucide-svelte/icons';
	import { MAP_TILE_URL, MAP_ATTRIBUTION } from '$lib/map/tiles';

	function escapeHtml(s: string): string {
		return s
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	}

	let filters = $derived<Filters>(
		readFiltersFromSearchParams(page.url.searchParams)
	);
	let listings = $derived(applyFiltersAndSort(mockListings, filters));

	let mapEl: HTMLDivElement | undefined = $state();
	let map: any = $state(null);
	let LRef: any = $state(null);
	let markerInstances: any[] = [];

	let mobileFiltersOpen = $state(false);
	let mobileDraft = $state<Filters>(defaultFilters);
	let prevMobileOpen = $state(false);

	onMount(() => {
		const handler = () => (mobileFiltersOpen = !mobileFiltersOpen);
		window.addEventListener('botanic:filter-toggle', handler);
		return () => window.removeEventListener('botanic:filter-toggle', handler);
	});

	$effect(() => {
		if (mobileFiltersOpen && !prevMobileOpen) {
			Object.assign(mobileDraft, $state.snapshot(filters));
		}
		prevMobileOpen = mobileFiltersOpen;
	});

	function recenterOnUser() {
		if (!browser || !map || !navigator.geolocation) return;
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				map.flyTo([pos.coords.latitude, pos.coords.longitude], 15, {
					duration: 0.8
				});
			},
			(err) => console.warn('[mapa] geolocation:', err.message),
			{ enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 }
		);
	}

	function renderMarkers() {
		const L = LRef;
		if (!map || !L) return;
		markerInstances.forEach((m) => m.remove());
		markerInstances = [];

		for (const listing of listings) {
			const { lat, lng } = listing.coordinates;
			if (typeof lat !== 'number' || typeof lng !== 'number') continue;
			const icon = L.divIcon({
				className: 'botanic-label-marker',
				html: `<span class="botanic-label"><img class="thumb" src="${escapeHtml(listing.images[0])}" alt="" onerror="this.style.visibility='hidden'" /><span class="text"><span class="title">${escapeHtml(listing.title)}</span><span class="price">${listing.price} €</span></span></span>`,
				iconSize: null,
				iconAnchor: [0, 0]
			});
			const marker = L.marker([lat, lng], { icon, riseOnHover: true })
				.addTo(map)
				.on('click', () => goto(`/app/anuncio/${listing.id}`));
			markerInstances.push(marker);
		}
	}

	onMount(async () => {
		if (!browser) return;
		const L = await import('leaflet');
		await import('leaflet/dist/leaflet.css');
		LRef = L;

		if (!mapEl) return;

		map = L.map(mapEl, {
			zoomControl: false,
			scrollWheelZoom: true
		}).setView([userCoords.lat, userCoords.lng], 12);

		L.tileLayer(MAP_TILE_URL, { attribution: MAP_ATTRIBUTION }).addTo(map);
		L.control.zoom({ position: 'bottomright' }).addTo(map);

		// El $effect de abajo dispara renderMarkers() cuando `map` y `LRef` estén listos.
	});

	$effect(() => {
		if (map && LRef) renderMarkers();
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
	<title>Mapa · Botanic</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="flex h-dvh w-full flex-col pb-16 md:pb-0">
	<div class="grid min-h-0 flex-1 lg:grid-cols-[18rem_1fr]">
		<aside class="hidden overflow-y-auto lg:block lg:border-r">
			<div class="p-4">
				<FiltersPanel {filters} onChange={updateFilters} />
			</div>
		</aside>

		<div class="relative">
			<div bind:this={mapEl} class="h-full w-full" aria-label="Mapa de anuncios"></div>

			<button
				type="button"
				onclick={recenterOnUser}
				aria-label="Mostrar mi ubicación"
				class="bg-card text-foreground hover:bg-background/90 absolute top-3 right-3 z-[400] flex size-9 items-center justify-center rounded-md border border-border shadow-sm transition-colors"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.75"
					class="size-4"
				>
					<circle cx="12" cy="12" r="3" />
					<path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
				</svg>
			</button>
		</div>
	</div>
</div>

{#if mobileFiltersOpen}
	<div
		transition:fly={{ x: -1000, duration: 280, opacity: 1 }}
		class="bg-card fixed inset-0 z-[1100] flex flex-col lg:hidden"
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