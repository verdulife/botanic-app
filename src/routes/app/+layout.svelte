<script lang="ts">
	import WebAppHeader from "$lib/components/wireframe/WebAppHeader.svelte";
	import WebAppPrimaryNav from "$lib/components/wireframe/WebAppPrimaryNav.svelte";

	let { children } = $props();
</script>

<div class="bg-background text-foreground flex min-h-dvh flex-col">
	<WebAppHeader />

	<main class="flex-1 pb-24 md:pb-0">
		{@render children?.()}
	</main>

	<WebAppPrimaryNav />
</div>