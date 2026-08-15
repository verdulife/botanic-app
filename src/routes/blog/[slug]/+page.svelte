<script lang="ts">
	import { ArrowLeft, User, CalendarDays, Clock } from "lucide-svelte/icons";
	import BlogIndex from "$lib/components/blog/BlogIndex.svelte";
	import BlogCta from "$lib/components/blog/BlogCta.svelte";
	import { categoryLabel, formatDate } from "$lib/blog/utils";

	let { data } = $props();

	const base = "https://www.botanicapp.es";
	const url = $derived(`${base}/blog/${data.post.slug}`);
	const image = $derived(data.post.meta.image ? `${base}${data.post.meta.image}` : `${base}/og-image.jpg`);
	const webpImage = $derived(data.post.meta.image?.replace(/\.(jpe?g|png)$/i, ".webp"));
	const updated = $derived(data.post.meta.updated ? formatDate(data.post.meta.updated) : null);

	const jsonLd = $derived({
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "BreadcrumbList",
				itemListElement: [
					{ "@type": "ListItem", position: 1, name: "Inicio", item: base },
					{ "@type": "ListItem", position: 2, name: "Blog", item: `${base}/blog` },
					{ "@type": "ListItem", position: 3, name: data.post.meta.title, item: url },
				],
			},
			{
				"@type": "BlogPosting",
				headline: data.post.meta.title,
				description: data.post.meta.description,
				image: image,
				datePublished: data.post.meta.date,
				dateModified: data.post.meta.updated ?? data.post.meta.date,
				author: { "@type": "Person", name: data.post.meta.author },
				publisher: {
					"@type": "Organization",
					name: "Botanic",
					url: base,
					logo: { "@type": "ImageObject", url: `${base}/favicon.svg` },
				},
				mainEntityOfPage: url,
			},
		],
	});

	const jsonLdHtml = $derived(
		`<script type="application/ld+json">${JSON.stringify(jsonLd)}<\/script>`
	);
</script>

<svelte:head>
	<title>{data.post.meta.title} | Botanic</title>
	<meta name="description" content={data.post.meta.description} />
	<meta name="robots" content="index, follow, max-image-preview:large" />
	<link rel="canonical" href={url} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.post.meta.title} />
	<meta property="og:description" content={data.post.meta.description} />
	<meta property="og:url" content={url} />
	<meta property="og:site_name" content="Botanic" />
	<meta property="og:locale" content="es_ES" />
	<meta property="og:image" content={image} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={data.post.meta.title} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.post.meta.title} />
	<meta name="twitter:description" content={data.post.meta.description} />
	<meta name="twitter:image" content={image} />
</svelte:head>

{@html jsonLdHtml}

<article class="mx-auto max-w-3xl px-4 pt-6 pb-20 md:px-6">
	<a
		href="/blog"
		class="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
	>
		<ArrowLeft class="size-4" aria-hidden="true" />
		Todos los artículos
	</a>

	<header class="mt-6">
		<p class="text-sm font-medium tracking-wide text-still-600 uppercase">
			{categoryLabel(data.post.meta.category)}
		</p>
		<h1
			class="mt-3 text-4xl leading-[1.1] font-light text-balance md:text-5xl"
		>
			{data.post.meta.title}
		</h1>
		<p class="mt-4 text-lg text-muted-foreground text-pretty">
			{data.post.meta.description}
		</p>
		<div
			class="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground"
		>
			<span class="inline-flex items-center gap-1.5">
				<User class="size-4" aria-hidden="true" />
				{data.post.meta.author}
			</span>
			<span class="inline-flex items-center gap-1.5">
				<CalendarDays class="size-4" aria-hidden="true" />
				{formatDate(data.post.meta.date)}
			</span>
			{#if updated}
				<span>Actualizado el {updated}</span>
			{/if}
			<span class="inline-flex items-center gap-1.5">
				<Clock class="size-4" aria-hidden="true" />
				{data.post.readingTime} min de lectura
			</span>
		</div>
	</header>

	{#if data.post.meta.image}
		<figure class="blog-figure not-prose mt-8">
			<picture>
				<source srcset={webpImage} type="image/webp" />
				<img
					src={data.post.meta.image}
					alt={data.post.meta.title}
					width="1200"
					height="675"
					class="aspect-[16/9] object-cover"
				/>
			</picture>
			{#if data.post.meta.imageCredit}
				<figcaption>{data.post.meta.imageCredit}</figcaption>
			{/if}
		</figure>
	{/if}

	<hr class="mt-8 mb-0 border-border/30" />

	<div class="mt-6 prose prose-botanic">{@html data.html}</div>
</article>

<section class="mx-auto max-w-6xl px-4 pt-4 pb-20 md:px-6">
	<BlogCta />
</section>

{#if data.related.length > 0}
	<section class="border-t border-border/70">
		<div class="mx-auto max-w-6xl px-4 py-16 md:px-6">
			<h2 class="mb-8 text-2xl font-light text-balance">Artículos relacionados</h2>
			<BlogIndex posts={data.related} page={1} totalPages={1} />
		</div>
	</section>
{/if}
