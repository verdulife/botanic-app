<script lang="ts">
	import BlogIndex from "$lib/components/blog/BlogIndex.svelte";

	let { data } = $props();

	const base = "https://www.botanicapp.es";
	const prevHref = $derived(
		data.page === 2 ? `${base}/blog` : `${base}/blog/pagina/${data.page - 1}`
	);
</script>

<svelte:head>
	<title>Blog Botanic — Página {data.page} · Guías para plant lovers</title>
	<meta
		name="description"
		content="Guías de cuidados, propagación y novedades del mundo de las plantas — página {data.page}."
	/>
	<meta name="robots" content="index, follow, max-image-preview:large" />
	<link rel="canonical" href={`${base}/blog/pagina/${data.page}`} />
	{#if data.page > 1}
		<link rel="prev" href={prevHref} />
	{/if}
	{#if data.page < data.totalPages}
		<link rel="next" href={`${base}/blog/pagina/${data.page + 1}`} />
	{/if}
</svelte:head>

<section class="mx-auto max-w-6xl px-4 pt-6 pb-20 md:px-6">
	<BlogIndex posts={data.posts} page={data.page} totalPages={data.totalPages} />
</section>
