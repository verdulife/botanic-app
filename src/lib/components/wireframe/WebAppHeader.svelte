<script lang="ts">
	import { page } from '$app/state';
	import { Input } from "$lib/components/ui/input";
	import { Button } from "$lib/components/ui/button";
	import { Bell, Search, Sprout } from "lucide-svelte/icons";

	let isAppArea = $derived(page.url.pathname.startsWith("/app"));
	let user = $derived(page.data.user);

	// TODO: Hito 8 — sustituir por query real a notifications
	let unreadCount = $derived(0);
</script>

<header
	class="border-border bg-card/80 sticky top-0 z-20 flex h-16 items-center gap-2 border-b p-3 backdrop-blur-md sm:gap-3 sm:p-4 md:h-24 md:gap-3 md:p-6"
>
	<a
		href="/app"
		class="flex shrink-0 items-center gap-2"
		aria-label="Ir al inicio de la app"
	>
		<div
			class="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-md md:size-11"
		>
			<Sprout class="size-6" />
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
				class="text-muted-foreground absolute top-1/2 left-3.5 size-5 -translate-y-1/2"
			/>
			<Input
				type="text"
				inputmode="search"
				name="q"
				placeholder="Busca esquejes, semillas, plantas..."
				class="h-10 pl-11 text-sm md:h-11 md:text-base"
			/>
		</form>
	{/if}

	<nav class="ml-auto flex shrink-0 items-center gap-1 md:gap-2">
		{#if user}
			<a
				href="/app/notificaciones"
				class="hover:bg-muted text-muted-foreground hover:text-foreground relative flex size-10 items-center justify-center rounded-md transition-colors md:size-11"
				aria-label={unreadCount > 0
					? `Notificaciones (${unreadCount} sin leer)`
					: 'Notificaciones'}
			>
				<Bell class="size-5" />
				{#if unreadCount > 0}
					<span
						class="bg-destructive text-destructive-foreground absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-medium leading-none"
						aria-hidden="true"
					>
						{unreadCount > 9 ? '9+' : unreadCount}
					</span>
				{/if}
			</a>
		{:else}
			<Button href="/app/login" size="sm" class="h-10 md:h-11 inline-flex">
				Entrar
			</Button>
		{/if}
	</nav>
</header>