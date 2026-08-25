<script lang="ts">
	import { page } from "$app/state";
	import { Input } from "$lib/components/ui/input";
	import { Button } from "$lib/components/ui/button";
	import { Bell, Plus, Search, User, Sprout } from "lucide-svelte/icons";
	import { headerNavItems } from "./nav-items";

	let isAppArea = $derived(page.url.pathname.startsWith("/app"));
	let current = $derived(page.url.pathname);
</script>

<header
	class="border-border bg-card sticky top-0 z-20 flex h-14 items-center gap-2 border-b px-3 sm:gap-3 sm:px-4 md:h-16 md:gap-3 md:px-6"
>
	<a
		href="/app"
		class="flex shrink-0 items-center gap-2"
		aria-label="Ir al inicio de la app"
	>
		<div
			class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-md md:size-9"
		>
			<Sprout class="size-5" />
		</div>
		<span class="hidden text-base font-medium md:inline">Botanic</span>
	</a>

	{#if isAppArea}
		<form
			action="/app/buscar"
			method="get"
			class="relative flex-1"
		>
			<Search
				class="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
			/>
			<Input
				type="text"
				inputmode="search"
				name="q"
				placeholder="Busca esquejes, semillas, plantas..."
				class="h-9 pl-9 text-sm md:h-10 md:text-base"
			/>
		</form>
	{/if}

	{#if isAppArea}
		<nav
			aria-label="Navegación principal"
			class="hidden shrink-0 items-center gap-0.5 md:flex"
		>
			{#each headerNavItems as item}
				{@const active = item.match(current)}
				<a
					href={item.href}
					class="relative inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors"
					class:bg-muted={active}
					class:text-foreground={active}
					class:hover:bg-muted={!active}
					class:text-muted-foreground={!active}
					aria-current={active ? "page" : undefined}
				>
					<span>{item.label}</span>
				</a>
			{/each}
		</nav>
	{/if}

	<nav class="ml-auto flex shrink-0 items-center gap-1 md:gap-2">
		<Button href="/app/publicar" size="default" class="hidden md:inline-flex">
			<Plus class="size-4" />
			Anunciar
		</Button>
		<a
			href="/app/notificaciones"
			class="hover:bg-muted text-muted-foreground hover:text-foreground flex size-9 items-center justify-center rounded-md transition-colors"
			aria-label="Notificaciones"
		>
			<Bell class="size-5" />
		</a>
		<a
			href="/app/perfil"
			class="hover:bg-muted text-muted-foreground hover:text-foreground flex size-9 items-center justify-center rounded-md transition-colors"
			aria-label="Mi perfil"
		>
			<User class="size-5" />
		</a>
	</nav>
</header>
