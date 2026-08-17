<script lang="ts">
	import { ArrowLeft } from "lucide-svelte/icons";
	import AppHeader from "$lib/components/AppHeader.svelte";
	import AppFooter from "$lib/components/AppFooter.svelte";

	let { data } = $props();

	const base = "https://www.botanicapp.es";
	const url = `${base}/politica-de-privacidad`;
</script>

<svelte:head>
	<title>{data.title} | Botanic</title>
	<meta name="robots" content="noindex, follow" />
	<link rel="canonical" href={url} />
</svelte:head>

<AppHeader />

<article class="mx-auto max-w-3xl px-4 pt-6 pb-20 md:px-6">
	<a
		href="/"
		class="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
	>
		<ArrowLeft class="size-4" aria-hidden="true" />
		Volver al inicio
	</a>

	<header class="mt-6">
		<h1 class="text-4xl leading-[1.1] font-light text-balance md:text-5xl">
			{data.title}
		</h1>
		{#if data.lastUpdated}
			<p class="mt-4 text-sm text-muted-foreground">
				Última actualización: {data.lastUpdated}
			</p>
		{/if}
	</header>

	<hr class="mt-8 mb-0 border-border/30" />

	<div class="mt-6 prose prose-botanic">{@html data.html}</div>
</article>

<AppFooter />
