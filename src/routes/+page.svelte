<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import WaitlistForm from "$lib/components/waitlist/WaitlistForm.svelte";
	import { fade } from "svelte/transition";
	import {
		Sprout,
		Leaf,
		Scissors,
		MapPin,
		MessageCircle,
		Star,
		ShieldCheck,
		Camera,
		ShoppingBasket,
		Shovel,
		Recycle,
		Heart,
	} from "lucide-svelte/icons";

	const img = (id: string, w = 320, h = 320) =>
		`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=70`;

	const demoListings = [
		{
			name: "Monstera deliciosa",
			place: "Chamberí, Madrid",
			rating: "4.9",
			reviews: "38",
			price: "12 €",
			img: img("1614594975525-e45190c55d0b", 640, 640),
		},
		{
			name: "Aloe vera en maceta",
			place: "Lavapiés, Madrid",
			rating: "5.0",
			reviews: "12",
			price: "6 €",
			img: img("1509423350716-97f9360b4e09", 640, 640),
		},
		{
			name: "Suculentas variadas",
			place: "Malasaña, Madrid",
			rating: "4.8",
			reviews: "25",
			price: "9 €",
			img: img("1485955900006-10f4d324d411", 640, 640),
		},
	];

	const categories = [
		{ name: "Semillas", icon: Sprout },
		{ name: "Esquejes", icon: Scissors },
		{ name: "Plantas", icon: Leaf },
		{ name: "Tiestos", icon: ShoppingBasket },
		{ name: "Accesorios", icon: Shovel },
	];

	const steps = [
		{
			icon: Camera,
			title: "Publica tu planta",
			text: "Sube fotos, pon un precio y elige la categoría. En minutos tu anuncio estará activo.",
		},
		{
			icon: MapPin,
			title: "Encuentra tu planta",
			text: "Busca por texto, categoría o mapa, y filtra por precio y ubicación.",
		},
		{
			icon: MessageCircle,
			title: "Acuerda el trato",
			text: "Chatea con quien la cuida, acuerda cómo y dónde, y dale un nuevo hogar.",
		},
	];

	let active = $state(0);
	let paused = $state(false);
	const reducedMotion =
		typeof window !== "undefined" &&
		window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	$effect(() => {
		if (paused || reducedMotion) return;
		const timer = setInterval(
			() => (active = (active + 1) % demoListings.length),
			4000,
		);
		return () => clearInterval(timer);
	});
</script>

<svelte:head>
	<title>Botanic — La segunda vida de las plantas</title>
	<meta
		name="description"
		content="Botanic conecta a plant lovers para vender, cambiar y regalar plantas, semillas, esquejes y tiestos. Dale una segunda vida a tus plantas."
	/>
	<meta property="og:title" content="Botanic — La segunda vida de las plantas" />
	<meta
		property="og:description"
		content="Saca más partido a tus plantas y encuentra las que siempre quisiste. Vender, cambiar o regalar."
	/>
	<meta property="og:type" content="website" />
</svelte:head>

<!-- Navbar -->
<nav class="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
	<div class="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
		<a href="/" class="flex items-center gap-2 text-lg font-bold tracking-tight">
			<span class="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
				<Sprout class="size-5" aria-hidden="true" />
			</span>
			Botanic
		</a>
		<Button href="#waitlist" size="sm">Únete a la waitlist</Button>
	</div>
</nav>

<!-- Hero -->
<section class="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-12 pb-16 md:grid-cols-2 md:gap-14 md:px-6 md:pt-20 md:pb-24">
	<div class="flex flex-col items-start gap-5">
		<span
			class="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground"
		>
			<Recycle class="size-3.5" aria-hidden="true" />
			La economía circular de las plantas
		</span>
		<h1 class="text-4xl leading-[1.05] font-light text-balance md:text-6xl">
			Dale una <strong class="font-semibold">segunda vida</strong> a tus plantas
		</h1>
		<p class="max-w-md text-lg text-muted-foreground">
			Saca más partido a tus plantas y encuentra las que siempre quisiste. Vender, cambiar o
			regalar: las plantas nunca se tiran, cambian de manos.
		</p>
		<Button href="#waitlist" size="lg" class="h-12 px-8 text-base">Únete a la waitlist</Button>
		<span class="text-sm text-muted-foreground">Pronto · sé de los primeros en entrar</span>
	</div>

		<div
			class="relative"
			role="group"
			onpointerenter={() => (paused = true)}
			onpointerleave={() => (paused = false)}
			onfocusin={() => (paused = true)}
			onfocusout={() => (paused = false)}
		>
			{#key active}
				{@const listing = demoListings[active]}
				<article
					class="mx-auto max-w-96 overflow-hidden rounded-2xl border border-border bg-card transition:fade={{ duration: 400 }}"
				>
					<img
						src={listing.img}
						alt={listing.name}
						width="640"
						height="640"
						loading="lazy"
						class="aspect-square w-full object-cover"
					/>
					<div class="p-3">
						<div class="flex items-start justify-between gap-2">
							<div class="min-w-0">
								<h3 class="truncate text-sm font-semibold">{listing.name}</h3>
								<p class="flex items-center gap-1 text-xs text-muted-foreground">
									<MapPin class="size-3" aria-hidden="true" />
									{listing.place}
								</p>
								<p class="flex items-center gap-1 text-xs">
									<Star class="size-3 fill-star text-star" aria-hidden="true" />
									<span class="font-semibold">{listing.rating}</span>
									<span class="text-muted-foreground">({listing.reviews})</span>
								</p>
							</div>
							<span class="shrink-0 text-sm font-bold">{listing.price}</span>
						</div>
					</div>
				</article>
			{/key}

			<div class="mt-3 flex justify-center gap-1.5">
				{#each demoListings as item, i}
					<button
						type="button"
						class="size-2 rounded-full transition-colors {i === active ? 'bg-primary' : 'bg-border'}"
						aria-label="Ver {item.name}"
						onclick={() => (active = i)}
					></button>
				{/each}
			</div>
		</div>
</section>

<!-- Categorías -->
<section class="relative overflow-hidden border-y border-border/70 bg-muted/40">
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
<section class="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
	<div class="mb-10 max-w-2xl">
		<h2 class="text-3xl leading-tight font-light md:text-4xl">
			Las plantas se <strong class="font-semibold">comparten</strong>, no se
			<strong class="font-semibold">desperdician</strong>
		</h2>
		<p class="mt-3 text-muted-foreground">
			Botanic conecta a plant lovers que quieren vender, cambiar o regalar lo que ya no usan
			con quien lo está buscando. La economía circular, hecha fácil.
		</p>
	</div>
	<div class="grid gap-4 md:grid-cols-2">
		<article
			class="flex items-center gap-5 rounded-2xl border border-border bg-card p-4"
		>
			<img
				src={img("1711915744121", 640, 640)}
				alt="Una persona sosteniendo una planta en maceta"
				width="640"
				height="640"
				loading="lazy"
				class="size-28 shrink-0 rounded-2xl object-cover md:size-44"
			/>
			<div class="min-w-0">
				<h3 class="text-lg font-semibold">Para vendedores</h3>
				<p class="mt-1.5 text-sm text-muted-foreground">
					Convierte tus esquejes en algo útil y da salida a lo que ya no usas. Publica en
					minutos.
				</p>
			</div>
		</article>
		<article
			class="flex items-center gap-5 rounded-2xl border border-border bg-card p-4"
		>
			<img
				src={img("1714379773066", 640, 640)}
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

<!-- Cómo funciona -->
<section class="border-y border-border/70 bg-muted/40">
	<div class="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
		<div class="mb-10 max-w-2xl">
			<h2 class="text-3xl leading-tight font-light md:text-4xl">
				Cómo <strong class="font-semibold">funciona</strong>
			</h2>
			<p class="mt-3 text-muted-foreground">
				Tres pasos simples para vender, cambiar o conseguir plantas
			</p>
		</div>
		<div class="grid gap-4 md:grid-cols-3">
			{#each steps as step, i}
				<div class="rounded-2xl border border-border bg-card p-6">
					<span class="text-sm font-extrabold text-primary">0{i + 1}</span>
					<div class="my-3 grid size-10 place-items-center rounded-lg bg-secondary text-secondary-foreground">
						<step.icon class="size-5" aria-hidden="true" />
					</div>
					<h3 class="text-lg font-semibold">{step.title}</h3>
					<p class="mt-1.5 text-sm text-muted-foreground">{step.text}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Por qué Botanic -->
<section class="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
	<div class="mb-10 max-w-2xl">
		<h2 class="text-3xl leading-tight font-light md:text-4xl">
			¿Por qué <strong class="font-semibold">Botanic</strong>?
		</h2>
		<p class="mt-3 text-muted-foreground">Pensado para la comunidad plant lover</p>
	</div>
	<div class="grid gap-4 md:grid-cols-3">
		<div class="rounded-2xl border border-border bg-card p-6">
			<div class="mb-3 grid size-10 place-items-center rounded-lg bg-secondary text-secondary-foreground">
				<ShieldCheck class="size-5" aria-hidden="true" />
			</div>
			<h3 class="text-lg font-semibold">Pensado para plantas</h3>
			<p class="mt-1.5 text-sm text-muted-foreground">
				Categorías, filtros y lenguaje propios del mundo vegetal. Nada de subcategorías
				perdidas.
			</p>
		</div>
		<div class="rounded-2xl border border-border bg-card p-6">
			<div class="mb-3 grid size-10 place-items-center rounded-lg bg-secondary text-secondary-foreground">
				<MapPin class="size-5" aria-hidden="true" />
			</div>
			<h3 class="text-lg font-semibold">Sostenible por naturaleza</h3>
			<p class="mt-1.5 text-sm text-muted-foreground">
				Segunda mano, menos transporte, menos residuos: dar nueva vida a las plantas es el
				gesto más verde.
			</p>
		</div>
		<div class="rounded-2xl border border-border bg-card p-6">
			<div class="mb-3 grid size-10 place-items-center rounded-lg bg-secondary text-secondary-foreground">
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
<section id="waitlist" class="relative scroll-mt-16 overflow-hidden bg-secondary/70 px-4 py-16 md:py-20">
	<div class="mesh" aria-hidden="true">
		<div class="mesh-a"></div>
		<div class="mesh-b"></div>
	</div>
	<div class="relative mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
		<h2 class="text-3xl leading-tight font-light md:text-4xl">
			Sé de los <strong class="font-semibold">primeros</strong> en entrar
		</h2>
		<p class="max-w-md text-muted-foreground">
			Déjanos tu email y te avisaremos en cuanto Botanic abra. Cero spam, solo cuando haya
			novedades.
		</p>
		<div class="mt-2">
			<WaitlistForm />
		</div>
	</div>
</section>

<!-- Footer -->
<footer
	class="flex flex-col items-center gap-2 border-t border-border/70 px-4 py-8 text-center text-xs text-muted-foreground"
>
	<p>
		© 2026 Botanic. Hecho con
		<Heart class="inline size-3.5 fill-destructive text-destructive" aria-hidden="true" /> para la
		comunidad plant lover.
	</p>
</footer>

<style>
	.mesh {
		position: absolute;
		inset: -15%;
		pointer-events: none;
		z-index: 0;
		animation: mesh-drift 40s ease-in-out infinite alternate;
	}

	.mesh-a,
	.mesh-b {
		position: absolute;
		inset: 0;
		animation: mesh-breathe 14s ease-in-out infinite alternate;
	}

	.mesh-b {
		animation-delay: -7s;
	}

	.mesh-a {
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

	.mesh-b {
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

	:global(.dark) .mesh-a {
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

	:global(.dark) .mesh-b {
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

	@keyframes mesh-drift {
		from {
			transform: translate3d(-1.5%, -1%, 0) rotate(-1deg);
		}
		to {
			transform: translate3d(1.5%, 1%, 0) rotate(1deg);
		}
	}

	@keyframes mesh-breathe {
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
		.mesh-b {
			animation: none;
		}
	}
</style>
