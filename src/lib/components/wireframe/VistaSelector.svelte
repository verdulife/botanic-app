<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { pushVistaToURL, readVista, type Vista } from '$lib/mock/url-filters';
	import { ChevronDown, List, Map as MapIcon, Sparkles } from 'lucide-svelte/icons';

	type VistaOption = {
		value: Vista;
		label: string;
		icon: typeof List;
		route: string;
	};

	type Props = {
		variant?: 'standalone' | 'inline' | 'icon';
	};

	let { variant = 'standalone' }: Props = $props();

	let options: VistaOption[] = [
		{ value: 'lista', label: 'Lista', icon: List, route: '/app' },
		{ value: 'mapa', label: 'Mapa', icon: MapIcon, route: '/app/mapa' },
		{ value: 'scroll', label: 'Scroll', icon: Sparkles, route: '/app/scroll' }
	];

	let current = $derived(readVista(page.url.searchParams, page.url.pathname));
	let active = $derived(options.find((o) => o.value === current) ?? options[0]);

	let detailsEl: HTMLDetailsElement | undefined = $state();

	function selectVista(opt: VistaOption) {
		if (!browser) return;
		pushVistaToURL(opt.route);
		if (detailsEl) detailsEl.open = false;
	}

	onMount(() => {
		if (!browser) return;
		const onPointerDown = (e: PointerEvent) => {
			if (!detailsEl?.open) return;
			const target = e.target as Node | null;
			if (target && !detailsEl.contains(target)) {
				detailsEl.open = false;
			}
		};
		document.addEventListener('pointerdown', onPointerDown);
		return () => document.removeEventListener('pointerdown', onPointerDown);
	});

	let triggerClass = $derived(
		variant === 'inline'
			? 'inline-flex cursor-pointer list-none items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-muted [&::-webkit-details-marker]:hidden'
			: variant === 'icon'
				? 'hover:bg-muted text-muted-foreground hover:text-foreground inline-flex size-10 cursor-pointer list-none items-center justify-center gap-1 rounded-md transition-colors md:size-11 [&::-webkit-details-marker]:hidden'
				: 'border-border bg-background hover:bg-muted inline-flex cursor-pointer list-none items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors [&::-webkit-details-marker]:hidden'
	);
</script>

<details bind:this={detailsEl} class="group relative">
	<summary class={triggerClass}>
		{#if variant === 'icon'}
			<active.icon class="size-5" />
		{:else}
			<active.icon class="size-4" />
			<span>{active.label}</span>
			<ChevronDown
				class="text-muted-foreground size-3.5 transition-transform group-open:rotate-180"
			/>
		{/if}
	</summary>

	<div
		class="bg-card border-border absolute right-0 z-[1100] mt-2 w-44 overflow-hidden rounded-xl border shadow-lg"
		role="menu"
	>
		{#each options as opt}
			{@const Icon = opt.icon}
			{@const isActive = opt.value === current}
			<button
				type="button"
				onclick={() => selectVista(opt)}
				class="hover:bg-muted flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors"
				class:bg-muted={isActive}
				class:font-semibold={isActive}
				role="menuitemradio"
				aria-checked={isActive}
			>
				<Icon class="text-muted-foreground size-4" />
				<span class="flex-1 text-left">{opt.label}</span>
				{#if isActive}
					<span class="bg-primary size-1.5 rounded-full" aria-hidden="true"></span>
				{/if}
			</button>
		{/each}
	</div>
</details>