<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { favorites } from '$lib/stores/favorites.svelte';
	import { Heart, MapPin } from 'lucide-svelte/icons';
	import type { Listing } from '$lib/mock/listings';

	type Props = {
		listing: Listing;
	};

	let { listing }: Props = $props();
</script>

<div class="group relative rounded-2xl">
	<a
		href="/app/anuncio/{listing.id}"
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
				{#if listing.type === 'regalar'}
					<Badge
						variant="default"
						class="absolute top-2 left-2 text-[10px] tracking-wider uppercase"
					>
						Regalo
					</Badge>
				{:else if listing.type === 'cambiar'}
					<Badge
						variant="secondary"
						class="absolute top-2 left-2 text-[10px] tracking-wider uppercase"
					>
						Cambio
					</Badge>
				{/if}
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
						{listing.price} €
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