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
<section class="flex flex-col items-center gap-6 px-6 pt-16 pb-20 text-center md:px-12 md:pt-24 md:pb-28">
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
<section class="bg-muted/50 flex flex-col items-center gap-10 px-6 py-16 md:px-12 md:py-20">
	<div class="flex flex-col items-center gap-3 text-center">
		<h2 class="text-2xl font-bold md:text-3xl">Categorías</h2>
		<p class="text-muted-foreground max-w-md text-sm">
			Todo lo que un plant lover necesita
		</p>
	</div>
	<div class="flex flex-col gap-4 md:grid md:grid-cols-5">
		<Card.Card class="hover:ring-foreground/20 transition-shadow">
			<Card.CardContent class="flex flex-col items-center gap-3 py-8 text-center">
				<div class="bg-primary/10 flex size-12 items-center justify-center rounded-full">
					<Sprout class="text-primary size-6" />
				</div>
				<div class="flex flex-col gap-1">
					<span class="font-medium text-sm">Semillas</span>
					<span class="text-muted-foreground text-xs">120 anuncios</span>
				</div>
				<Badge variant="secondary">Semillas</Badge>
			</Card.CardContent>
		</Card.Card>
		<Card.Card class="hover:ring-foreground/20 transition-shadow">
			<Card.CardContent class="flex flex-col items-center gap-3 py-8 text-center">
				<div class="bg-primary/10 flex size-12 items-center justify-center rounded-full">
					<Leaf class="text-primary size-6" />
				</div>
				<div class="flex flex-col gap-1">
					<span class="font-medium text-sm">Esquejes</span>
					<span class="text-muted-foreground text-xs">80 anuncios</span>
				</div>
				<Badge variant="secondary">Esquejes</Badge>
			</Card.CardContent>
		</Card.Card>
		<Card.Card class="hover:ring-foreground/20 transition-shadow">
			<Card.CardContent class="flex flex-col items-center gap-3 py-8 text-center">
				<div class="bg-primary/10 flex size-12 items-center justify-center rounded-full">
					<Sprout class="text-primary size-6" />
				</div>
				<div class="flex flex-col gap-1">
					<span class="font-medium text-sm">Brotes</span>
					<span class="text-muted-foreground text-xs">45 anuncios</span>
				</div>
				<Badge variant="secondary">Brotes</Badge>
			</Card.CardContent>
		</Card.Card>
		<Card.Card class="hover:ring-foreground/20 transition-shadow">
			<Card.CardContent class="flex flex-col items-center gap-3 py-8 text-center">
				<div class="bg-primary/10 flex size-12 items-center justify-center rounded-full">
					<Leaf class="text-primary size-6" />
				</div>
				<div class="flex flex-col gap-1">
					<span class="font-medium text-sm">Plantas</span>
					<span class="text-muted-foreground text-xs">200 anuncios</span>
				</div>
				<Badge variant="secondary">Plantas</Badge>
			</Card.CardContent>
		</Card.Card>
		<Card.Card class="hover:ring-foreground/20 transition-shadow">
			<Card.CardContent class="flex flex-col items-center gap-3 py-8 text-center">
				<div class="bg-primary/10 flex size-12 items-center justify-center rounded-full">
					<ShoppingCart class="text-primary size-6" />
				</div>
				<div class="flex flex-col gap-1">
					<span class="font-medium text-sm">Tiestos</span>
					<span class="text-muted-foreground text-xs">35 anuncios</span>
				</div>
				<Badge variant="secondary">Tiestos</Badge>
			</Card.CardContent>
		</Card.Card>
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
