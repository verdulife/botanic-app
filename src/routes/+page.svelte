<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import Logo from "$lib/components/Logo.svelte";
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
	<title>Botanic | Donde las plantas conocen a gente</title>
	<meta
		name="description"
		content="Botanic conecta a Plant Lovers para vender, cambiar y regalar plantas, semillas, esquejes y tiestos. Para que tus plantas conozcan a quien las querrá."
	/>
	<meta name="robots" content="index, follow, max-image-preview:large" />
	<link rel="canonical" href="https://www.botanicapp.es/" />
	<meta property="og:title" content="Botanic | Donde las plantas conocen a gente" />
	<meta
		property="og:description"
		content="Saca más partido a tus plantas y encuentra las que siempre quisiste. Vender, cambiar o regalar."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://www.botanicapp.es/" />
	<meta property="og:site_name" content="Botanic" />
	<meta property="og:locale" content="es_ES" />
	<meta property="og:image" content="https://www.botanicapp.es/og-image.jpg" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="Botanic | Donde las plantas conocen a gente" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Botanic | Donde las plantas conocen a gente" />
	<meta
		name="twitter:description"
		content="Saca más partido a tus plantas y encuentra las que siempre quisiste. Vender, cambiar o regalar."
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

<!-- Hero -->
<section class="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-24 pb-32 md:grid-cols-2 md:gap-16 md:px-8 md:pt-36 md:pb-40">
	<div class="flex flex-col items-start gap-5">
		<a href="/" class="inline-flex items-center">
			<Logo class="h-10" />
		</a>
		<h1 class="text-4xl leading-[1.05] font-light text-balance md:text-6xl">
			Tus plantas quieren <strong class="font-semibold">conocer a gente nueva</strong>
		</h1>
		<p class="max-w-md text-lg text-muted-foreground">
			Saca más partido a tus plantas y encuentra las que siempre quisiste. Vender, cambiar o
			regalar: así tus plantas conocen a gente que las va a cuidar.
		</p>
		<Button href="#waitlist" size="lg" class="mt-2 h-12 px-8 text-base">Únete a la waitlist</Button>
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
									<h3 class="truncate text-base font-semibold">{listing.name}</h3>
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
<section class="mesh-original relative overflow-hidden border-y border-border/70 bg-muted/40">
	<div class="mesh" aria-hidden="true">
		<div class="mesh-a"></div>
		<div class="mesh-b"></div>
	</div>
	<div
		class="relative mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2.5 px-4 py-6 md:px-6"
	>
		{#each categories as cat}
			<span
				class="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium"
			>
				<cat.icon class="size-4 text-primary" aria-hidden="true" />
				{cat.name}
			</span>
		{/each}
	</div>
</section>

<!-- Manifiesto -->
<section class="mx-auto max-w-6xl px-4 pt-24 md:px-6 md:pt-28">
	<div class="mx-auto mb-10 max-w-2xl text-center">
		<h2 class="text-4xl leading-tight font-light text-balance md:text-[2.875rem]">
			Las plantas se <strong class="font-semibold">comparten</strong> y así
			<strong class="font-semibold">conocen a gente nueva</strong>
		</h2>
		<p class="mt-3 text-pretty text-muted-foreground">
			Botanic conecta a <strong class="font-semibold">Plant Lovers</strong> que quieren presentar sus plantas a gente que las quiera
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
				<h3 class="text-lg font-semibold">Para vendedores</h3>
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
				<h3 class="text-lg font-semibold">Para compradores</h3>
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
		<h2 class="text-4xl leading-tight font-light text-balance md:text-[2.875rem]">
			¿Por qué <strong class="font-semibold">Botanic</strong>?
		</h2>
		<p class="mt-3 text-pretty text-muted-foreground">
			Pensado para la comunidad <strong class="font-semibold">Plant Lovers</strong>
		</p>
	</div>
	<div class="divide-y divide-border md:grid md:grid-cols-3 md:divide-y-0">
		<div class="py-6 text-center md:py-0 md:pr-12">
			<div class="mx-auto mb-3 grid size-10 place-items-center rounded-lg bg-secondary text-secondary-foreground">
				<ShieldCheck class="size-5" aria-hidden="true" />
			</div>
			<h3 class="text-lg font-semibold">Pensado para plantas</h3>
			<p class="mt-1.5 text-sm text-muted-foreground">
				Categorías, filtros y lenguaje propios del mundo vegetal. Nada de subcategorías
				perdidas.
			</p>
		</div>
		<div class="py-6 text-center md:border-l md:border-border md:px-12 md:py-0">
			<div class="mx-auto mb-3 grid size-10 place-items-center rounded-lg bg-secondary text-secondary-foreground">
				<MapPin class="size-5" aria-hidden="true" />
			</div>
			<h3 class="text-lg font-semibold">Sostenible por naturaleza</h3>
			<p class="mt-1.5 text-sm text-muted-foreground">
				Segunda mano, menos transporte, menos residuos: hacer que las plantas sigan
				creciendo en nuevos hogares es el gesto más verde.
			</p>
		</div>
		<div class="py-6 text-center md:border-l md:border-border md:py-0 md:pl-12">
			<div class="mx-auto mb-3 grid size-10 place-items-center rounded-lg bg-secondary text-secondary-foreground">
				<Star class="size-5" aria-hidden="true" />
			</div>
			<h3 class="text-lg font-semibold">Comunidad de confianza</h3>
			<p class="mt-1.5 text-sm text-muted-foreground">
				Valoraciones de 1 a 5 estrellas. Perfiles públicos para que sepas con quién tratas.
			</p>
		</div>
	</div>
</section>

<!-- Waitlist -->
<section class="mx-auto max-w-6xl px-4 py-24 md:px-6">
	<div id="waitlist" class="scroll-mt-16">
		<BlogCta />
	</div>
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

	.mesh {
		position: absolute;
		inset: -30%;
		pointer-events: none;
		z-index: 0;
		animation: mesh-drift 8s ease-in-out infinite alternate;
	}

	.mesh-a,
	.mesh-b {
		position: absolute;
		inset: 0;
		filter: saturate(1.5);
		animation: mesh-breathe 3.5s ease-in-out infinite alternate;
	}

	.mesh-b {
		animation-delay: -1.75s;
	}

	.mesh-a {
		background:
			radial-gradient(
				55% 70% at 22% 38%,
				oklch(0.931 0.061 150 / 1),
				transparent 70%
			),
			radial-gradient(
				48% 62% at 74% 28%,
				oklch(0.897 0.1 147 / 0.95),
				transparent 70%
			),
			radial-gradient(
				60% 72% at 58% 78%,
				oklch(0.861 0.128 148 / 0.9),
				transparent 70%
			),
			radial-gradient(
				42% 56% at 88% 62%,
				oklch(0.91 0.014 85 / 0.9),
				transparent 70%
			);
	}

	.mesh-b {
		background:
			radial-gradient(
				56% 66% at 68% 58%,
				oklch(0.931 0.061 150 / 0.95),
				transparent 70%
			),
			radial-gradient(
				46% 62% at 28% 66%,
				oklch(0.897 0.1 147 / 0.9),
				transparent 70%
			),
			radial-gradient(
				58% 70% at 82% 24%,
				oklch(0.861 0.128 148 / 0.85),
				transparent 70%
			),
			radial-gradient(
				44% 56% at 14% 22%,
				oklch(0.91 0.014 85 / 0.85),
				transparent 70%
			);
	}

	:global(.dark) .mesh-a {
		background:
			radial-gradient(
				55% 70% at 22% 38%,
				oklch(0.401 0.218 146 / 0.85),
				transparent 70%
			),
			radial-gradient(
				48% 62% at 74% 28%,
				oklch(0.265 0.159 146 / 0.85),
				transparent 70%
			),
			radial-gradient(
				60% 72% at 58% 78%,
				oklch(0.195 0.122 146 / 0.8),
				transparent 70%
			),
			radial-gradient(
				42% 56% at 88% 62%,
				oklch(0.3 0.028 85 / 0.8),
				transparent 70%
			);
	}

	:global(.dark) .mesh-b {
		background:
			radial-gradient(
				56% 66% at 68% 58%,
				oklch(0.401 0.218 146 / 0.8),
				transparent 70%
			),
			radial-gradient(
				46% 62% at 28% 66%,
				oklch(0.265 0.159 146 / 0.75),
				transparent 70%
			),
			radial-gradient(
				58% 70% at 82% 24%,
				oklch(0.195 0.122 146 / 0.7),
				transparent 70%
			),
			radial-gradient(
				44% 56% at 14% 22%,
				oklch(0.3 0.028 85 / 0.75),
				transparent 70%
			);
	}

	@keyframes mesh-drift {
		from {
			transform: translate3d(-12%, -10%, 0) rotate(-8deg);
		}
		to {
			transform: translate3d(12%, 10%, 0) rotate(8deg);
		}
	}

	@keyframes mesh-breathe {
		from {
			transform: scale(1) translate3d(0, 0, 0);
			opacity: 0.2;
		}
		to {
			transform: scale(1.4) translate3d(4%, 4%, 0);
			opacity: 1;
		}
	}

	.mesh-original .mesh {
		position: absolute;
		inset: -15%;
		pointer-events: none;
		z-index: 0;
		animation: mesh-drift-original 40s ease-in-out infinite alternate;
	}

	.mesh-original .mesh-a,
	.mesh-original .mesh-b {
		position: absolute;
		inset: 0;
		animation: mesh-breathe-original 14s ease-in-out infinite alternate;
	}

	.mesh-original .mesh-b {
		animation-delay: -7s;
	}

	.mesh-original .mesh-a {
		background:
			radial-gradient(
				40% 55% at 22% 38%,
				oklch(0.931 0.061 150 / 0.45),
				transparent 70%
			),
			radial-gradient(
				36% 48% at 74% 28%,
				oklch(0.897 0.1 147 / 0.3),
				transparent 70%
			),
			radial-gradient(
				46% 60% at 58% 78%,
				oklch(0.861 0.128 148 / 0.25),
				transparent 70%
			),
			radial-gradient(
				30% 42% at 88% 62%,
				oklch(0.91 0.014 85 / 0.3),
				transparent 70%
			);
	}

	.mesh-original .mesh-b {
		background:
			radial-gradient(
				42% 52% at 68% 58%,
				oklch(0.931 0.061 150 / 0.4),
				transparent 70%
			),
			radial-gradient(
				34% 50% at 28% 66%,
				oklch(0.897 0.1 147 / 0.28),
				transparent 70%
			),
			radial-gradient(
				44% 58% at 82% 24%,
				oklch(0.861 0.128 148 / 0.22),
				transparent 70%
			),
			radial-gradient(
				32% 44% at 14% 22%,
				oklch(0.91 0.014 85 / 0.28),
				transparent 70%
			);
	}

	:global(.dark) .mesh-original .mesh-a {
		background:
			radial-gradient(
				40% 55% at 22% 38%,
				oklch(0.401 0.218 146 / 0.32),
				transparent 70%
			),
			radial-gradient(
				36% 48% at 74% 28%,
				oklch(0.265 0.159 146 / 0.3),
				transparent 70%
			),
			radial-gradient(
				46% 60% at 58% 78%,
				oklch(0.195 0.122 146 / 0.28),
				transparent 70%
			),
			radial-gradient(
				30% 42% at 88% 62%,
				oklch(0.3 0.028 85 / 0.3),
				transparent 70%
			);
	}

	:global(.dark) .mesh-original .mesh-b {
		background:
			radial-gradient(
				42% 52% at 68% 58%,
				oklch(0.401 0.218 146 / 0.28),
				transparent 70%
			),
			radial-gradient(
				34% 50% at 28% 66%,
				oklch(0.265 0.159 146 / 0.26),
				transparent 70%
			),
			radial-gradient(
				44% 58% at 82% 24%,
				oklch(0.195 0.122 146 / 0.24),
				transparent 70%
			),
			radial-gradient(
				32% 44% at 14% 22%,
				oklch(0.3 0.028 85 / 0.28),
				transparent 70%
			);
	}

	@keyframes mesh-drift-original {
		from {
			transform: translate3d(-1.5%, -1%, 0) rotate(-1deg);
		}
		to {
			transform: translate3d(1.5%, 1%, 0) rotate(1deg);
		}
	}

	@keyframes mesh-breathe-original {
		from {
			opacity: 0.35;
		}
		to {
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.mesh,
		.mesh-a,
		.mesh-b,
		.mesh-original .mesh,
		.mesh-original .mesh-a,
		.mesh-original .mesh-b {
			animation: none;
		}
	}
</style>
