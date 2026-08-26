<script lang="ts">
	import WebAppPrimaryNav from "$lib/components/wireframe/WebAppPrimaryNav.svelte";
	import ViewControlsPill from "$lib/components/wireframe/ViewControlsPill.svelte";
	import { ArrowLeft } from "lucide-svelte/icons";

	let { children } = $props();

	function handleFilterClick() {
		window.dispatchEvent(new CustomEvent("botanic:filter-toggle"));
	}
</script>

<!-- Floating bar: Back + pill (sin header) -->
<div
	class="pointer-events-none fixed inset-x-0 top-0 z-[1100] grid grid-cols-[auto_1fr_auto] items-center gap-2 p-3 sm:p-4 md:p-6"
>
	<a
		href="/app"
		class="bg-card/80 text-foreground hover:bg-background/90 pointer-events-auto flex size-10 items-center justify-center rounded-full backdrop-blur-md transition-colors"
		aria-label="Volver al feed"
	>
		<ArrowLeft class="size-5" />
	</a>

	<div class="flex justify-center">
		<div class="pointer-events-auto">
			<ViewControlsPill
				onFilter={handleFilterClick}
				class="bg-card/80 backdrop-blur-md"
			/>
		</div>
	</div>

	<div class="size-10" aria-hidden="true"></div>
</div>

<!-- Bottom nav (Inicio = vuelta a Lista) -->
<WebAppPrimaryNav />

<!-- Contenido del Mapa -->
{@render children?.()}