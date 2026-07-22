<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { Badge } from "$lib/components/ui/badge";
import {
	Sprout,
	Store,
	Leaf,
	MapPin,
	MessageCircle,
	Star,
	TrendingUp,
	ShieldCheck,
	Camera,
	Heart,
	ShoppingCart,
	User,
} from "lucide-svelte/icons";
</script>

<!-- Navbar -->
<nav class="flex items-center justify-between px-6 py-3 md:px-12">
	<a href="/" class="flex items-center gap-2 font-semibold text-lg">
		<Sprout class="text-primary" />
		Botanic
	</a>
	<div class="hidden items-center gap-6 sm:flex">
		<a href="/explorar" class="text-muted-foreground hover:text-foreground text-sm transition-colors">Explorar</a>
		<a href="/publicar" class="text-muted-foreground hover:text-foreground text-sm transition-colors">Publicar</a>
		<Button variant="default" size="sm">Registrarse</Button>
	</div>
</nav>

<!-- Hero -->
<section class="relative flex flex-col items-center gap-6 overflow-hidden px-6 pt-16 pb-20 text-center md:px-12 md:pt-24 md:pb-28">
	<div class="animate-gradient pointer-events-none absolute inset-0 opacity-40" style="background: linear-gradient(-45deg, oklch(0.228 0.013 107.4 / 0.08), oklch(0.737 0.021 106.9 / 0.05), oklch(0.228 0.013 107.4 / 0.06), oklch(0.58 0.031 107.3 / 0.08));"></div>

	<div class="animate-blob pointer-events-none absolute top-10 left-10 size-72 rounded-full blur-3xl" style="background: oklch(0.58 0.031 107.3 / 0.12);"></div>
	<div class="animate-blob2 pointer-events-none absolute top-20 right-10 size-56 rounded-full blur-3xl" style="background: oklch(0.737 0.021 106.9 / 0.1);"></div>
	<div class="animate-blob3 pointer-events-none absolute bottom-10 left-1/2 size-48 -translate-x-1/2 rounded-full blur-3xl" style="background: oklch(0.228 0.013 107.4 / 0.08);"></div>

	<div class="relative z-10 flex flex-col items-center gap-6">
		<Badge variant="outline" class="gap-1.5">
			<Sprout />
			Marketplace P2P de plantas
		</Badge>
		<h1 class="text-4xl font-bold tracking-tight md:text-6xl">
			Tu marketplace de<br />
			<span class="text-primary">plantas de confianza</span>
		</h1>
		<p class="text-muted-foreground max-w-lg text-base md:text-lg">
			Publica tus esquejes, semillas y plantas. Encuentra lo que buscas cerca de ti.
			Sin envíos, sin comisiones. Solo quedar en mano.
		</p>
		<div class="flex flex-wrap justify-center gap-3">
			<Button variant="default" size="lg">
				<Store data-icon="inline-start" />
				Explorar plantas
			</Button>
			<Button variant="outline" size="lg">
				<Leaf data-icon="inline-start" />
				Publicar anuncio
			</Button>
		</div>
	</div>
</section>

<!-- Stats -->
<section class="bg-muted/50 flex flex-wrap justify-center gap-8 px-6 py-10 md:gap-16 md:py-14">
	<div class="flex flex-col items-center gap-1">
		<span class="text-foreground text-2xl font-bold">500+</span>
		<span class="text-muted-foreground flex items-center gap-1 text-sm">
			<User />
			Usuarios
		</span>
	</div>
	<div class="flex flex-col items-center gap-1">
		<span class="text-foreground text-2xl font-bold">200+</span>
		<span class="text-muted-foreground flex items-center gap-1 text-sm">
			<TrendingUp />
			Anuncios activos
		</span>
	</div>
	<div class="flex flex-col items-center gap-1">
		<span class="text-foreground text-2xl font-bold">50+</span>
		<span class="text-muted-foreground flex items-center gap-1 text-sm">
			<Star />
			Transacciones
		</span>
	</div>
	<div class="flex flex-col items-center gap-1">
		<span class="text-foreground text-2xl font-bold">4.8</span>
		<span class="text-muted-foreground flex items-center gap-1 text-sm">
			<Heart />
			Valoración
		</span>
	</div>
</section>

<!-- How it works -->
<section class="flex flex-col items-center gap-10 px-6 py-16 md:px-12 md:py-20">
	<div class="flex flex-col items-center gap-3 text-center">
		<h2 class="text-2xl font-bold md:text-3xl">Cómo funciona</h2>
		<p class="text-muted-foreground max-w-md text-sm">
			Tres pasos simples para vender o conseguir plantas cerca de ti
		</p>
	</div>
	<div class="flex flex-col gap-6 md:grid md:grid-cols-3">
		<Card.Card class="hover:ring-foreground/20 transition-shadow">
			<Card.CardContent class="flex flex-col items-center gap-4 py-8 text-center">
				<div class="bg-primary/10 flex size-14 items-center justify-center rounded-full">
					<Camera class="text-primary size-6" />
				</div>
				<div class="flex flex-col gap-1.5">
					<Card.CardTitle>Publica tu planta</Card.CardTitle>
					<Card.CardDescription>
						Sube fotos, pon un precio y elige la categoría. En minutos tu anuncio estará activo.
					</Card.CardDescription>
				</div>
			</Card.CardContent>
		</Card.Card>
		<Card.Card class="hover:ring-foreground/20 transition-shadow">
			<Card.CardContent class="flex flex-col items-center gap-4 py-8 text-center">
				<div class="bg-primary/10 flex size-14 items-center justify-center rounded-full">
					<MapPin class="text-primary size-6" />
				</div>
				<div class="flex flex-col gap-1.5">
					<Card.CardTitle>Encuentra cerca</Card.CardTitle>
					<Card.CardDescription>
						Busca por texto, categoría o en el mapa. Filtra por precio y ubicación.
					</Card.CardDescription>
				</div>
			</Card.CardContent>
		</Card.Card>
		<Card.Card class="hover:ring-foreground/20 transition-shadow">
			<Card.CardContent class="flex flex-col items-center gap-4 py-8 text-center">
				<div class="bg-primary/10 flex size-14 items-center justify-center rounded-full">
					<MessageCircle class="text-primary size-6" />
				</div>
				<div class="flex flex-col gap-1.5">
					<Card.CardTitle>Queda en mano</Card.CardTitle>
					<Card.CardDescription>
						Chatea con el vendedor, acuerda un punto de encuentro y recoge tu planta.
					</Card.CardDescription>
				</div>
			</Card.CardContent>
		</Card.Card>
	</div>
</section>

<!-- Categories -->
<section class="flex flex-col items-center gap-10 px-6 py-16 md:px-12 md:py-20" style="background: oklch(0.966 0.005 106.5 / 0.5);">
	<div class="flex flex-col items-center gap-3 text-center">
		<h2 class="text-2xl font-bold md:text-3xl">Categorías</h2>
		<p class="text-muted-foreground max-w-md text-sm">
			Todo lo que un plant lover necesita
		</p>
	</div>
	<div class="flex flex-col gap-4 md:grid md:grid-cols-5">
		{#each [
			{ name: "Semillas", count: "120", icon: Sprout },
			{ name: "Esquejes", count: "80", icon: Leaf },
			{ name: "Brotes", count: "45", icon: Sprout },
			{ name: "Plantas", count: "200", icon: Leaf },
			{ name: "Tiestos", count: "35", icon: ShoppingCart },
		] as cat}
			<Card.Card class="hover:-translate-y-0.5 border-0 ring-1 transition-all duration-200" style="--tw-ring-color: oklch(0.737 0.021 106.9 / 0.3);">
				<Card.CardContent class="flex flex-col items-center gap-3 py-8 text-center">
					<div class="flex size-14 items-center justify-center rounded-2xl" style="background: oklch(0.737 0.021 106.9 / 0.15);">
						<cat.icon class="size-6" style="color: oklch(0.466 0.025 107.4);" />
					</div>
					<div class="flex flex-col gap-0.5">
						<span class="font-semibold text-sm">{cat.name}</span>
						<span class="text-xs" style="color: oklch(0.58 0.031 107.3);">{cat.count} anuncios</span>
					</div>
					<Badge class="rounded-full px-3 text-[10px] font-medium" style="background: oklch(0.228 0.013 107.4 / 0.08); color: oklch(0.228 0.013 107.4);">{cat.name}</Badge>
				</Card.CardContent>
			</Card.Card>
		{/each}
	</div>
</section>

<!-- Features -->
<section class="flex flex-col items-center gap-10 px-6 py-16 md:px-12 md:py-20">
	<div class="flex flex-col items-center gap-3 text-center">
		<h2 class="text-2xl font-bold md:text-3xl">¿Por qué Botanic?</h2>
		<p class="text-muted-foreground max-w-md text-sm">
			Pensado para la comunidad plant lover
		</p>
	</div>
	<div class="flex flex-col gap-4 md:grid md:grid-cols-3">
		<Card.Card class="hover:ring-foreground/20 transition-shadow">
			<Card.CardContent class="flex flex-col gap-3 py-6">
				<div class="flex items-center gap-2">
					<ShieldCheck class="text-primary size-5" />
					<Card.CardTitle>Sin comisiones</Card.CardTitle>
				</div>
				<Card.CardDescription>
					100% gratuito. Los usuarios se pagan fuera de la plataforma, sin intermediarios.
				</Card.CardDescription>
			</Card.CardContent>
		</Card.Card>
		<Card.Card class="hover:ring-foreground/20 transition-shadow">
			<Card.CardContent class="flex flex-col gap-3 py-6">
				<div class="flex items-center gap-2">
					<MapPin class="text-primary size-5" />
					<Card.CardTitle>Solo cerca de ti</Card.CardTitle>
				</div>
				<Card.CardDescription>
					Sin envíos. Queda en mano con el vendedor en tu zona. Más sostenible y sin riesgos.
				</Card.CardDescription>
			</Card.CardContent>
		</Card.Card>
		<Card.Card class="hover:ring-foreground/20 transition-shadow">
			<Card.CardContent class="flex flex-col gap-3 py-6">
				<div class="flex items-center gap-2">
					<Star class="text-primary size-5" />
					<Card.CardTitle>Comunidad de confianza</Card.CardTitle>
				</div>
				<Card.CardDescription>
					Valoraciones de 1 a 5 estrellas. Perfiles públicos para que sepas con quién tratas.
				</Card.CardDescription>
			</Card.CardContent>
		</Card.Card>
	</div>
</section>

<!-- CTA -->
<section class="bg-primary/5 flex flex-col items-center gap-6 px-6 py-16 text-center md:py-20">
	<h2 class="text-2xl font-bold md:text-3xl">Empieza ahora — es gratis</h2>
	<p class="text-muted-foreground max-w-sm text-sm">
		Únete a la comunidad de plant lovers. Publica, encuentra y comparte.
	</p>
	<div class="flex flex-wrap justify-center gap-3">
		<Button variant="default" size="lg">Crear cuenta</Button>
		<Button variant="outline" size="lg">Explorar sin registro</Button>
	</div>
</section>

<!-- Footer -->
<footer class="flex flex-col items-center gap-2 px-6 py-8 text-center text-xs text-muted-foreground">
	<p>© 2026 Botanic. Hecho con 💚 para la comunidad plant lover.</p>
</footer>
