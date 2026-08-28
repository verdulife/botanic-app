<script lang="ts">
	import { fade } from "svelte/transition";
	import { page } from '$app/state';
	import SearchOverlayPanel from "./SearchOverlayPanel.svelte";
	import { readFiltersFromSearchParams, pushFiltersToURL } from "$lib/mock/url-filters";
	import type { Filters } from "$lib/mock/filters";
	import { searchOverlay } from "../../stores/search-overlay.svelte.ts";

	let filters = $derived<Filters>(
		readFiltersFromSearchParams(page.url.searchParams)
	);

	function updateFilters(next: Filters) {
		pushFiltersToURL(next);
	}

	let prevRootOverflow = "";
	let prevScrollerOverflow: string | undefined;

	$effect(() => {
		if (typeof document === "undefined") return;

		const root = document.documentElement;

		if (searchOverlay.open) {
			prevRootOverflow = root.style.overflow;
			root.style.overflow = "hidden";
			if (searchOverlay.scroller) {
				prevScrollerOverflow = searchOverlay.scroller.style.overflow;
				searchOverlay.scroller.style.overflow = "hidden";
			}
		} else {
			if (prevRootOverflow !== undefined) root.style.overflow = prevRootOverflow;
			prevRootOverflow = "";
			if (searchOverlay.scroller && prevScrollerOverflow !== undefined) {
				searchOverlay.scroller.style.overflow = prevScrollerOverflow;
			}
			prevScrollerOverflow = undefined;
		}

		return () => {
			if (searchOverlay.open) {
				root.style.overflow = prevRootOverflow;
				if (searchOverlay.scroller && prevScrollerOverflow !== undefined) {
					searchOverlay.scroller.style.overflow = prevScrollerOverflow;
				}
			}
		};
	});

	function onKeydown(event: KeyboardEvent) {
		if (event.key === "Escape") searchOverlay.closeSearch();
	}
</script>

<svelte:window onkeydown={onKeydown} />

{#if searchOverlay.open}
	<div
		transition:fade={{ duration: 150 }}
		class="fixed inset-x-0 top-16 bottom-0 z-[10000] md:top-20"
		role="dialog"
		aria-modal="true"
		aria-label="Buscar"
	>
		<button
			type="button"
			class="bg-background/70 backdrop-blur-md absolute inset-0 block size-full cursor-default"
			onclick={searchOverlay.closeSearch}
			tabindex="-1"
			aria-label="Cerrar búsqueda"
		></button>

		<div class="relative flex h-full flex-col">
			<div class="scrollbar-hide flex-1 overflow-y-auto">
				<SearchOverlayPanel {filters} onChange={updateFilters} />
			</div>
		</div>
	</div>
{/if}
