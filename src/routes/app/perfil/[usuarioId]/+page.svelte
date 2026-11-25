<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import ListingCard from '$lib/components/wireframe/ListingCard.svelte';
	import { sellerWishesByUsername } from '$lib/mock/seller-wishes';
	import { wishPriceLabel } from '$lib/mock/wishes';
	import { wishes } from '$lib/stores/wishes.svelte';
	import { Heart, MapPin, MessageCircle, Pencil, Star } from '@lucide/svelte/icons';

	let { data } = $props();

	// El perfil y sus anuncios llegan de +page.server.ts, leídos de la base. Un
	// usuario que no existe no llega aquí: la carga responde 404.
	const seller = $derived(data.seller);
	// `data.profile` es el perfil de quien mira (lo pone el layout), así que sigue
	// sirviendo para saber si el perfil abierto es el propio.
	const isOwn = $derived(data.profile?.username === seller.username);
	const profileWishes = $derived(
		isOwn ? wishes.list : (sellerWishesByUsername[seller.username] ?? [])
	);
	const initial = $derived((seller.fullName.trim()?.[0] ?? '?').toUpperCase());
	const displayName = $derived(seller.fullName || seller.username);
</script>

<svelte:head>
	<title>{displayName} · Botanic</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div
	class="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 pt-6 pb-28 sm:px-6 sm:pt-8 sm:pb-32"
>
	<header class="flex items-center gap-4">
		<div class="bg-primary/15 text-primary flex size-16 shrink-0 items-center justify-center rounded-full text-2xl font-medium">
			{initial}
		</div>
		<div class="flex min-w-0 flex-1 flex-col gap-1">
			<h1 class="truncate text-xl font-medium sm:text-2xl">{displayName}</h1>
			{#if seller.location}
				<p class="text-muted-foreground flex items-center gap-1 text-sm">
					<MapPin class="size-3.5" />
					{seller.location}
				</p>
			{/if}
			<p class="flex items-center gap-1.5 text-sm">
				<span class="text-foreground flex items-center gap-0.5 font-medium">
					<Star class="text-amber-500 size-4 fill-current" />
					{seller.rating.toFixed(1)}
				</span>
				<span class="text-muted-foreground">
					({seller.reviewCount} valoraciones)
				</span>
			</p>
		</div>
	</header>

	{#if seller.bio}
		<p class="text-muted-foreground text-sm leading-relaxed">{seller.bio}</p>
	{/if}

	<div class="flex gap-2">
		<Button href="/app/chat/nuevo/{seller.username}" class="h-12 flex-1">
			<MessageCircle class="size-4" />
			Iniciar conversación
		</Button>
		{#if isOwn}
			<Button href="/app/perfil/editar" variant="outline" class="h-12 shrink-0">
				<Pencil class="size-4" />
				Editar perfil
			</Button>
		{/if}
	</div>

	{#if profileWishes.length > 0}
		<section class="flex flex-col gap-3" aria-label="Sus deseos">
			<div class="flex items-center justify-between">
				<h2 class="text-lg font-medium">Sus deseos</h2>
				{#if isOwn}
					<a
						href="/app/deseos"
						class="text-muted-foreground hover:text-foreground text-xs font-medium underline transition-colors"
					>
						Gestionar deseos
					</a>
				{/if}
			</div>
			<Card.Root class="gap-0 overflow-hidden py-0">
				<ul class="divide-border divide-y">
					{#each profileWishes as w (w.id)}
						<li>
							<div class="flex items-center gap-3 px-4 py-3">
								<div
									class="bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-md"
								>
									<Heart class="size-5" />
								</div>
								<span class="flex min-w-0 flex-1 flex-col">
									<span class="truncate text-sm font-medium">{w.keywords}</span>
									<span class="text-muted-foreground truncate text-xs">
										{w.location} · {wishPriceLabel(w)}
									</span>
								</span>
								<Badge
									variant={w.status === 'activo' ? 'default' : 'secondary'}
									class="shrink-0 text-[10px] tracking-wider uppercase"
								>
									{w.status}
								</Badge>
							</div>
						</li>
					{/each}
				</ul>
			</Card.Root>
		</section>
	{/if}

	<section class="flex flex-col gap-3" aria-label="Anuncios de {displayName}">
		<h2 class="text-lg font-medium">Anuncios de {displayName}</h2>
		{#if data.listings.length === 0}
			<Card.Root class="border-dashed">
				<Card.Content class="flex flex-col items-center gap-1 py-10 text-center">
					<p class="text-sm font-medium">Todavía no tiene anuncios activos</p>
					<p class="text-muted-foreground text-sm">
						Vuelve pronto para ver sus plantas.
					</p>
				</Card.Content>
			</Card.Root>
		{:else}
			<div class="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
				{#each data.listings as listing (listing.id)}
					<ListingCard {listing} />
				{/each}
			</div>
		{/if}
	</section>
</div>
