<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { primaryNavItems } from './nav-items';

	let current = $derived(page.url.pathname);

	let compact = $state(false);
	let reducedMotion = $state(false);
	let lastScrollY = 0;

	let activeIdx = $derived(
		primaryNavItems.findIndex((item) => item.match(current))
	);

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

			if (currentY < SCROLL_TOP_THRESHOLD || reducedMotion) {
				compact = false;
				lastScrollY = currentY;
				return;
			}

			const delta = currentY - lastScrollY;
			if (delta > SCROLL_DELTA) {
				compact = true;
			} else if (delta < -SCROLL_DELTA) {
				compact = false;
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
	class="pointer-events-none fixed inset-x-0 bottom-4 z-10 flex justify-center px-4 md:hidden"
>
	<ul
		class="border-border bg-card/80 pointer-events-auto relative grid max-w-md grid-cols-5 items-center gap-0.5 rounded-full border px-4 backdrop-blur-md transition-all duration-300 ease-out"
		class:h-14={!compact}
		class:h-12={compact}
		class:py-1.5={!compact}
		class:py-1={compact}
		style:--col-w="calc((100% - 2rem) / 5)"
		style:--active-idx={activeIdx}
	>
		{#if activeIdx >= 0}
			<div
				aria-hidden="true"
				class="bg-still-500/15 pointer-events-none absolute inset-y-1 left-0 z-0 rounded-full transition-all duration-300 ease-out"
				style="width: calc(var(--col-w) - 0.5rem); transform: translateX(calc(1rem + var(--col-w) * var(--active-idx)))"
			></div>
		{/if}

		{#each primaryNavItems as item}
			{@const Icon = item.icon}
			{@const active = item.match(current)}
			<li class="relative z-10 flex justify-center">
				<a
					href={item.href}
					class="flex flex-col items-center justify-center rounded-full px-2.5 font-medium transition-all duration-300 ease-out"
					class:gap-1={!compact}
					class:gap-0={compact}
					class:h-11={!compact}
					class:h-9={compact}
					class:text-xs={!compact}
					class:text-foreground={active}
					class:text-muted-foreground={!active}
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
