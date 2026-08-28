<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { primaryNavItems } from './nav-items';
	import { pushVistaToURL } from '$lib/mock/url-filters';

	let current = $derived(page.url.pathname);

	function handleInicioClick(e: MouseEvent) {
		const path = page.url.pathname;
		const normalized = path.replace(/\/+$/, "") || "/";
		const isLista = normalized === "/app";
		const isMapa = normalized.startsWith("/app/mapa");
		const isScroll = normalized.startsWith("/app/scroll");

		e.preventDefault();

		// Fuera de las 3 vistas (listing, perfil, chat, etc.) → siempre lista
		if (!isLista && !isMapa && !isScroll) {
			pushVistaToURL("/app");
			return;
		}

		// Dentro de una vista → siguiente: lista → mapa → scroll → lista
		const next = isLista ? "/app/mapa" : isMapa ? "/app/scroll" : "/app";
		pushVistaToURL(next);
	}

	let scrollCompact = $state(false);
	let reducedMotion = $state(false);
	let lastScrollY = 0;

	let isCompactRoute = $derived(
		current.startsWith('/app/mapa') || current.startsWith('/app/scroll')
	);
	let compact = $derived(isCompactRoute || scrollCompact);

	let activeIdx = $derived(primaryNavItems.findIndex((i) => i.match(current)));

	let ulEl: HTMLUListElement | undefined = $state();
	let cellWidth = $state(0);
	let cellStart = $state(0);

	$effect(() => {
		if (!browser || !ulEl) return;
		const measure = () => {
			const firstLi = ulEl!.querySelector('li');
			if (firstLi) {
				cellWidth = firstLi.offsetWidth;
				cellStart = firstLi.offsetLeft;
			}
		};
		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(ulEl);
		return () => ro.disconnect();
	});

	const SCROLL_TOP_THRESHOLD = 80;
	const SCROLL_DELTA = 8;

	$effect(() => {
		if (!browser) return;

		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		reducedMotion = mq.matches;
		const onMq = (e: MediaQueryListEvent) => {
			reducedMotion = e.matches;
		};
		mq.addEventListener('change', onMq);

		const onScroll = () => {
			const currentY = window.scrollY;

			if (currentY < SCROLL_TOP_THRESHOLD || reducedMotion || isCompactRoute) {
				scrollCompact = false;
				lastScrollY = currentY;
				return;
			}

			const delta = currentY - lastScrollY;
			if (delta > SCROLL_DELTA) {
				scrollCompact = true;
			} else if (delta < -SCROLL_DELTA) {
				scrollCompact = false;
			}
			lastScrollY = currentY;
		};

		window.addEventListener('scroll', onScroll, { passive: true });
		return () => {
			window.removeEventListener('scroll', onScroll);
			mq.removeEventListener('change', onMq);
		};
	});
</script>

<nav
	aria-label="Navegación principal"
	class="pointer-events-none fixed inset-x-0 bottom-5 z-[9999] flex justify-center px-5 md:hidden"
>
	<ul
		bind:this={ulEl}
		class="border-border bg-card/80 pointer-events-auto relative mx-auto grid grid-cols-5 items-center gap-0 rounded-full border p-1.5 backdrop-blur-md transition-all duration-300 ease-out"
		class:w-full={!compact}
		class:w-[85%]={compact}
	>
		{#if activeIdx >= 0 && cellWidth > 0}
			<div
				aria-hidden="true"
				class="bg-still-500/15 pointer-events-none absolute inset-y-1.5 left-0 z-0 rounded-full transition-transform duration-300 ease-out"
				style="width: {cellWidth}px; transform: translateX({cellStart + cellWidth * activeIdx}px);"
			></div>
		{/if}

		{#each primaryNavItems as item}
			{@const Icon = item.icon}
			{@const active = item.match(current)}
			<li class="relative z-10 flex justify-center">
				<a
					href={item.href}
					onclick={item.label === 'Inicio' ? handleInicioClick : undefined}
					class="flex flex-col items-center justify-center rounded-full px-3 py-2.5 font-medium transition-all duration-300 ease-out text-muted-foreground"
					class:gap-1={!compact}
					class:gap-0={compact}
					aria-current={active ? 'page' : undefined}
					aria-label={item.label}
				>
					<Icon class="size-5" />
					<span
						class="block overflow-hidden text-center text-[10px] leading-none whitespace-nowrap transition-all duration-300 ease-out"
						class:h-2.5={!compact}
						class:h-0={compact}
						class:max-w-[80px]={!compact}
						class:max-w-0={compact}
						class:opacity-100={!compact}
						class:opacity-0={compact}
					>
						{item.label}
					</span>
				</a>
			</li>
		{/each}
	</ul>
</nav>
