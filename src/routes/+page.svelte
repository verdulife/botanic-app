<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import AppHeader from "$lib/components/AppHeader.svelte";
	import BlogCta from "$lib/components/blog/BlogCta.svelte";
	import AppFooter from "$lib/components/AppFooter.svelte";
	import {
		Sprout,
		Leaf,
		Scissors,
		MapPin,
		Star,
		ShieldCheck,
		ShoppingBasket,
		Shovel,
	} from "lucide-svelte/icons";

	const demoListings = [
		{
			name: "Monstera deliciosa",
			place: "Olivella, Barcelona",
			rating: "4.9",
			reviews: "38",
			price: "12 €",
			img: "/images/monstera.webp",
		},
		{
			name: "Aloe vera en maceta",
			place: "Sitges, Barcelona",
			rating: "5.0",
			reviews: "12",
			price: "6 €",
			img: "/images/aloe.webp",
		},
		{
			name: "Suculentas variadas",
			place: "Les Botigues de Sitges, Barcelona",
			rating: "4.8",
			reviews: "25",
			price: "9 €",
			img: "/images/suculentas.webp",
		},
	];

	const categories = [
		{ name: "Semillas", icon: Sprout },
		{ name: "Esquejes", icon: Scissors },
		{ name: "Plantas", icon: Leaf },
		{ name: "Tiestos", icon: ShoppingBasket },
		{ name: "Accesorios", icon: Shovel },
	];

	const features = [
		{
			image: "/images/features/p2p.webp",
			title: "Particular a particular",
			shortDescription: "Entre personas, sin intermediarios.",
			longDescription:
				"Compra, vende, cambia o regala plantas directamente entre personas. Sin tiendas de por medio ni comisiones ocultas: tú hablas con la otra persona, acordáis el trato y listo. Una forma cercana y honesta de dar nueva vida a las plantas.",
		},
		{
			image: "/images/features/deseos.webp",
			title: "Deseos",
			shortDescription: "Te avisamos cuando alguien la publique.",
			longDescription:
				"Crea tu lista con esas especies que llevas tiempo buscando y Botanic vigilará cada nuevo anuncio por ti. En cuanto alguien publique una planta que encaje con lo que buscas, recibirás un aviso para no quedarte sin ella. Sin búsquedas repetitivas ni anuncios que no te interesan.",
		},
		{
			image: "/images/features/comunidad.webp",
			title: "Comunidad",
			shortDescription: "Consejos reales entre Plant Lovers.",
			longDescription:
				"Un espacio para preguntar dudas, compartir tus trucos de cuidado y aprender de otros Plant Lovers que ya han pasado por lo mismo. Desde cómo salvar una hoja amarilla hasta qué sustrato funciona mejor: entre todos sabemos más.",
			coming: true,
		},
		{
			image: "/images/features/market.webp",
			title: "El Market de Botanic",
			shortDescription: "Profesionales y tiendas del sector.",
			longDescription:
				"Además de particulares, en el Market encontrarás viveros, tiendas especializadas y profesionales del sector: tiestos, abonos, iluminación, herramientas y todo lo que tus plantas necesitan para crecer. Un único catálogo para completar tu colección.",
			coming: true,
		},
	];

	const ROTATION_MS_DESKTOP = 6000;
	const ROTATION_MS_MOBILE = 7000;

	let activeIndex = $state(0);
	let paused = $state(false);
	let isMobile = $state(false);

	const rotationMs = $derived(isMobile ? ROTATION_MS_MOBILE : ROTATION_MS_DESKTOP);

	$effect(() => {
		if (typeof window === "undefined") return;
		const mq = window.matchMedia("(max-width: 767px)");
		isMobile = mq.matches;
		const handler = (e: MediaQueryListEvent) => (isMobile = e.matches);
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	});

	function setActive(i: number) {
		activeIndex = i;
		paused = true;
	}

	function resume() {
		paused = false;
	}

	const fanCenter = (demoListings.length - 1) / 2;
	let hovered = $state<number | null>(Math.floor(fanCenter));
	let autoPaused = $state(false);
	const fanAngle = 10;
	const fanBaseZ = (i: number) =>
		10 + Math.round(fanCenter - Math.abs(i - fanCenter));
	const fanScale = (i: number) =>
		hovered === null
			? i === Math.floor(fanCenter)
				? 1.04
				: 1
			: hovered === i
				? 1.07
				: 1;

	const reducedMotion =
		typeof window !== "undefined" &&
		window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	$effect(() => {
		if (reducedMotion) return;
		const timer = setInterval(() => {
			if (autoPaused) return;
			hovered =
				hovered === null
					? Math.floor(fanCenter)
					: (hovered + 1) % demoListings.length;
		}, 2500);
		return () => clearInterval(timer);
	});
</script>

<svelte:head>
	<title>Botanic | Donde las plantas conocen a gente nueva</title>
	<meta
		name="description"
		content="Botanic conecta a Plant Lovers para vender, cambiar y regalar plantas, semillas, esquejes y tiestos. Para que tus plantas conozcan a quien las querrá."
	/>
	<meta name="robots" content="index, follow, max-image-preview:large" />
	<link rel="canonical" href="https://www.botanicapp.es/" />
	<meta property="og:title" content="Botanic | Donde las plantas conocen a gente nueva" />
	<meta
		property="og:description"
		content="La app para Plant Lovers. Saca más partido a tus plantas y encuentra las que siempre quisiste: vender, cambiar o regalar."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://www.botanicapp.es/" />
	<meta property="og:site_name" content="Botanic" />
	<meta property="og:locale" content="es_ES" />
	<meta property="og:image" content="https://www.botanicapp.es/og-image.jpg" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="Botanic | Donde las plantas conocen a gente nueva" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Botanic | Donde las plantas conocen a gente nueva" />
	<meta
		name="twitter:description"
		content="La app para Plant Lovers. Saca más partido a tus plantas y encuentra las que siempre quisiste: vender, cambiar o regalar."
	/>
	<meta name="twitter:image" content="https://www.botanicapp.es/og-image.jpg" />
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@graph": [
				{
					"@type": "Organization",
					"@id": "https://www.botanicapp.es/#org",
					"name": "Botanic",
					"url": "https://www.botanicapp.es/",
					"logo": "https://www.botanicapp.es/favicon.svg"
				},
				{
					"@type": "WebSite",
					"@id": "https://www.botanicapp.es/#website",
					"name": "Botanic",
					"url": "https://www.botanicapp.es/",
					"publisher": { "@id": "https://www.botanicapp.es/#org" },
					"inLanguage": "es-ES"
				},
				{
					"@type": "SoftwareApplication",
					"name": "Botanic",
					"url": "https://www.botanicapp.es/app",
					"image": "https://www.botanicapp.es/og-image.jpg",
					"description": "Botanic conecta a Plant Lovers para vender, cambiar y regalar plantas, semillas, esquejes y tiestos. Para que tus plantas conozcan a quien las querrá.",
					"applicationCategory": "ShoppingApplication",
					"operatingSystem": "Web",
					"offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
					"publisher": { "@id": "https://www.botanicapp.es/#org" }
				}
			]
		}
	</script>
</svelte:head>

<AppHeader />

<!-- Hero -->
<section class="mx-auto grid max-w-7xl items-center gap-12 px-6 pt-16 pb-32 md:grid-cols-2 md:gap-16 md:px-8 md:pt-36 md:pb-40">
	<div class="flex flex-col items-center gap-5 text-center md:items-start md:text-left">
		<p class="eyebrow tracking-wide">La app pensada para Plant Lovers</p>
		<h1 class="text-5xl leading-[1.05] text-balance md:text-7xl">
			Donde las <strong>plantas</strong> y la <strong>gente</strong> se conocen
		</h1>
		<p class="max-w-md text-muted-foreground">
			Como las apps de segunda mano que ya conoces, pero solo para plantas y todo lo relacionado con ellas: semillas, esquejes, plantas, tiestos y accesorios. Para Plant Lovers y tu huerta.
		</p>
		<Button href="#waitlist" size="lg" class="mt-2 h-12 px-8 text-base">Unirme a la lista de espera</Button>
		<p class="text-sm text-muted-foreground -mt-1">Acceso anticipado. Apúntate y desbloquea acceso antes que nadie.</p>
	</div>

		<div class="fan-stage relative" role="group">
			<div class="fan">
				{#each demoListings as listing, i}
					<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
					<article
						class="fan-card max-w-56 overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:max-w-60 lg:max-w-72"
						class:fan-lift={
							hovered === i ||
							(hovered === null && i === Math.floor(fanCenter))
						}
						style:--fan-rotate={`${(i - fanCenter) * fanAngle}deg`}
						style:--fan-scale={fanScale(i)}
					style:z-index={hovered === i ? 30 : fanBaseZ(i)}
						tabindex="0"
						aria-label={listing.name}
						onpointerenter={() => {
							autoPaused = true;
							hovered = i;
						}}
						onpointerleave={() => {
							autoPaused = false;
							hovered = null;
						}}
						onfocusin={() => {
							autoPaused = true;
							hovered = i;
						}}
						onfocusout={() => {
							autoPaused = false;
							hovered = null;
						}}
					>
						<div class="p-3.5">
							<img
								src={listing.img}
								alt={listing.name}
								width="640"
								height="640"
								loading="lazy"
								class="aspect-square w-full rounded-xl border border-border/60 object-cover shadow-xs"
							/>
						</div>
						<div class="p-3.5">
							<div class="flex items-start justify-between gap-2">
								<div class="min-w-0">
									<p class="font-display truncate text-base font-normal">{listing.name}</p>
									<p class="flex items-center gap-1 text-sm text-muted-foreground">
										<MapPin class="size-3.5" aria-hidden="true" />
										{listing.place}
									</p>
									<p class="flex items-center gap-1 text-sm">
										<Star class="size-3.5 fill-star text-star" aria-hidden="true" />
										<span class="font-semibold">{listing.rating}</span>
										<span class="text-muted-foreground">({listing.reviews})</span>
									</p>
								</div>
								<span class="shrink-0 text-lg font-bold">{listing.price}</span>
							</div>
						</div>
					</article>
				{/each}
			</div>
		</div>
</section>

<!-- Categorías -->
<section class="relative border-y border-tranquil-300 bg-tranquil-200 py-12 md:py-16">
	<div class="relative mx-auto max-w-7xl px-4 md:px-6">
		<div class="mb-6 text-center md:mb-8">
			<p class="eyebrow">Categorías principales</p>
			<h2 class="mt-2 text-4xl leading-[1.2] text-still-950 md:text-6xl">Lo que encuentras en Botanic</h2>
			<p class="mt-2 text-foreground">Plantas, semillas y todo lo que las cuida, entre particulares.</p>
		</div>
		<div class="flex flex-wrap items-center justify-center gap-2.5">
			{#each categories as cat}
				<span
					class="eyebrow inline-flex items-center gap-2 rounded-full border border-tranquil-500 bg-tranquil-400 px-4 py-2 text-still-950 shadow-xs"
				>
					<cat.icon class="size-3 text-still-950" aria-hidden="true" />
					{cat.name}
				</span>
			{/each}
		</div>
	</div>
</section>

<!-- Qué puedes hacer dentro -->
<section
	class="px-4 py-20 md:px-8 md:py-28"
	aria-label="Funciones de Botanic"
>
	<div class="mx-auto mb-10 max-w-2xl text-center md:mb-12">
		<p class="eyebrow">Botanic es más</p>
		<h2 class="mt-2 text-4xl leading-[1.2] text-still-950 md:text-6xl">Lo que vas a poder hacer cuando abramos Botanic</h2>
		<p class="mt-3 text-foreground">Mientras construimos Botanic, esto es lo que estamos preparando: cuatro funcionalidades para cubrir todas las necesidades de tus plantas y tu huerta.</p>
	</div>

	<div
		class="relative mx-auto max-w-7xl"
		onmouseenter={() => (paused = true)}
		onmouseleave={resume}
		role="region"
		aria-roledescription="carrusel"
	>
		<!-- Móvil: slider scroll-snap con peek -->
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<div
			class="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-1 md:hidden"
			tabindex="0"
			role="group"
			aria-label="Funciones de Botanic"
		>
			<div class="w-[7%] shrink-0" aria-hidden="true"></div>
			{#each features as feature}
				<article
					class="w-[86%] shrink-0 snap-center rounded-2xl border border-border bg-card p-4 shadow-sm"
				>
					<div class="aspect-[4/3] overflow-hidden rounded-xl border border-border shadow-sm">
						<img
							src={feature.image}
							alt={feature.title}
							loading="lazy"
							class="h-full w-full object-cover"
						/>
					</div>

					{#if feature.coming}
						<span
							class="eyebrow mt-4 inline-block rounded-full bg-tranquil-400 px-2.5 py-0.5 text-tranquil-950"
						>
							Próximamente
						</span>
					{:else}
						<span
							class="eyebrow mt-4 inline-block rounded-full bg-still-400 px-2.5 py-0.5 text-still-50"
						>
							Día uno
						</span>
					{/if}

					<h3 class="display-opsz mt-3 text-3xl leading-tight text-balance text-still-950">
						{feature.title}
					</h3>
					<p class="mt-3 text-base font-medium">{feature.shortDescription}</p>
					<p class="mt-2 text-sm leading-relaxed text-muted-foreground">
						{feature.longDescription}
					</p>
				</article>
			{/each}
			<div class="w-[7%] shrink-0" aria-hidden="true"></div>
		</div>

		<!-- Escritorio: card contenedora -->
		<div class="hidden rounded-2xl border border-border bg-card p-4 shadow-sm md:block md:p-6">
			<div class="grid items-center gap-12 md:grid-cols-[40fr_60fr]">
				<div class="relative aspect-video overflow-hidden rounded-xl border border-border shadow-sm md:aspect-square">
				<!-- Imágenes apiladas con cross-fade -->
				{#each features as feature, i}
					<img
						src={feature.image}
						alt=""
						aria-hidden="true"
						class="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out motion-reduce:duration-0 {i ===
						activeIndex
							? 'opacity-100'
							: 'opacity-0'}"
					/>
				{/each}
			</div>

			<!-- Texto con fade suave al cambiar -->
			{#key activeIndex}
				<div class="fade-swap flex flex-col items-start px-1 text-left md:px-4">
					{#if features[activeIndex].coming}
						<span class="eyebrow rounded-full bg-tranquil-400 px-2.5 py-0.5 text-tranquil-950">
							Próximamente
						</span>
					{:else}
						<span class="eyebrow rounded-full bg-still-400 px-2.5 py-0.5 text-still-50">
							Día uno
						</span>
					{/if}

					<h3 class="display-opsz mt-3 max-w-xl text-4xl leading-tight text-still-950 text-balance md:text-5xl">
						{features[activeIndex].title}
					</h3>

					<p class="mt-4 text-lg font-medium">{features[activeIndex].shortDescription}</p>
					<p class="mt-2 max-w-xl text-base leading-relaxed text-muted-foreground">
						{features[activeIndex].longDescription}
					</p>
				</div>
			{/key}
		</div>

		<!-- Divider con progreso de vista (solo escritorio) -->
		<div class="mt-5 hidden h-1 overflow-hidden rounded-full bg-border md:block md:mt-6" aria-hidden="true">
			{#key activeIndex}
				<span
					class="pill-progress block h-full w-full bg-still-600"
					style:animation-duration="{rotationMs}ms"
					style:animation-play-state={paused ? "paused" : "running"}
					onanimationend={() => {
						activeIndex = (activeIndex + 1) % features.length;
						paused = false;
					}}
				></span>
			{/key}
		</div>

		<!-- Pills de navegación (solo escritorio) -->
		<div class="hidden flex-wrap items-center justify-center gap-2 pt-4 md:flex">
			{#each features as feature, i}
				<button
					type="button"
					onclick={() => setActive(i)}
					aria-pressed={i === activeIndex}
					aria-label="Ver {feature.title}"
					class="rounded-full border px-4 py-2 text-sm transition-colors duration-200 {i ===
					activeIndex
						? 'border-still-400 bg-still-50 font-medium text-still-700'
						: 'border-border bg-background text-muted-foreground hover:border-still-400 hover:bg-still-50/50 hover:text-still-700'}"
				>
					{feature.title}
				</button>
			{/each}
		</div>
		</div>
	</div>
</section>

<!-- Por qué Botanic -->
<section class="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
	<div class="mx-auto mb-10 max-w-2xl text-center">
		<h2 class="text-4xl leading-[1.2] text-balance md:text-6xl">
			¿Por qué <strong>Botanic</strong>?
		</h2>
		<p class="mt-3 text-pretty text-muted-foreground">
			Porque no todas las apps de segunda mano entienden de plantas.
		</p>
	</div>
	<div class="divide-y divide-border md:grid md:grid-cols-3 md:divide-y-0">
		<div class="py-6 text-center md:py-0 md:pr-12">
			<div class="mx-auto mb-3 grid size-10 place-items-center rounded-lg bg-secondary text-secondary-foreground">
				<ShieldCheck class="size-5" aria-hidden="true" />
			</div>
			<h3 class="text-lg">Solo plantas, de verdad</h3>
			<p class="mt-1.5 text-muted-foreground">
				Categorías, filtros y lenguaje propios del mundo vegetal. Nada de buscar tus
				esquejes entre bicis y móviles.
			</p>
		</div>
		<div class="py-6 text-center md:border-l md:border-border md:px-12 md:py-0">
			<div class="mx-auto mb-3 grid size-10 place-items-center rounded-lg bg-secondary text-secondary-foreground">
				<MapPin class="size-5" aria-hidden="true" />
			</div>
			<h3 class="text-lg">Sostenible por naturaleza</h3>
			<p class="mt-1.5 text-muted-foreground">
				Cada planta que cambia de casa es un gesto verde: segunda mano, menos transporte,
				menos residuos.
			</p>
		</div>
		<div class="py-6 text-center md:border-l md:border-border md:py-0 md:pl-12">
			<div class="mx-auto mb-3 grid size-10 place-items-center rounded-lg bg-secondary text-secondary-foreground">
				<Star class="size-5" aria-hidden="true" />
			</div>
			<h3 class="text-lg">Comunidad de confianza</h3>
			<p class="mt-1.5 text-muted-foreground">
				Valoraciones de 1 a 5 estrellas y perfiles públicos, para saber con quién tratas
				antes de quedar.
			</p>
		</div>
	</div>
</section>

<!-- Waitlist -->
<section class="mx-auto max-w-7xl px-4 py-10 md:px-6">
	<BlogCta />
</section>

<!-- Footer -->
<AppFooter />

<style>
	.fan-stage {
		perspective: 1400px;
		perspective-origin: 85% 50%;
	}

	.fan {
		display: flex;
		justify-content: center;
		transform: rotateY(-8deg);
	}

	.fan-card {
		transform-origin: 50% 100%;
		transform: scale(var(--fan-scale, 1)) rotate(var(--fan-rotate, 0deg));
		margin-left: -13rem;
		transition:
			transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
			box-shadow 0.35s ease;
	}

	.fan-card:hover,
	.fan-card.fan-lift {
		box-shadow: 0 16px 32px -12px oklch(0.153 0.006 107.1 / 0.28);
	}

	.fan-card:first-child {
		margin-left: 0;
	}

	@media (min-width: 768px) {
		.fan-card {
			margin-left: -11rem;
		}
	}

	.fade-swap {
		animation: feature-fade 300ms ease both;
	}

	@keyframes feature-fade {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.fade-swap {
			animation: none;
		}
	}

	.pill-progress {
		animation-name: pill-progress;
		animation-timing-function: linear;
		animation-fill-mode: forwards;
		transform-origin: left center;
	}

	@keyframes pill-progress {
		from {
			transform: scaleX(0);
		}
		to {
			transform: scaleX(1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.pill-progress {
			display: none;
		}
	}

	.no-scrollbar {
		scrollbar-width: none;
	}

	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
</style>
