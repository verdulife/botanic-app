<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { listingHref, parseAnuncioParam } from '$lib/listing-url';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { getListingById, getListingsBySeller, getPlantCareForSpecies } from '$lib/mock/listings';
	import { sellerWishesByUsername } from '$lib/mock/seller-wishes';
	import { wishPriceLabel } from '$lib/mock/wishes';
	import { favorites } from '$lib/stores/favorites.svelte';
	import { wishes } from '$lib/stores/wishes.svelte';
	import { userListings } from '$lib/stores/user-listings.svelte';
	import {
		ChevronRight,
		MapPin,
		MessagesSquare,
		Droplets,
		Sun,
		Sparkles,
		Users,
		User,
		Heart,
		Share2,
		Star
	} from 'lucide-svelte/icons';

	let { data } = $props();

	let activeImage = $state(0);

	const parsed = $derived(parseAnuncioParam(page.params.slug ?? ''));
	const listing = $derived(
		userListings.getById(parsed.id) ?? getListingById(parsed.id)
	);

	// Redirige a la URL canónica (slug correcto del título) con replaceState.
	$effect(() => {
		if (!listing) return;
		const canonical = listingHref(listing);
		if (page.url.pathname !== canonical) {
			goto(canonical, { replaceState: true });
		}
	});

	// ── Open Graph / Twitter (sharing) ──
	const ogBase = $derived(page.url.origin);
	const ogUrl = $derived(listing ? `${ogBase}${listingHref(listing)}` : '');
	const ogImage = $derived(listing?.images[0] ? `${ogBase}${listing.images[0]}` : '');
	const ogTitle = $derived(
		listing
			? `${listing.title} · ${listing.type.includes('regalar') ? 'Gratis' : `${listing.price} €`}`
			: ''
	);
	const ogDescription = $derived(
		listing
			? listing.description.trim()
				? listing.description.trim().slice(0, 160)
				: `${listing.category} en ${listing.location}`
			: ''
	);

	const isFavorited = $derived(listing ? favorites.isFavorite(listing.id) : false);

	// Deseos del vendedor (solo en anuncios de cambio): los suyos si es el usuario
	// actual, si no los del seed por vendedor. El elegido ("cambio por") primero.
	const sellerWishes = $derived.by(() => {
		if (!listing || !listing.type.includes('cambiar')) return [];
		const username = listing.sellerInfo.username;
		return data.profile?.username === username
			? wishes.list
			: (sellerWishesByUsername[username] ?? []);
	});

	const displayWishes = $derived.by(() => {
		if (!listing?.wishId) return sellerWishes;
		const selected = sellerWishes.find((w) => w.id === listing.wishId);
		if (!selected) return sellerWishes;
		return [selected, ...sellerWishes.filter((w) => w.id !== selected.id)];
	});

	const care = $derived(getPlantCareForSpecies(listing?.species));

	const wateringLevel = $derived(
		care ? ({ Baja: 1, Media: 2, Alta: 3 }[care.watering] ?? 0) : 0
	);
	const lightLevel = $derived(
		care ? ({ Sombra: 1, 'Luz indirecta': 2, 'Luz directa': 3 }[care.light] ?? 0) : 0
	);
	const toxicity = $derived.by(() => {
		if (!care) return '';
		if (care.toxicity === 'Tóxica para mascotas') {
			return 'Mascotas';
		}
		if (care.toxicity === 'Tóxica') {
			return 'Sí';
		}
		return 'No';
	});

	const aiPrompt = $derived.by(() => {
		if (!listing) return '';
		const { title, price, location, category, categorySlug, type, species } = listing;
		const priceText =
			type.includes('regalar') || price === 0
				? 'es un regalo (gratis)'
				: `cuesta ${price} €`;
		const dealCtx =
			`Encuentro este anuncio de Botanic: "${title}" (categoría ${category}). ` +
			`El precio es: ${priceText}. Se encuentra en ${location}. Tipo de operación: ${type.join(' / ')}.`;

		let specific: string;
		const s = species?.name?.trim();
		if (s) {
			if (care) {
				specific =
					`Es la planta ${s}; sus cuidados conocidos: riego ${care.watering.toLowerCase()}, ` +
					`luz ${care.light.toLowerCase()}, ph ${care.ph}, toxicidad ${care.toxicity.toLowerCase()}. ` +
					`Primero dame una guía breve de cuidados (riego, luz, temperatura, sustrato, problemas comunes y señales de alerta). ` +
					`Después evalúa si es una buena compra: contrasta el precio con los precios habituales de ${s} ` +
					`en ${location}, di si es un precio justo o caro, y qué debería revisar antes de decidir (estado de raíces, plagas, tamaño, sanidad).`;
			} else {
				specific =
					`Es la planta ${s}. Dame una guía breve de cuidados (riego, luz, temperatura, sustrato, problemas comunes). ` +
					`Después evalúa si es una buena compra: contrasta el precio con los precios habituales de ${s} en ${location}, ` +
					`di si es un precio justo o caro, y qué debería revisar en el vendedor antes de decidir.`;
			}
		} else {
			const byCategory: Record<string, string> = {
				semillas: `Explica cómo sembrar y germinar "${title}", y evalúa si es una buena compra: qué debe costar este tipo de semillas, si el precio es justo, y qué revisar antes de comprarlas (frescura, variedad, cantidad).`,
				esquejes: `Dame una guía breve para enraizar y cuidar "${title}", y evalúa si es una buena compra: qué precio es razonable para esquejes, si es justo, y qué comprobar antes (estado de raíces, tipo de corte, sanidad).`,
				plantas: `Dame una guía breve de cuidados de "${title}", y evalúa si es una buena compra: qué suele costar una planta así, si el precio es justo, y qué revisar antes (tamaño, sanidad, maceta).`,
				tiestos: `Explica para qué es ideal "${title}", qué tamaño y material conviene, y evalúa si es una buena compra: qué cuesta un tiesto similar, si el precio es justo y si merece la pena.`,
				accesorios: `Explica para qué sirve "${title}", cómo usarlo, y evalúa si es una buena compra: compara con opciones similares y di si el precio es justo.`,
				herramientas: `Explica cómo usar "${title}", para qué tareas sirve, y evalúa si es una buena compra: qué cuesta una herramienta así, si el precio es justo y si merece la pena.`,
				otros: `Explica qué es "${title}", para qué sirve, y evalúa si es una buena compra: qué suele costar algo así, si el precio es justo y qué revisar antes.`
			};
			specific =
				byCategory[categorySlug] ??
				`Explica qué es "${title}", para qué sirve, y evalúa si es una buena compra dados el precio y la ubicación.`;
		}

		return (
			`Soy un comprador en Botanic, un marketplace de plantas entre particulares. ` +
			`${dealCtx} ${specific} ` +
			`Responde en español, de forma práctica y directa, orientada a ayudarme a decidir si esta compra merece la pena.`
		);
	});

	const perplexityUrl = $derived(
		`https://www.perplexity.ai/search?q=${encodeURIComponent(aiPrompt)}`
	);

	const sellerListings = $derived(
		listing
			? getListingsBySeller(listing.sellerInfo.username, listing.id, 4)
			: []
	);

	let dragStartX: number | null = null;

	function onPointerDown(e: PointerEvent) {
		dragStartX = e.clientX;
	}

	function onPointerUp(e: PointerEvent) {
		if (dragStartX === null) return;
		const dx = e.clientX - dragStartX;
		dragStartX = null;
		const threshold = 40;
		if (Math.abs(dx) < threshold) return;
		if (!listing) return;
		if (dx < 0 && activeImage < listing.images.length - 1) activeImage += 1;
		else if (dx > 0 && activeImage > 0) activeImage -= 1;
	}

	let priceLabel = $derived(
		listing ? (listing.price === 0 ? 'Gratis' : `${listing.price.toFixed(2).replace('.00', '')} €`) : ''
	);

	async function onShare() {
		if (!listing || typeof navigator === 'undefined') return;
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

<svelte:head>
	<title>{listing ? listing.title : 'Anuncio no encontrado'} · Botanic</title>
	{#if listing}
		<meta name="robots" content="noindex, nofollow, max-image-preview:large" />
		<link rel="canonical" href={ogUrl} />
		<meta name="description" content={ogDescription} />
		<meta property="og:type" content="website" />
		<meta property="og:title" content={ogTitle} />
		<meta property="og:description" content={ogDescription} />
		<meta property="og:url" content={ogUrl} />
		<meta property="og:site_name" content="Botanic" />
		<meta property="og:locale" content="es_ES" />
		<meta property="og:image" content={ogImage} />
		<meta property="og:image:alt" content={ogTitle} />
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:title" content={ogTitle} />
		<meta name="twitter:description" content={ogDescription} />
		<meta name="twitter:image" content={ogImage} />
	{:else}
		<meta name="robots" content="noindex, nofollow" />
	{/if}
</svelte:head>

<div class="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pt-6 pb-28 sm:px-6 sm:pt-10 sm:pb-32">
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
				<div
					role="group"
					aria-roledescription="carrusel"
					aria-label={`Galería de ${listing.title}`}
					class="border-border bg-muted relative aspect-[4/5] w-full max-w-full overflow-hidden rounded-2xl border"
					onpointerdown={onPointerDown}
					onpointerup={onPointerUp}
					onpointercancel={onPointerUp}
					style="touch-action: pan-y"
				>
					<div
						class="flex h-full transition-transform duration-300 ease-out"
						style="transform: translateX(-{activeImage * 100}%);"
					>
						{#each listing.images as img, i}
							<img
								src={img}
								alt={`${listing.title} — imagen ${i + 1}`}
								class="h-full w-full shrink-0 object-cover"
								draggable="false"
							/>
						{/each}
					</div>

					<div class="absolute top-3 right-3 z-10 flex flex-col gap-2">
						<Button
							variant="secondary"
							size="icon"
							class="size-11 shadow-sm"
							aria-label={isFavorited ? 'Quitar de favoritos' : 'Guardar en favoritos'}
							onclick={() => favorites.toggle(listing.id)}
							onpointerdown={(e) => e.stopPropagation()}
						>
							<Heart
								class={[
									'size-5',
									isFavorited ? 'fill-current text-foreground' : ''
								].join(' ')}
							/>
						</Button>
						<Button
							variant="secondary"
							size="icon"
							class="size-11 shadow-sm"
							aria-label="Compartir"
							onclick={onShare}
							onpointerdown={(e) => e.stopPropagation()}
						>
							<Share2 class="size-5" />
						</Button>
					</div>
				</div>
				{#if listing.images.length > 1}
					<div class="flex items-center justify-center gap-1.5">
						{#each listing.images as _, i}
							<span
								aria-hidden="true"
								class={[
									'h-1.5 rounded-full transition-all duration-300',
									i === activeImage
										? 'bg-foreground w-4'
										: 'bg-muted-foreground/40 w-1.5'
								].join(' ')}
							></span>
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
						{#each listing.type as t (t)}
						{#if t === 'regalar'}
							<Badge variant="default" class="text-[10px] tracking-wider uppercase">Regalo</Badge>
						{:else if t === 'cambiar'}
							<Badge variant="secondary" class="text-[10px] tracking-wider uppercase">Cambio</Badge>
						{/if}
					{/each}
					</div>
					<h1 class="text-2xl leading-tight font-medium sm:text-3xl">{listing.title}</h1>
					<div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
						<span class="text-lg font-semibold">{priceLabel}</span>
						<span aria-hidden="true" class="text-muted-foreground">·</span>
						<span class="text-muted-foreground inline-flex items-center gap-1">
							<MapPin class="size-3.5" />
							{listing.location}
						</span>
						{#if listing.size}
							<span aria-hidden="true" class="text-muted-foreground">·</span>
							<span class="text-muted-foreground">{listing.size}</span>
						{/if}
					</div>
				</div>

				{#if care}
					<dl class="border-border grid grid-cols-3 gap-2">
						<div class="border-border bg-muted/50 flex flex-col items-center gap-1.5 rounded-xl border p-3">
							<dt class="text-muted-foreground text-[10px] tracking-wider uppercase">Riego</dt>
							<dd class="flex items-center justify-center gap-1">
								{#each [0, 1, 2] as i}
									<Droplets
										class={['size-4', i < wateringLevel ? 'text-foreground' : 'text-muted-foreground/30'].join(' ')}
									/>
								{/each}
							</dd>
						</div>
						<div class="border-border bg-muted/50 flex flex-col items-center gap-1.5 rounded-xl border p-3">
							<dt class="text-muted-foreground text-[10px] tracking-wider uppercase">Luz</dt>
							<dd class="flex items-center justify-center gap-1">
								{#each [0, 1, 2] as i}
									<Sun
										class={['size-4', i < lightLevel ? 'text-foreground' : 'text-muted-foreground/30'].join(' ')}
									/>
								{/each}
							</dd>
						</div>
						<div class="border-border bg-muted/50 flex flex-col items-center gap-1.5 rounded-xl border p-3">
							<dt class="text-muted-foreground text-[10px] tracking-wider uppercase">Toxicidad</dt>
							<dd class="text-muted-foreground flex items-center justify-center text-sm font-medium">
								{toxicity}
							</dd>
						</div>
					</dl>
				{/if}

				<div class="flex flex-col gap-3">
					<h2 class="text-muted-foreground text-[10px] tracking-wider uppercase">Vendedor</h2>
					<div class="flex items-center justify-between gap-3">
						<a
							href="/app/perfil/{listing.sellerInfo.username}"
							class="hover:bg-muted group flex min-w-0 items-center gap-3 rounded-xl py-1 pr-1 transition-colors"
						>
							<div class="bg-muted text-muted-foreground flex size-11 shrink-0 items-center justify-center rounded-full border">
								<User class="size-5" />
							</div>
							<div class="flex min-w-0 flex-col">
								<span class="text-sm font-medium">{listing.seller}</span>
								<span class="text-muted-foreground text-xs">{listing.sellerInfo.city}</span>
								<span class="flex items-center gap-1 text-xs">
									<Star class="text-amber-500 size-3.5 fill-current" />
									<span class="text-foreground font-medium">
										{listing.sellerInfo.rating.toFixed(1)}
									</span>
									<span class="text-muted-foreground">
										({listing.sellerInfo.reviewCount})
									</span>
								</span>
							</div>
							<ChevronRight class="text-muted-foreground group-hover:text-foreground size-4 shrink-0 transition-colors" />
						</a>
						<Button
							href="/app/chat/nuevo/{listing.sellerInfo.username}"
							size="lg"
							class="px-4 shrink-0"
						>
							<MessagesSquare class="size-4" />
							Chat
						</Button>
					</div>
				</div>

				<Separator />

				<div class="flex flex-col gap-2">
					<h2 class="text-muted-foreground text-[10px] tracking-wider uppercase">Descripción</h2>
					<p class="text-sm leading-relaxed">{listing.description}</p>
				</div>

				<div class="border-border bg-muted/50 flex flex-col gap-3 rounded-2xl border p-4">
					<div class="flex flex-col gap-1 text-center">
						<h2 class="text-base font-medium">
							¿Dudas? Resuélvelas al momento
						</h2>
						<p class="text-muted-foreground text-xs">
							Consúltalo con la comunidad o pregúntale a la IA.
						</p>
					</div>
					<div class="flex gap-2">
						<Button
							href="/app/comunidad"
							variant="outline"
							class="h-full w-full flex-1 flex-col gap-1 rounded-xl py-3"
						>
							<Users class="size-5" />
							<span>Comunidad</span>
						</Button>
						<Button
							href={perplexityUrl}
							variant="outline"
							target="_blank"
							rel="noopener noreferrer"
							class="h-full w-full flex-1 flex-col gap-1 rounded-xl py-3"
						>
							<Sparkles class="size-5" />
							<span>Preguntar a la IA</span>
						</Button>
					</div>
				</div>
			</div>
		</div>

		{#if displayWishes.length > 0}
			<section class="flex flex-col gap-3" aria-label="Está buscando">
				<h2 class="text-lg font-medium">Está buscando</h2>
				<div
					class="-mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:px-6"
					style="scroll-snap-type: x mandatory; scroll-padding-left: 1rem;"
				>
					<div class="flex w-max gap-2">
						{#each displayWishes as w}
							<a
								href="/app/perfil/{listing.sellerInfo.username}"
								class="bg-card ring-foreground/10 flex w-72 shrink-0 snap-start items-center gap-3 rounded-xl p-3 text-left ring-1"
							>
								<span class="flex min-w-0 flex-1 flex-col gap-0.5">
									<span class="flex items-center gap-1">
										<span class="truncate text-sm font-medium">{w.keywords}</span>
										{#if w.id === listing?.wishId}
											<Badge
												variant="secondary"
												class="shrink-0 text-[10px] tracking-wider uppercase"
											>
												Deseado
											</Badge>
										{/if}
									</span>
									<span class="text-muted-foreground truncate text-xs">{w.location}</span>
									<span class="text-muted-foreground text-xs">{wishPriceLabel(w)}</span>
								</span>
								<ChevronRight class="text-muted-foreground size-4 shrink-0" />
							</a>
						{/each}
					</div>
				</div>
			</section>
		{/if}

		{#if sellerListings.length > 0}
			<section class="flex flex-col gap-4" aria-label="Este vendedor también tiene">
				<h2 class="text-lg font-medium">Este vendedor también tiene</h2>
				<div class="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
					{#each sellerListings as item (item.id)}
						<a
							href={listingHref(item)}
							class="group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
						>
							<div class="flex flex-col">
								<div class="border-border bg-muted relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-2xl border transition-opacity group-hover:opacity-90">
									<img
										src={item.images[0]}
										alt={item.title}
										loading="lazy"
										class="absolute inset-0 h-full w-full object-cover"
									/>
									{#each item.type as t (t)}
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
									<span class="text-sm leading-snug font-medium">
										{item.title}
									</span>
									<div class="text-muted-foreground flex items-center justify-between gap-2 text-xs">
										<span class="flex min-w-0 items-center gap-1.5">
											<MapPin class="size-3 shrink-0" />
											<span class="truncate">{item.location}</span>
										</span>
										<span class="text-foreground shrink-0 text-sm font-semibold">
											{item.price} €
										</span>
									</div>
								</div>
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/if}
	{/if}
</div>
