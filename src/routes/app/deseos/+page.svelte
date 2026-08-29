<script lang="ts">
	import AuthRequired from '$lib/components/wireframe/AuthRequired.svelte';
	import LiveSearchInput from '$lib/components/wireframe/LiveSearchInput.svelte';
	import WishlistList from '$lib/components/wireframe/WishlistList.svelte';
	import { wishes } from '$lib/stores/wishes.svelte';
	import type { Wish } from '$lib/mock/wishes';
	import * as Card from '$lib/components/ui/card';

	let { data } = $props();

	let searchTerm = $state('');

	function matchesTerm(w: Wish, q: string): boolean {
		const t = q.toLowerCase();
		return [w.keywords, w.category, w.location].some((v) => v.toLowerCase().includes(t));
	}

	let filteredWishes = $derived(
		searchTerm.trim() ? wishes.list.filter((w) => matchesTerm(w, searchTerm)) : wishes.list
	);
	let searching = $derived(searchTerm.trim().length > 0);
</script>

<svelte:head>
	<title>Mis deseos · Botanic</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div
	class="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 pt-6 pb-28 sm:px-6 sm:pt-8 sm:pb-32"
>
	{#if data.user}
		<header class="flex flex-col gap-1">
			<h1 class="text-xl font-medium sm:text-2xl">Mis deseos</h1>
			<p class="text-muted-foreground text-sm">
				Dices qué plantas buscas y te avisamos cuando alguien las publique.
			</p>
		</header>

		<LiveSearchInput
			placeholder="Buscar en tus deseos…"
			label="Buscar en deseos"
			bind:value={searchTerm}
		/>

		{#if searching && filteredWishes.length === 0}
			<Card.Root class="border-dashed">
				<Card.Content class="flex flex-col items-center gap-2 py-10 text-center">
					<p class="text-sm font-medium">No se encontraron resultados</p>
					<p class="text-muted-foreground text-sm">Para «{searchTerm}» en tus deseos.</p>
				</Card.Content>
			</Card.Root>
		{:else}
			<WishlistList wishes={filteredWishes} />
		{/if}
	{:else}
		<AuthRequired title="Di qué plantas buscas y recibe avisos" />
	{/if}
</div>