<script lang="ts">
	import { page } from '$app/state';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { getListingById } from '$lib/mock/listings';
	import { ArrowLeft, MapPin, MessageCircle, User } from 'lucide-svelte/icons';
	import { tick } from 'svelte';

	let activeImage = $state(0);

	const listing = $derived(getListingById(page.params.id ?? ''));

	let priceLabel = $derived(
		listing ? (listing.price === 0 ? 'Gratis' : `${listing.price.toFixed(2).replace('.00', '')} €`) : ''
	);

	let typeLabel = $derived(
		listing
			? listing.type === 'regalar'
				? 'Regalo'
				: listing.type === 'cambiar'
					? 'Cambio'
					: 'Venta'
			: ''
	);

	async function selectImage(i: number) {
		activeImage = i;
		await tick();
	}
</script>

<svelte:head>
	<title>{listing ? listing.title : 'Anuncio no encontrado'} · Botanic</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pt-6 pb-28 sm:px-6 sm:pt-10 sm:pb-32">
	<a
		href="/app"
		class="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-1.5 text-sm transition-colors"
	>
		<ArrowLeft class="size-4" />
		Volver a anuncios
	</a>

	{#if !listing}
		<Card.Root class="border-dashed">
			<Card.Content class="flex flex-col items-center gap-3 py-12 text-center">
				<p class="text-lg font-medium">No encontramos este anuncio</p>
				<p class="text-muted-foreground max-w-sm text-sm">
					Puede que se haya eliminado o que la dirección no sea válida.
				</p>
				<Button href="/app" variant="outline">Ver todos los anuncios</Button>
			</Card.Content>
		</Card.Root>
	{:else}
		<div class="grid gap-8 lg:grid-cols-[1fr_24rem]">
			<!-- Galería -->
			<div class="flex flex-col gap-3">
				<div class="border-border bg-muted relative aspect-[4/3] w-full max-w-full overflow-hidden rounded-2xl border">
					<img
						src={listing.images[activeImage]}
						alt={`${listing.title} — imagen ${activeImage + 1}`}
						class="absolute inset-0 h-full w-full max-w-full object-cover"
					/>
				</div>
				{#if listing.images.length > 1}
					<div class="flex flex-wrap gap-2">
						{#each listing.images as img, i}
							<button
								type="button"
								onclick={() => selectImage(i)}
								class="border-border bg-muted relative aspect-square w-20 shrink-0 overflow-hidden rounded-lg border transition-opacity hover:opacity-90"
								class:ring-2={i === activeImage}
								class:ring-ring={i === activeImage}
								aria-label={`Ver imagen ${i + 1}`}
							>
								<img
									src={img}
									alt=""
									loading="lazy"
									class="absolute inset-0 h-full w-full object-cover"
								/>
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Detalle -->
			<div class="flex flex-col gap-5">
				<div class="flex flex-col gap-2">
					<div class="flex flex-wrap items-center gap-2">
						<span class="text-muted-foreground text-[10px] tracking-wider uppercase">
							{listing.category}
						</span>
						{#if listing.type === 'regalar'}
							<Badge variant="default" class="text-[10px] tracking-wider uppercase">Regalo</Badge>
						{:else if listing.type === 'cambiar'}
							<Badge variant="secondary" class="text-[10px] tracking-wider uppercase">Cambio</Badge>
						{/if}
					</div>
					<h1 class="text-2xl leading-tight font-medium sm:text-3xl">{listing.title}</h1>
					<div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
						<span class="text-lg font-semibold">{priceLabel}</span>
						<span aria-hidden="true" class="text-muted-foreground">·</span>
						<span class="text-muted-foreground inline-flex items-center gap-1">
							<MapPin class="size-3.5" />
							{listing.location}
						</span>
					</div>
				</div>

				<Separator />

				<div class="flex flex-col gap-2">
					<h2 class="text-muted-foreground text-[10px] tracking-wider uppercase">Descripción</h2>
					<p class="text-sm leading-relaxed">{listing.description}</p>
				</div>

				<Separator />

				<div class="flex flex-col gap-3">
					<h2 class="text-muted-foreground text-[10px] tracking-wider uppercase">Vendedor</h2>
					<div class="flex items-center gap-3">
						<div class="bg-muted text-muted-foreground flex size-11 items-center justify-center rounded-full border">
							<User class="size-5" />
						</div>
						<div class="flex min-w-0 flex-col">
							<span class="text-sm font-medium">{listing.seller}</span>
							<span class="text-muted-foreground text-xs">{listing.sellerInfo.city}</span>
						</div>
					</div>
					{#if listing.sellerInfo.bio}
						<p class="text-muted-foreground text-xs">{listing.sellerInfo.bio}</p>
					{/if}
				</div>

				<div class="flex flex-col gap-2">
					<Button
						href="/app/chat/nuevo/{listing.sellerInfo.username}"
						class="w-full"
						size="lg"
					>
						<MessageCircle class="size-4" />
						Contactar
					</Button>
					<Button
						href="/app/perfil/{listing.sellerInfo.username}"
						variant="outline"
						class="w-full"
					>
						Ver perfil del vendedor
					</Button>
				</div>
			</div>
		</div>
	{/if}
</div>
