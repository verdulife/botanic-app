<script lang="ts">
	import { page } from "$app/state";
	import Logo from "$lib/components/Logo.svelte";
	import { Button } from "$lib/components/ui/button";

	const links = $derived([
		{ label: "Inicio", href: "/", active: page.url.pathname === "/" },
		{ label: "Blog", href: "/blog", active: page.url.pathname.startsWith("/blog") },
	]);
</script>

<header
	class="sticky top-0 z-10 border-b border-border/40 bg-background/95 backdrop-blur"
>
	<div
		class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6"
	>
		<a href="/" class="inline-flex items-center">
			<Logo class="h-7" />
		</a>
		<div class="flex items-center gap-7">
			<nav class="flex items-center gap-2" aria-label="Navegación principal">
				{#each links as link}
					<a
						href={link.href}
						aria-current={link.active ? "page" : undefined}
						class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors {link.active
							? 'border border-border bg-muted text-foreground'
							: 'text-muted-foreground hover:text-foreground'}"
					>
						{link.label}
					</a>
				{/each}
			</nav>
			<Button href="/#waitlist" class="hidden px-4 md:inline-flex">Únete a la waitlist</Button>
		</div>
	</div>
</header>
