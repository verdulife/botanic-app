<script lang="ts">
	import { Sprout, Clock } from "lucide-svelte/icons";
	import { categoryLabel, formatDate } from "$lib/blog/utils";
	import type { Post } from "$lib/blog/posts";

	let {
		posts,
		page,
		totalPages,
	}: { posts: Post[]; page: number; totalPages: number } = $props();

	const pageNumbers = $derived(Array.from({ length: totalPages }, (_, i) => i + 1));

	function pageHref(p: number): string {
		return p === 1 ? "/blog" : `/blog/pagina/${p}`;
	}
</script>

{#if posts.length === 0}
	<p class="py-16 text-center text-muted-foreground">
		Aún no hay artículos publicados. Vuelve pronto.
	</p>
{:else}
	<div class="grid grid-cols-2 gap-1.5 sm:gap-6 lg:grid-cols-3">
		{#each posts as post}
			<a
				href={`/blog/${post.slug}`}
				class="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
			>
				<div class="p-3.5">
					{#if post.meta.image}
						<picture>
							<source
								srcset={post.meta.image.replace(/\.(jpe?g|png)$/i, ".webp")}
								type="image/webp"
							/>
							<img
								src={post.meta.image}
								alt={post.meta.title}
								width="640"
								height="640"
								loading="lazy"
								class="aspect-square w-full rounded-xl border border-border/60 object-cover shadow-xs"
							/>
						</picture>
					{:else}
						<div
							class="grid aspect-square w-full place-items-center rounded-xl border border-border/60 bg-gradient-to-br from-still-100 via-still-200 to-still-300 shadow-xs"
						>
							<Sprout class="size-12 text-still-600/70" aria-hidden="true" />
						</div>
					{/if}
				</div>
				<div class="flex flex-1 flex-col gap-1.5 p-3 sm:p-5">
					<p class="font-mono text-xs font-medium tracking-wide text-still-600 uppercase">
						{categoryLabel(post.meta.category)}
					</p>
					<h2
						class="no-opsz text-sm leading-snug font-semibold text-balance transition-colors group-hover:text-still-600 sm:text-lg"
					>
						{post.meta.title}
					</h2>
					<p class="hidden text-sm text-pretty text-muted-foreground sm:block">
						{post.meta.description}
					</p>
					<div
						class="mt-auto flex items-center justify-between gap-2 pt-3 text-xs text-muted-foreground"
					>
						<span>{formatDate(post.meta.date)}</span>
						<span class="inline-flex shrink-0 items-center gap-1">
							<Clock class="size-3.5" aria-hidden="true" />
							{post.readingTime} min
						</span>
					</div>
				</div>
			</a>
		{/each}
	</div>
{/if}

{#if totalPages > 1}
	<nav class="mt-12 flex items-center justify-center gap-2" aria-label="Paginación">
		{#if page > 1}
			<a
				href={pageHref(page - 1)}
				class="inline-flex h-9 items-center rounded-full border border-border bg-card px-4 text-sm font-medium hover:bg-muted"
			>
				Anterior
			</a>
		{/if}
		{#each pageNumbers as p}
			<a
				href={pageHref(p)}
				aria-current={p === page ? "page" : undefined}
				class="grid h-9 w-9 place-items-center rounded-full border text-sm font-medium {p === page
					? 'border-primary bg-primary text-primary-foreground'
					: 'border-border bg-card hover:bg-muted'}"
			>
				{p}
			</a>
		{/each}
		{#if page < totalPages}
			<a
				href={pageHref(page + 1)}
				class="inline-flex h-9 items-center rounded-full border border-border bg-card px-4 text-sm font-medium hover:bg-muted"
			>
				Siguiente
			</a>
		{/if}
	</nav>
{/if}
