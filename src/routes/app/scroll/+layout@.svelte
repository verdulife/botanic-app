<script lang="ts">
	import { ArrowLeft } from "lucide-svelte/icons";

	let { children } = $props();
</script>

<div class="bg-background fixed inset-0 z-50 flex flex-col">
	<!-- Floating bar: solo Back -->
	<div
		class="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center p-3 sm:p-4"
	>
		<a
			href="/app"
			class="bg-card/80 text-foreground hover:bg-background/90 pointer-events-auto flex size-10 items-center justify-center rounded-full backdrop-blur-md transition-colors"
			aria-label="Salir de Match"
		>
			<ArrowLeft class="size-5" />
		</a>
	</div>

	{@render children?.()}
</div>
