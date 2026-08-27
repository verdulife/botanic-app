<script lang="ts">
	import WebAppHeader from "$lib/components/wireframe/WebAppHeader.svelte";
	import WebAppPrimaryNav from "$lib/components/wireframe/WebAppPrimaryNav.svelte";

	let { children } = $props();
</script>

<div class="app-ui bg-background text-foreground flex min-h-dvh flex-col">
	<WebAppHeader />

	<main class="flex flex-1 flex-col bg-black text-white">
		{@render children?.()}
	</main>

	<WebAppPrimaryNav />
</div>