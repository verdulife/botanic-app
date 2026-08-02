<script lang="ts">
	import { ArrowLeft } from "lucide-svelte/icons";
	import Logo from "$lib/components/Logo.svelte";
	import AppFooter from "$lib/components/AppFooter.svelte";

	let { children } = $props();
</script>

<div class="mx-auto flex min-h-dvh max-w-6xl flex-col">
	<header class="sticky top-0 z-10 flex items-center justify-between border-b border-border/40 bg-background/95 px-4 py-4 backdrop-blur md:px-6">
		<a href="/" class="inline-flex items-center">
			<Logo class="h-7" />
		</a>
		<a
			href="/"
			class="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
		>
			<ArrowLeft class="size-4" aria-hidden="true" />
			Volver a la home
		</a>
	</header>

	<main class="flex-1">
		{@render children()}
	</main>

	<AppFooter />
</div>
