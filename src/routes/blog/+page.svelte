<script lang="ts">
	import BlogIndex from "$lib/components/blog/BlogIndex.svelte";
	import BlogCta from "$lib/components/blog/BlogCta.svelte";

	let { data } = $props();
</script>

<svelte:head>
	<title>Blog Botanic — Guías y cuidados para plant lovers</title>
	<meta
		name="description"
		content="Guías de cuidados, propagación y novedades del mundo de las plantas, para que tus plantas y tus esquejes conozcan a gente nueva."
	/>
	<meta name="robots" content="index, follow, max-image-preview:large" />
	<link rel="canonical" href="https://www.botanicapp.es/blog" />
</svelte:head>

<section class="mx-auto max-w-6xl px-4 pt-6 pb-20 md:px-6">
	<header class="mx-auto mb-12 max-w-2xl text-center">
		<p class="text-sm font-medium tracking-wide text-primary uppercase">Blog Botanic</p>
		<h1 class="mt-2 text-4xl leading-tight font-light text-balance md:text-5xl">
			Guías para <strong class="font-semibold">plant lovers</strong>
		</h1>
		<p class="mt-3 text-pretty text-muted-foreground">
			Cuidados, propagación y novedades del mundo vegetal, escritos con cariño. Y recuerda: si
			tienes plantas que se te escapan de casa, en Botanic pueden conocer a gente nueva.
		</p>
	</header>

	<BlogIndex posts={data.posts} page={data.page} totalPages={data.totalPages} />

	<div class="mt-20">
		<BlogCta />
	</div>
</section>
