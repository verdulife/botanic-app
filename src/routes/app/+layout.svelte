<script lang="ts">
	import WebAppHeader from "$lib/components/wireframe/WebAppHeader.svelte";
	import WebAppPrimaryNav from "$lib/components/wireframe/WebAppPrimaryNav.svelte";
	import SearchOverlay from "$lib/components/wireframe/SearchOverlay.svelte";
	import { onMount } from 'svelte';
	import { applyTheme, watchSystemTheme } from '$lib/theme';

	let { children } = $props();

	// El tema es exclusivo de la app: se pone al entrar y se retira al salir, para
	// que la web pública y el blog no hereden la clase `dark` al navegar.
	onMount(() => {
		const stop = watchSystemTheme(window.location.pathname);
		return () => {
			stop();
			applyTheme('light');
		};
	});
</script>

<div class="app-ui bg-background text-foreground flex min-h-dvh flex-col">
	<WebAppHeader />

	<main class="flex flex-1 flex-col">
		{@render children?.()}
	</main>

	<WebAppPrimaryNav />
	<SearchOverlay />
</div>