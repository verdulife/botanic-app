<script lang="ts">
	import ViewControlsPill from "$lib/components/wireframe/ViewControlsPill.svelte";
	import { ArrowLeft } from "lucide-svelte/icons";

	let { children } = $props();

	function handleFilterClick() {
		window.dispatchEvent(new CustomEvent("botanic:filter-toggle"));
	}
</script>

<div class="bg-background fixed inset-0 z-50 flex flex-col">
	<!-- Floating bar: Back + pill centrada -->
	<div
		class="pointer-events-none absolute inset-x-0 top-0 z-30 grid grid-cols-[auto_1fr_auto] items-center gap-2 p-3 sm:p-4"
	>
		<a
			href="/app"
			class="bg-card/80 text-foreground hover:bg-background/90 pointer-events-auto flex size-10 items-center justify-center rounded-full backdrop-blur-md transition-colors"
			aria-label="Salir de Match"
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

	{@render children?.()}
</div>