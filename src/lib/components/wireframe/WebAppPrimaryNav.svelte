<script lang="ts">
	import { page } from "$app/state";
	import { primaryNavItems } from "./nav-items";

	let current = $derived(page.url.pathname);
</script>

<nav
	aria-label="Navegación principal"
	class="border-border bg-card fixed right-0 bottom-0 left-0 z-10 border-t md:hidden"
>
	<ul class="mx-auto grid h-16 max-w-2xl grid-cols-5 items-stretch px-1">
		{#each primaryNavItems as item}
			{@const Icon = item.icon}
			{@const active = !item.action && item.match(current)}
			<li class="flex">
				<a
					href={item.href}
					class="flex flex-1 flex-col items-center justify-center gap-1.5 px-1 text-xs font-medium transition-colors"
					class:text-foreground={active}
					class:text-muted-foreground={!active && !item.action}
					class:text-primary={item.action}
					aria-current={active ? "page" : undefined}
				>
					<Icon class="size-6" />
					<span class="text-[10px]">{item.label}</span>
				</a>
			</li>
		{/each}
	</ul>
</nav>
