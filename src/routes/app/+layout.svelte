<script lang="ts">
	import WebAppHeader from "$lib/components/wireframe/WebAppHeader.svelte";
	import WebAppPrimaryNav from "$lib/components/wireframe/WebAppPrimaryNav.svelte";
	import ViewControlsPill from "$lib/components/wireframe/ViewControlsPill.svelte";

	let { children } = $props();

	function handleFilterClick() {
		window.dispatchEvent(new CustomEvent("botanic:filter-toggle"));
	}
</script>

<div class="bg-background text-foreground flex min-h-dvh flex-col">
	<WebAppHeader />

	<!-- Pill flotante: el único elemento flotante del marketplace -->
	<div class="pointer-events-none fixed inset-x-0 top-16 z-30 flex justify-center pt-3 md:top-24">
		<div class="pointer-events-auto">
			<ViewControlsPill
				onFilter={handleFilterClick}
				class="bg-card/80 backdrop-blur-md"
			/>
		</div>
	</div>

	<main class="flex-1 pb-16 md:pb-0">
		{@render children?.()}
	</main>

	<WebAppPrimaryNav />
</div>