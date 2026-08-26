<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { primaryNavItems } from './nav-items';

	let current = $derived(page.url.pathname);

	let visible = $state(true);
	let reducedMotion = $state(false);
	let lastScrollY = 0;

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
				visible = true;
				lastScrollY = currentY;
				return;
			}

			const delta = currentY - lastScrollY;
			if (delta > SCROLL_DELTA) {
				visible = false;
			} else if (delta < -SCROLL_DELTA) {
				visible = true;
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
	class="border-border bg-card/80 fixed right-0 bottom-0 left-0 z-10 border-t backdrop-blur-md transition-transform duration-200 ease-out md:hidden"
>
	<ul class="mx-auto grid h-16 max-w-2xl grid-cols-4 items-stretch px-1">
		{#each primaryNavItems as item}
			{@const Icon = item.icon}
			{@const active = item.match(current)}
			<li class="flex">
				<a
					href={item.href}
					class="flex flex-1 flex-col items-center justify-center gap-1 px-1 text-xs font-medium transition-colors"
					class:text-foreground={active}
					class:text-muted-foreground={!active}
					aria-current={active ? 'page' : undefined}
				>
					<Icon class="size-6" />
					<span class="text-[10px]">{item.label}</span>
				</a>
			</li>
		{/each}
	</ul>
</nav>