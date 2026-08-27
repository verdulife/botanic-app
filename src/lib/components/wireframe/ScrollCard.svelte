<script lang="ts">
	import type { Listing } from '$lib/mock/listings';

	type Props = {
		listing: Listing;
		index: number;
		total: number;
	};

	let { listing }: Props = $props();

	let priceLabel = $derived(
		listing.price === 0 ? 'Gratis' : `${listing.price} €`
	);
</script>

	<article
		class="bg-black text-white relative flex h-full w-full shrink-0 snap-start snap-always flex-col items-stretch justify-end gap-3 overflow-hidden pb-24"
		aria-label={listing.title}
	>
	<img
		src={listing.images[0]}
		alt={`${listing.title} — imagen`}
		class="pointer-events-none absolute inset-0 h-full w-full object-cover"
		style="mask-image: linear-gradient(to bottom, black 0%, black 25%, rgba(0,0,0,0.1) 100%)"
		loading="lazy"
		onerror={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
	/>

	<div class="text-white relative z-10 flex w-full flex-col items-start gap-1.5 px-4 text-left sm:px-8">
		<span class="text-[10px] tracking-wider uppercase opacity-60 sm:text-xs">
			{listing.category}
		</span>
		<h2 class="text-xl font-medium leading-tight sm:text-2xl">
			{listing.title}
		</h2>
		<div class="flex items-center gap-1.5 text-sm">
			<span class="font-semibold">{priceLabel}</span>
			<span aria-hidden="true" class="opacity-50">·</span>
			<span class="opacity-80">{listing.location}</span>
		</div>
	</div>
</article>
