<script lang="ts">
	import AppHeader from "$lib/components/AppHeader.svelte";
	import AppFooter from "$lib/components/AppFooter.svelte";

	let { children } = $props();
</script>

<div class="mx-auto flex min-h-dvh max-w-6xl flex-col">
	<AppHeader />

	<main class="flex-1">
		{@render children()}
	</main>

	<AppFooter />
</div>
