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

	let scrollerEl: HTMLDivElement | undefined = $state();
	let activeImage = $state(0);

	function onScroll() {
		if (!scrollerEl) return;
		const slideWidth = scrollerEl.clientWidth;
		const idx = Math.round(scrollerEl.scrollLeft / slideWidth);
		if (idx !== activeImage) activeImage = idx;
	}
</script>

<article
	class="bg-background relative flex h-dvh w-full shrink-0 snap-start snap-always flex-col items-center gap-6 overflow-hidden p-4 pt-20 sm:p-8 sm:pt-24 pb-32 sm:pb-36"
	aria-label={listing.title}
>
	<!-- Wrapper de la card: contiene el slider y los dots (los dots NO se mueven con el scroll) -->
	<div
		class="relative flex w-full max-w-md flex-1 flex-col overflow-hidden rounded-2xl border border-border shadow-md"
	>
		<!-- Image slider (fills the wrapper) -->
		<div
			bind:this={scrollerEl}
			onscroll={onScroll}
			class="flex flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
			aria-label={`Imágenes de ${listing.title}`}
		>
			{#each listing.images as _src, i (i)}
				<div class="bg-muted text-muted-foreground flex h-full w-full shrink-0 snap-start snap-always items-center justify-center">
					<img
						src={listing.images[i]}
						alt={`${listing.title} — imagen ${i + 1} de ${listing.images.length}`}
						class="h-full w-full object-cover"
						loading="lazy"
						onerror={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
					/>
				</div>
			{/each}
		</div>

		<!-- Dots indicadores (fuera del slider, no se mueven con el scroll) -->
		<div
			class="pointer-events-none absolute inset-x-0 bottom-5 z-10 flex justify-center gap-1.5"
			aria-label={`Imagen ${activeImage + 1} de ${listing.images.length}`}
		>
			{#each listing.images as _, i (i)}
				<span
					class="size-2 rounded-full transition-colors {i === activeImage
						? 'bg-white'
						: 'bg-white/40'}"
				></span>
			{/each}
		</div>
	</div>

	<!-- Text block (centrado, sin gradient) -->
	<div class="text-foreground flex w-full max-w-md flex-col items-center gap-2 pb-6 text-center">
		<span class="text-sm tracking-wider uppercase opacity-60 sm:text-base">
			{listing.category}
		</span>
		<h2 class="font-display text-3xl font-medium leading-tight sm:text-4xl">
			{listing.title}
		</h2>
		<div class="mt-1 flex items-center gap-2 text-lg sm:text-xl">
			<span class="font-semibold">{priceLabel}</span>
			<span aria-hidden="true" class="opacity-50">·</span>
			<span class="opacity-80">{listing.location}</span>
		</div>
	</div>
</article>