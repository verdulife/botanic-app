<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Logo from "$lib/components/Logo.svelte";
	import { readVista } from "$lib/mock/url-filters";
	import { searchOverlay } from "../../stores/search-overlay.svelte.ts";
	import { ArrowLeft, Bell, Search, X } from "lucide-svelte/icons";

	let isAppArea = $derived(page.url.pathname.startsWith("/app"));
	let currentVista = $derived(readVista(page.url.searchParams, page.url.pathname));
	let isMainView = $derived(['lista', 'mapa', 'scroll'].includes(currentVista));
	let isListingDetail = $derived(page.url.pathname.startsWith('/app/anuncio/'));
	let user = $derived(page.data.user);

	function goBack() {
		if (window.history.length > 1) {
			window.history.back();
		} else {
			goto('/app');
		}
	}

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
			{#if searchOverlay.open}
				<button
					type="button"
					onclick={searchOverlay.toggleSearch}
					class="text-muted-foreground hover:text-foreground hover:bg-muted border-border flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-medium transition-colors"
					aria-label="Cerrar búsqueda"
				>
					<X class="size-4" />
					<span>Cerrar</span>
				</button>
			{:else if isListingDetail}
				<button
					type="button"
					onclick={goBack}
					class="text-muted-foreground hover:text-foreground hover:bg-muted border-border flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-medium transition-colors"
					aria-label="Volver"
				>
					<ArrowLeft class="size-4" />
					<span>Volver</span>
				</button>
			{:else if isMainView}
				<button
					type="button"
					onclick={searchOverlay.toggleSearch}
					class="text-muted-foreground hover:text-foreground hover:bg-muted border-border flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-medium transition-colors"
					aria-label="Buscar"
				>
					<Search class="size-4" />
					<span>Buscar</span>
				</button>
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