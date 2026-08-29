<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Heart } from 'lucide-svelte/icons';
	import { getListingById, type Listing } from '$lib/mock/listings';
	import { favorites } from '$lib/stores/favorites.svelte';
	import AuthRequired from '$lib/components/wireframe/AuthRequired.svelte';
	import ListingCard from '$lib/components/wireframe/ListingCard.svelte';
	import LiveSearchInput from '$lib/components/wireframe/LiveSearchInput.svelte';

	let { data } = $props();

	let searchTerm = $state('');

	let favoriteListings = $derived(
		[...favorites.ids]
			.map((id) => getListingById(id))
			.filter((l): l is Listing => Boolean(l))
	);

	function matchesTerm(l: Listing, q: string): boolean {
		const t = q.toLowerCase();
		return [l.title, l.location, l.category, l.seller].some((v) =>
			v?.toLowerCase().includes(t)
		);
	}

	let filteredListings = $derived(
		searchTerm.trim()
			? favoriteListings.filter((l) => matchesTerm(l, searchTerm))
			: favoriteListings
	);
</script>

<svelte:head>
	<title>Favoritos · Botanic</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div
	class="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pt-6 pb-28 sm:px-6 sm:pt-8 sm:pb-32"
>
	<header class="flex flex-col gap-1">
		<h1 class="text-xl font-medium sm:text-2xl">Favoritos</h1>
		<p class="text-muted-foreground text-sm">
			Los anuncios que has marcado con el corazón.
		</p>
	</header>

	{#if data.user}
		{#if favoriteListings.length === 0}
			<Card.Root class="border-dashed">
				<Card.Content class="flex flex-col items-center gap-2 py-12 text-center">
					<div
						class="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full border"
					>
						<Heart class="size-6" />
					</div>
					<p class="text-sm font-medium">Aún no tienes favoritos</p>
					<p class="text-muted-foreground max-w-sm text-sm">
						Pulsa el corazón en cualquier tarjeta del feed y la encontrarás aquí.
					</p>
					<Button href="/app" variant="outline" size="sm" class="mt-1">
						Explorar anuncios
					</Button>
				</Card.Content>
			</Card.Root>
		{:else}
			<div class="flex flex-col gap-4">
				<LiveSearchInput
					placeholder="Buscar en tus favoritos…"
					label="Buscar en favoritos"
					bind:value={searchTerm}
				/>
				{#if filteredListings.length === 0}
					<Card.Root class="border-dashed">
						<Card.Content class="flex flex-col items-center gap-2 py-10 text-center">
							<p class="text-sm font-medium">No se encontraron resultados</p>
							<p class="text-muted-foreground text-sm">
								Para «{searchTerm}» en tus favoritos.
							</p>
						</Card.Content>
					</Card.Root>
				{:else}
					<section
						aria-label="Anuncios favoritos"
						class="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4"
					>
						{#each filteredListings as listing (listing.id)}
							<ListingCard {listing} />
						{/each}
					</section>
				{/if}
			</div>
		{/if}
	{:else}
		<AuthRequired title="Guarda anuncios y sigue tus deseos" />
	{/if}
</div>