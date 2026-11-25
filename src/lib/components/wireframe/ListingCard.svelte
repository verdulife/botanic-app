<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { favorites } from '$lib/stores/favorites.svelte';
	import { listingPath } from '$lib/listings/ref';
	import { listingHref } from '$lib/listing-url';
	import { Heart, MapPin } from '@lucide/svelte/icons';
	import type { Listing } from '$lib/listings/types';

	// La tarjeta solo pinta estos campos, así que se queda con el recorte del modelo
	// de la base. Así sirve también a las rutas que aún leen el mock (favoritos y
	// perfil, T10 y T11) sin que este componente arrastre ese modelo. Esas rutas no
	// tienen `publicId` todavía: su enlace cae al token antiguo hasta que migren.
	type ListingCardData = Pick<
		Listing,
		'id' | 'title' | 'price' | 'type' | 'images' | 'location'
	> & { publicId?: number };

	type Props = {
		listing: ListingCardData;
	};

	let { listing }: Props = $props();

	function hrefFor(listing: ListingCardData): string {
		return listing.publicId === undefined
			? listingHref(listing)
			: listingPath(listing.title, listing.publicId);
	}
</script>

<div class="group relative rounded-2xl">
	<a
		href={hrefFor(listing)}
		class="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
	>
		<div class="flex flex-col">
			<div
				class="border-border bg-muted relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-2xl border transition-opacity group-hover:opacity-90"
			>
				<img
					src={listing.images[0]}
					alt={listing.title}
					loading="lazy"
					class="absolute inset-0 h-full w-full object-cover"
				/>
				{#each listing.type as t (t)}
					{#if t === 'regalar'}
						<Badge
							variant="default"
							class="absolute top-2 left-2 text-[10px] tracking-wider uppercase"
						>
							Regalo
						</Badge>
					{:else if t === 'cambiar'}
						<Badge
							variant="secondary"
							class="absolute top-2 left-2 text-[10px] tracking-wider uppercase"
						>
							Cambio
						</Badge>
					{/if}
				{/each}
			</div>
			<div class="flex flex-col gap-1 px-1 pt-2.5 pb-4">
				<span class="text-sm leading-snug font-medium">{listing.title}</span>
				<div
					class="text-muted-foreground flex items-center justify-between gap-2 text-xs"
				>
					<span class="flex min-w-0 items-center gap-1.5">
						<MapPin class="size-3 shrink-0" />
						<span class="truncate">{listing.location}</span>
					</span>
					<span class="text-foreground shrink-0 text-sm font-semibold">
						{listing.type.includes('regalar') ? 'Gratis' : `${listing.price} €`}
					</span>
				</div>
			</div>
		</div>
	</a>
	<Button
		variant="secondary"
		size="icon"
		class="absolute top-2 right-2 z-10 size-9 rounded-full shadow-sm focus-visible:ring-0 focus-visible:border-transparent"
		aria-label={favorites.isFavorite(listing.id) ? '' : 'Guardar en favoritos'}
		onclick={() => favorites.toggle(listing.id)}
	>
		<Heart
			class={[
				'size-4',
				favorites.isFavorite(listing.id) ? 'fill-current text-foreground' : ''
			].join(' ')}
		/>
	</Button>
</div>