<script lang="ts">
	import type { Listing } from '$lib/mock/listings';
	import { favorites } from '$lib/stores/favorites.svelte';
	import { ArrowRight, Heart, Share2 } from 'lucide-svelte/icons';

	type Props = {
		listing: Listing;
		active?: boolean;
	};

	let { listing, active = false }: Props = $props();

	let favorited = $derived(favorites.isFavorite(listing.id));
	let imgIndex = $state(0);

	let priceLabel = $derived(
		listing.price === 0 ? 'Gratis' : `${listing.price} €`
	);
	let ratingLabel = $derived(
		listing.sellerInfo.rating.toFixed(1).replace('.', ',')
	);
	let images = $derived(listing.images);

	function toggleSave() {
		favorites.toggle(listing.id);
	}

	// Ciclo de imágenes: cada 3s avanza con fade, solo mientras la tarjeta es la activa.
	let timer: ReturnType<typeof setInterval> | undefined;
	$effect(() => {
		if (!active || images.length < 2) return;
		timer = setInterval(() => {
			imgIndex = (imgIndex + 1) % images.length;
		}, 3000);
		return () => {
			if (timer) clearInterval(timer);
		};
	});

	// Doble tap en la imagen = guardar (toggle). Detección manual para móvil.
	let lastTap = 0;
	function onTouchStart() {
		const now = Date.now();
		if (now - lastTap < 300) {
			lastTap = 0;
			toggleSave();
		} else {
			lastTap = now;
		}
	}

	async function onShare() {
		if (typeof navigator === 'undefined') return;
		const shareData = {
			title: listing.title,
			text: `Mira "${listing.title}" (${priceLabel}) en Botanic`,
			url: typeof window !== 'undefined' ? window.location.href : ''
		};
		try {
			if (navigator.share) {
				await navigator.share(shareData);
			} else if (navigator.clipboard?.writeText) {
				await navigator.clipboard.writeText(`${shareData.title} — ${shareData.url}`);
			}
		} catch {
			// el usuario canceló o hubo un error; no hacer nada
		}
	}
</script>

<article
	class="bg-black text-white relative flex h-full w-full shrink-0 snap-start snap-always flex-col items-stretch justify-end gap-3 overflow-hidden"
	aria-label={listing.title}
>
	<div
		role="presentation"
		class="absolute inset-0 touch-manipulation"
		style="mask-image: linear-gradient(to bottom, black 0%, black 25%, rgba(0,0,0,0.1) 100%)"
		ontouchstart={onTouchStart}
		ondblclick={toggleSave}
	>
		{#each images as img, i}
			<img
				src={img}
				alt={`${listing.title} - imagen ${i + 1}`}
				class={[
					'absolute inset-0 h-full w-full object-cover transition-opacity duration-700',
					i === imgIndex ? 'opacity-100' : 'opacity-0'
				].join(' ')}
				loading="lazy"
				draggable="false"
				onerror={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
			/>
		{/each}
	</div>

	<div class="relative z-10 flex w-full items-end justify-between gap-4 px-4 pb-28 text-left sm:px-8 md:pb-8">
		<div class="flex min-w-0 flex-col items-start gap-1.5">
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
			<div class="flex items-center gap-1.5 text-sm">
				<svg
					class="text-star size-3.5"
					viewBox="0 0 24 24"
					fill="currentColor"
					aria-hidden="true"
				>
					<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
				</svg>
				<span class="font-semibold">{ratingLabel}</span>
				<span class="opacity-80">{listing.seller}</span>
			</div>
		</div>

		<div class="flex shrink-0 flex-col items-center gap-3">
			<div class="flex flex-col items-center gap-0.5">
				<button
					type="button"
					onclick={onShare}
					class="text-white/60 hover:text-white flex size-10 items-center justify-center rounded-full transition-colors md:size-11"
					aria-label="Compartir anuncio"
				>
					<Share2 class="size-5" />
				</button>
				<span class="text-white/60 text-[10px]">Compartir</span>
			</div>

			<div class="flex flex-col items-center gap-0.5">
				<button
					type="button"
					onclick={toggleSave}
					class="text-white/60 hover:text-white flex size-10 items-center justify-center rounded-full transition-colors md:size-11"
					aria-label={favorited ? 'Quitar de favoritos' : 'Guardar en favoritos'}
				>
					<Heart class={['size-5', favorited ? 'fill-current text-white' : ''].join(' ')} />
				</button>
				<span class="text-white/60 text-[10px]">Guardar</span>
			</div>

			<div class="flex flex-col items-center gap-0.5">
				<a
					href="/app/anuncio/{listing.id}"
					class="text-white/60 hover:text-white flex size-10 items-center justify-center rounded-full transition-colors md:size-11"
					aria-label="Ver ahora"
				>
					<ArrowRight class="size-5" />
				</a>
				<span class="text-white/60 text-[10px]">Ver ahora</span>
			</div>
		</div>
	</div>
</article>