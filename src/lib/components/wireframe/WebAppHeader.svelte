<script lang="ts">
	import { page } from '$app/state';
	import Logo from "$lib/components/Logo.svelte";
	import VistaSelector from "$lib/components/wireframe/VistaSelector.svelte";
	import { readVista } from "$lib/mock/url-filters";
	import { Bell, Search } from "lucide-svelte/icons";

	let isAppArea = $derived(page.url.pathname.startsWith("/app"));
	let currentVista = $derived(readVista(page.url.searchParams, page.url.pathname));
	let isMainView = $derived(['lista', 'mapa', 'scroll'].includes(currentVista));
	let user = $derived(page.data.user);

	// TODO: Hito 8 — sustituir por query real a notifications
	let unreadCount = $derived(0);
</script>

<header
	class="border-border bg-card sticky top-0 z-[500] flex h-16 items-center gap-2 border-b p-3 sm:gap-3 sm:p-4 md:h-20 md:gap-3 md:p-6"
>
	<a
		href="/app"
		class="ml-1 flex shrink-0 items-center md:ml-2"
		aria-label="Ir al inicio de la app"
	>
		<Logo class="h-5 md:h-6" />
	</a>

	{#if isAppArea}
		<nav class="ml-auto flex shrink-0 items-center gap-1 md:gap-2" aria-label="Acciones">
			{#if isMainView}
				<a
					href="/app/buscar"
					class="hover:bg-muted text-muted-foreground hover:text-foreground flex size-10 items-center justify-center rounded-md transition-colors md:size-11"
					aria-label="Buscar"
				>
					<Search class="size-5" />
				</a>

				<VistaSelector variant="icon" />
			{/if}

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
			{/if}
		</nav>
	{/if}
</header>