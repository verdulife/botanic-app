<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { page } from '$app/state';
	import { mockListings, userCoords } from '$lib/mock/listings';
	import {
		aggregateSellers,
		clusterSellers,
		mapCapsForZoom,
		nudgeChipsFromMarkers,
		resolveChipCollisions
	} from '$lib/mock/listings';
	import { applyFiltersAndSort, defaultFilters, type Filters } from '$lib/mock/filters';
	import { readFiltersFromSearchParams, pushFiltersToURL } from '$lib/mock/url-filters';
	import FiltersPanel from '$lib/components/wireframe/FiltersPanel.svelte';
	import { Button } from '$lib/components/ui/button';
	import { LocateFixed, X } from 'lucide-svelte/icons';
	import { MAP_TILE_URL, MAP_ATTRIBUTION } from '$lib/map/tiles';

	function escapeHtml(s: string): string {
		return s
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	}

	const STAR_SVG =
		'<svg viewBox="0 0 24 24" aria-hidden="true" class="star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>';

	// Tints deterministas para el avatar (iniciales), entre superficies del sistema.
	const AVATAR_TINTS = [
		{ bg: 'oklch(0.863 0.047 146)', fg: 'oklch(0.349 0.06 149)' },
		{ bg: 'oklch(0.935 0.128 99)', fg: 'oklch(0.415 0.094 53)' },
		{ bg: 'oklch(0.931 0.026 145)', fg: 'oklch(0.221 0.032 151)' },
		{ bg: 'oklch(0.895 0.163 95)', fg: 'oklch(0.468 0.107 57)' },
		{ bg: 'oklch(0.91 0.014 85)', fg: 'oklch(0.52 0.03 85)' }
	];

	function hashString(s: string): number {
		let h = 2166136261;
		for (let i = 0; i < s.length; i++) {
			h ^= s.charCodeAt(i);
			h = Math.imul(h, 16777619);
		}
		return (h >>> 0) % AVATAR_TINTS.length;
	}

	function initials(name: string): string {
		const parts = name.trim().split(/\s+/).filter(Boolean);
		const first = parts[0]?.charAt(0) ?? '';
		const second = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
		return (first + second).toUpperCase();
	}

	function ratingLabel(rating: number): string {
		return rating.toFixed(1).replace('.', ',');
	}

	function plantCountLabel(n: number): string {
		return n === 1 ? '1 planta' : `${n} plantas`;
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

	let refreshTimer: ReturnType<typeof setTimeout> | undefined;

	function scheduleRefresh() {
		if (refreshTimer) clearTimeout(refreshTimer);
		refreshTimer = setTimeout(renderMarkers, 80);
	}

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

		const bounds = map.getBounds();
		const zoom = map.getZoom();
		const sellers = aggregateSellers(listings).filter((s) =>
			bounds.contains([s.lat, s.lng])
		);
		const caps = mapCapsForZoom(zoom);
		const { markers, chips } = clusterSellers(
			sellers,
			zoom,
			caps.maxMarkers,
			caps.maxChips
		);

		// Anti-apilado: separa chips entre sí (fusión) y de los markers de vendedor
		// (empuje mínimo en píxel). Todo síncrono, sin parpadeo.
		const toPixel = (lat: number, lng: number) => map.latLngToLayerPoint([lat, lng]);
		const resolvedChips = resolveChipCollisions(chips, toPixel);
		const chipNudges = nudgeChipsFromMarkers(resolvedChips, markers, toPixel);

		for (const seller of markers) {
			const tint = AVATAR_TINTS[hashString(seller.username)];
			const html =
				`<span class="botanic-seller-pill">` +
				`<span class="avatar" style="background:${tint.bg};color:${tint.fg}">${escapeHtml(initials(seller.full_name))}</span>` +
				`<span class="text">` +
				`<span class="name">${escapeHtml(seller.full_name)}</span>` +
				`<span class="meta">` +
				`<span class="count">${escapeHtml(plantCountLabel(seller.count))}</span>` +
				`<span class="dot" aria-hidden="true">·</span>` +
				`<span class="rating">${STAR_SVG}<b>${escapeHtml(ratingLabel(seller.rating))}</b><span class="reviews">(${seller.reviewCount})</span></span>` +
				`</span>` +
				`</span>` +
				`</span>`;
			const icon = L.divIcon({
				className: 'botanic-seller-marker',
				html,
				iconSize: null,
				iconAnchor: [0, 0]
			});
			const marker = L.marker([seller.lat, seller.lng], {
				icon,
				riseOnHover: true
			})
				.addTo(map)
				.on('click', () =>
					goto(`/app/perfil/${encodeURIComponent(seller.username)}`)
				);
			markerInstances.push(marker);
		}

		for (const { chip, offsetX, offsetY } of chipNudges) {
			const nudgeStyle =
				offsetX !== 0 || offsetY !== 0
					? ` style="transform:translate(${offsetX}px,${offsetY}px)"`
					: '';
			const icon = L.divIcon({
				className: 'botanic-seller-chip-marker',
				html: `<span class="botanic-seller-chip"${nudgeStyle}>+${chip.count}</span>`,
				iconSize: null,
				iconAnchor: [0, 0]
			});
			const marker = L.marker([chip.lat, chip.lng], {
				icon,
				riseOnHover: true
			})
				.addTo(map)
				.on('click', () => {
					const positions = chip.members.map((m) => [m.lat, m.lng]);
					if (positions.length === 1) {
						map.setView(positions[0], Math.max(zoom, 15));
					} else {
						map.fitBounds(L.latLngBounds(positions), {
							padding: [28, 28],
							maxZoom: Math.max(zoom, 15)
						});
					}
				});
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

		map.on('zoomend moveend', scheduleRefresh);

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

<div class="flex flex-1 flex-col">
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
				class="bg-card text-muted-foreground hover:text-foreground hover:bg-background/90 absolute top-3 right-3 z-[400] flex size-9 items-center justify-center rounded-md border border-border shadow-sm transition-colors"
			>
				<LocateFixed class="size-5" />
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
			<h2 class="text-lg">Filtrar</h2>
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