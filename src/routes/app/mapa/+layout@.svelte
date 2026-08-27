<script lang="ts">
	import WebAppPrimaryNav from "$lib/components/wireframe/WebAppPrimaryNav.svelte";
	import { ArrowLeft } from "lucide-svelte/icons";

	let { children } = $props();
</script>

<!-- Floating bar: solo Back (la vista se elige desde el header en otras rutas) -->
<div
	class="pointer-events-none fixed inset-x-0 top-0 z-[1100] flex items-center p-3 sm:p-4 md:p-6"
>
	<a
		href="/app"
		class="bg-card/80 text-foreground hover:bg-background/90 pointer-events-auto flex size-10 items-center justify-center rounded-full backdrop-blur-md transition-colors"
		aria-label="Volver al feed"
	>
		<ArrowLeft class="size-5" />
	</a>
</div>

<!-- Bottom nav (Inicio = vuelta a Lista) -->
<WebAppPrimaryNav />

<!-- Contenido del Mapa -->
{@render children?.()}