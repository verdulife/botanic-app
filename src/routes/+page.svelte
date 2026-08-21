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
		Heart,
		Recycle,
		Users,
		MessagesSquare,
		Store,
	} from "lucide-svelte/icons";

	const demoListings = [
		{
			name: "Monstera deliciosa",
			place: "Olivella, Barcelona",
			rating: "4.9",
			reviews: "38",
			price: "12 €",
			img: "/images/monstera.jpg",
		},
		{
			name: "Aloe vera en maceta",
			place: "Sitges, Barcelona",
			rating: "5.0",
			reviews: "12",
			price: "6 €",
			img: "/images/aloe.jpg",
		},
		{
			name: "Suculentas variadas",
			place: "Les Botigues de Sitges, Barcelona",
			rating: "4.8",
			reviews: "25",
			price: "9 €",
			img: "/images/suculentas.jpg",
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
			number: "01",
			icon: Users,
			image: "/images/vendedores.jpg",
			title: "Particular a particular",
			shortDescription: "Entre personas, cerca de ti.",
			longDescription:
				"Compra, vende, cambia o regala entre personas de tu zona. Sin intermediarios, sin comisiones, sin tiendas.",
			bullets: ["Sin intermediarios", "Cerca de tu zona"],
			coming: false,
		},
		{
			number: "02",
			icon: Heart,
			image: "/images/compradores.jpg",
			title: "Deseos",
			shortDescription: "Te avisamos cuando alguien la publique.",
			longDescription:
				"Dinos qué plantas buscas y te avisamos al instante cuando alguien las publique. Como una wishlist, pero supervitaminada.",
			bullets: ["Avisos al instante", "Sin listas genéricas"],
			coming: false,
		},
		{
			number: "03",
			icon: MessagesSquare,
			image: "/images/aloe.jpg",
			title: "Comunidad",
			shortDescription: "Consejos reales entre Plant Lovers.",
			longDescription:
				"Un espacio para preguntar, compartir consejos y aprender de gente que cuida plantas como tú.",
			bullets: ["Consejos reales", "De Plant Lovers para Plant Lovers"],
			coming: true,
		},
		{
			number: "04",
			icon: Store,
			image: "/images/suculentas.jpg",
			title: "El Market de Botanic",
			shortDescription: "Profesionales y tiendas del sector.",
			longDescription:
				"Viveros, jardineros, iluminación, tiestos, abonos y todo lo que tu jardín necesita, en un solo catálogo.",
			bullets: ["Viveros, jardineros, iluminación", "Un solo catálogo"],
			coming: true,
		},
	];

	const ROTATION_MS_DESKTOP = 4000;
	const ROTATION_MS_MOBILE = 5000;

	let activeIndex = $state(0);
	let paused = $state(false);
	let isMobile = $state(false);

	$effect(() => {
		if (typeof window === "undefined") return;
		const mq = window.matchMedia("(max-width: 767px)");
		isMobile = mq.matches;
		const handler = (e: MediaQueryListEvent) => (isMobile = e.matches);
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	});

	$effect(() => {
		if (typeof window === "undefined") return;
		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (reducedMotion) return;
		const ms = isMobile ? ROTATION_MS_MOBILE : ROTATION_MS_DESKTOP;
		const id = setInterval(() => {
			if (!paused) {
				activeIndex = (activeIndex + 1) % features.length;
			}
		}, ms);
		return () => clearInterval(id);
	});

	function setActive(i: number) {
		activeIndex = i;
		paused = true;
	}

	function next() {
		activeIndex = (activeIndex + 1) % features.length;
		paused = true;
	}

	function prev() {
		activeIndex = (activeIndex - 1 + features.length) % features.length;
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
<section class="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-24 pb-32 md:grid-cols-2 md:gap-16 md:px-8 md:pt-36 md:pb-40">
	<div class="flex flex-col items-start gap-5">
		<p class="eyebrow tracking-wide">Pensada para Plant Lovers</p>
		<h1 class="text-4xl leading-[1.05] text-balance md:text-6xl">
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
	<div class="relative mx-auto max-w-6xl px-4 md:px-6">
		<div class="mb-6 text-center md:mb-8">
			<p class="eyebrow">Categorías principales</p>
			<h2 class="mt-2 text-4xl leading-tight text-still-950 md:text-5xl">Lo que encuentras en Botanic</h2>
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
	onmouseenter={() => (paused = true)}
	onmouseleave={resume}
	aria-roledescription="carrusel"
	aria-label="Funciones de Botanic"
>
	<div class="mx-auto mb-12 max-w-2xl text-center md:mb-16">
		<p class="eyebrow">Botanic es más</p>
		<h2 class="mt-2 text-4xl leading-tight text-still-950 md:text-5xl">Lo que vas a poder hacer cuando abramos Botanic</h2>
		<p class="mt-3 text-foreground">Cuatro funciones para cubrir todas las necesidades de los amantes de las plantas y la huerta.</p>
	</div>

	<!-- Móvil: scroll horizontal con peek, full-bleed -->
	<div class="md:hidden -mx-4">
		<div class="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
			{#each features as feature, i}
				<button
					type="button"
					onclick={() => setActive(i)}
					aria-expanded={i === activeIndex}
					aria-label="{feature.title}: {feature.shortDescription}"
					class="snap-center shrink-0 basis-[88%] relative aspect-[3/4] overflow-hidden rounded-2xl border text-left transition-all duration-300 hover:border-still-400 {i ===
					activeIndex
						? 'border-still-400 shadow-md'
						: 'border-border'}"
				>
					<img
						src={feature.image}
						alt=""
						aria-hidden="true"
						class="absolute inset-0 h-full w-full object-cover"
					/>
					<div
						class="absolute inset-0 bg-gradient-to-t from-still-950/80 via-still-950/30 to-transparent"
						aria-hidden="true"
					></div>
					<div class="relative flex h-full flex-col justify-between p-5">
						<div class="flex items-center justify-between gap-2">
							<span class="eyebrow text-still-300">{feature.number}</span>
							{#if feature.coming}
								<span
									class="eyebrow rounded-full bg-tranquil-400 px-2.5 py-0.5 text-still-950"
								>
									Próximamente
								</span>
							{/if}
						</div>
						<div>
							<h3
								class="text-center text-background leading-tight transition-all duration-300 {i ===
								activeIndex
									? 'text-3xl'
									: 'text-xl'}"
							>
								{feature.title}
							</h3>
							{#if i === activeIndex}
								<p class="mt-3 text-center text-sm text-linen-50/85">{feature.shortDescription}</p>
								<p class="mt-2 text-center text-sm text-linen-50/85">{feature.longDescription}</p>
								<ul class="mt-4 space-y-1">
									{#each feature.bullets as bullet}
										<li class="text-center text-sm text-linen-50/85">— {bullet}</li>
									{/each}
								</ul>
							{/if}
						</div>
					</div>
				</button>
			{/each}
		</div>
	</div>

	<!-- Desktop: grid 4 cols full-bleed, card activa expandida -->
	<div class="hidden md:grid md:grid-cols-4 md:gap-4 items-start">
		{#each features as feature, i}
			<button
				type="button"
				onclick={() => setActive(i)}
				aria-expanded={i === activeIndex}
				aria-label="{feature.title}: {feature.shortDescription}"
				class="relative aspect-[3/4] overflow-hidden rounded-2xl border text-left transition-all duration-300 hover:border-still-400 {i ===
				activeIndex
					? 'border-still-400 shadow-md'
					: 'border-border'}"
			>
				<img
					src={feature.image}
					alt=""
					aria-hidden="true"
					class="absolute inset-0 h-full w-full object-cover"
				/>
				<div
					class="absolute inset-0 bg-gradient-to-t from-still-950/80 via-still-950/30 to-transparent"
					aria-hidden="true"
				></div>
				<div class="relative flex h-full flex-col justify-between p-5 md:p-6">
					<div class="flex items-center justify-between gap-2">
						<span class="eyebrow text-still-300">{feature.number}</span>
						{#if feature.coming}
							<span
								class="eyebrow rounded-full bg-tranquil-400 px-2.5 py-0.5 text-still-950"
							>
								Próximamente
							</span>
						{/if}
					</div>
					<div>
						<h3
							class="text-center text-background leading-tight transition-all duration-300 {i ===
							activeIndex
								? 'text-3xl md:text-4xl'
								: 'text-xl md:text-2xl'}"
						>
							{feature.title}
						</h3>
						{#if i === activeIndex}
							<p class="mt-3 text-center text-sm text-linen-50/85">{feature.shortDescription}</p>
							<p class="mt-2 text-center text-sm text-linen-50/85">{feature.longDescription}</p>
							<ul class="mt-4 space-y-1">
								{#each feature.bullets as bullet}
									<li class="text-center text-sm text-linen-50/85">— {bullet}</li>
								{/each}
							</ul>
						{/if}
					</div>
				</div>
			</button>
		{/each}
	</div>

	<!-- Pills de navegación -->
	<div class="mt-8 flex flex-wrap items-center justify-center gap-2 px-4">
		{#each features as feature, i}
			<button
				type="button"
				onclick={() => setActive(i)}
				aria-pressed={i === activeIndex}
				class="rounded-full border px-4 py-2 text-sm transition-colors duration-200 {i ===
				activeIndex
					? 'border-still-400 bg-still-50 font-medium text-still-700'
					: 'border-border text-muted-foreground hover:border-still-300 hover:text-foreground'}"
			>
				{feature.title}
			</button>
		{/each}
	</div>
</section>

<!-- ¿Qué es Botanic? -->
<section class="mx-auto max-w-6xl px-4 pt-32 pb-16 md:px-6 md:pt-36 md:pb-20">
	<div
		class="rounded-3xl border border-border bg-secondary/40 px-6 py-14 md:px-12 md:py-16"
	>
		<div class="mx-auto max-w-2xl text-center">
			<p class="eyebrow tracking-wide">¿Qué es Botanic?</p>
			<h2 class="mt-2 text-4xl leading-tight text-balance md:text-[2.875rem]">
				La app donde las plantas <strong>conocen a gente nueva</strong>
			</h2>
			<p class="mt-3 text-pretty text-muted-foreground">
				Botanic es una aplicación para la comunidad de Plant Lovers. Publica tus plantas,
				esquejes, semillas o tiestos y encuentra a quien los quiera: para venderlos,
				cambiarlos o regalarlos.
			</p>
		</div>
		<div class="mt-10 flex flex-wrap items-center justify-center gap-2.5">
			<span
				class="eyebrow inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2"
			>
				<Leaf class="size-3 text-still-600" aria-hidden="true" />
				Solo plantas — pensado para el mundo vegetal
			</span>
			<span
				class="eyebrow inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2"
			>
				<Heart class="size-3 text-still-600" aria-hidden="true" />
				Comunidad — entre gente que cuida plantas
			</span>
			<span
				class="eyebrow inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2"
			>
				<Recycle class="size-3 text-still-600" aria-hidden="true" />
				Segunda vida — la economía circular, hecha fácil
			</span>
		</div>
	</div>
</section>

<!-- Manifiesto -->
<section class="mx-auto max-w-6xl px-4 pt-24 md:px-6 md:pt-28">
	<div class="mx-auto mb-10 max-w-2xl text-center">
		<h2 class="text-4xl leading-tight text-balance md:text-[2.875rem]">
			Las plantas se <strong>comparten</strong> y así
			<strong>conocen a gente nueva</strong>
		</h2>
		<p class="mt-3 text-pretty text-muted-foreground">
			Botanic conecta a <strong>Plant Lovers</strong> que quieren presentar sus plantas a gente que las quiera
			con quien está buscando su próxima favorita. La economía circular, hecha fácil.
		</p>
	</div>
	<div class="grid gap-4 md:grid-cols-2">
		<article
			class="flex items-center gap-5 rounded-2xl border border-border bg-card p-4"
		>
			<img
				src="/images/vendedores.jpg"
				alt="Una persona sosteniendo una planta en maceta"
				width="640"
				height="640"
				loading="lazy"
				class="size-28 shrink-0 rounded-2xl object-cover md:size-44"
			/>
			<div class="min-w-0">
				<h3 class="text-lg">Para vendedores</h3>
				<p class="mt-1.5 text-sm text-muted-foreground">
					Da a tus plantas la oportunidad de conocer a quien las va a cuidar. Publica en
					minutos.
				</p>
			</div>
		</article>
		<article
			class="flex items-center gap-5 rounded-2xl border border-border bg-card p-4"
		>
			<img
				src="/images/compradores.jpg"
				alt="Manos acercándose a una planta en maceta blanca"
				width="640"
				height="640"
				loading="lazy"
				class="size-28 shrink-0 rounded-2xl object-cover md:size-44"
			/>
			<div class="min-w-0">
				<h3 class="text-lg">Para compradores</h3>
				<p class="mt-1.5 text-sm text-muted-foreground">
					Encuentra plantas únicas que no verás en tiendas y trátalas directamente con quien
					las cuida.
				</p>
			</div>
		</article>
	</div>
</section>

<!-- Por qué Botanic -->
<section class="mx-auto max-w-6xl px-4 py-24 md:px-6 md:py-28">
	<div class="mx-auto mb-10 max-w-2xl text-center">
		<h2 class="text-4xl leading-tight text-balance md:text-[2.875rem]">
			¿Por qué <strong>Botanic</strong>?
		</h2>
		<p class="mt-3 text-pretty text-muted-foreground">
			Pensado para la comunidad <strong>Plant Lovers</strong>
		</p>
	</div>
	<div class="divide-y divide-border md:grid md:grid-cols-3 md:divide-y-0">
		<div class="py-6 text-center md:py-0 md:pr-12">
			<div class="mx-auto mb-3 grid size-10 place-items-center rounded-lg bg-secondary text-secondary-foreground">
				<ShieldCheck class="size-5" aria-hidden="true" />
			</div>
			<h3 class="text-lg">Pensado para plantas</h3>
			<p class="mt-1.5 text-sm text-muted-foreground">
				Categorías, filtros y lenguaje propios del mundo vegetal. Nada de subcategorías
				perdidas.
			</p>
		</div>
		<div class="py-6 text-center md:border-l md:border-border md:px-12 md:py-0">
			<div class="mx-auto mb-3 grid size-10 place-items-center rounded-lg bg-secondary text-secondary-foreground">
				<MapPin class="size-5" aria-hidden="true" />
			</div>
			<h3 class="text-lg">Sostenible por naturaleza</h3>
			<p class="mt-1.5 text-sm text-muted-foreground">
				Segunda mano, menos transporte, menos residuos: hacer que las plantas sigan
				creciendo en nuevos hogares es el gesto más verde.
			</p>
		</div>
		<div class="py-6 text-center md:border-l md:border-border md:py-0 md:pl-12">
			<div class="mx-auto mb-3 grid size-10 place-items-center rounded-lg bg-secondary text-secondary-foreground">
				<Star class="size-5" aria-hidden="true" />
			</div>
			<h3 class="text-lg">Comunidad de confianza</h3>
			<p class="mt-1.5 text-sm text-muted-foreground">
				Valoraciones de 1 a 5 estrellas. Perfiles públicos para que sepas con quién tratas.
			</p>
		</div>
	</div>
</section>

<!-- Waitlist -->
<section class="mx-auto max-w-6xl px-4 py-24 md:px-6">
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
</style>
