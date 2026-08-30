<script lang="ts">
	import { seedImagesByCategory } from '$lib/mock/seed';
	import type { CategorySlug } from '$lib/mock/seed-data';
	import { Camera, X } from 'lucide-svelte/icons';

	type Props = {
		images: string[];
		categorySlug?: CategorySlug;
		error?: boolean;
	};

	let { images = $bindable([]), categorySlug, error = false }: Props = $props();

	let panelOpen = $state(false);

	const pool = $derived.by(() => {
		const base = categorySlug
			? seedImagesByCategory(categorySlug)
			: seedImagesByCategory('plantas');
		return base.length ? base : seedImagesByCategory('plantas');
	});

	function toggle(src: string) {
		if (images.includes(src)) {
			images = images.filter((i) => i !== src);
		} else if (images.length < 5) {
			images = [...images, src];
		}
	}
</script>

<div class="flex flex-col gap-2">
	<div
		class="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5"
		aria-label="Fotos del anuncio"
	>
		{#each images as src, i (src)}
			<div
				class="border-border bg-muted relative aspect-[4/5] overflow-hidden rounded-xl border"
			>
				<img
					src={src}
					alt={`Foto ${i + 1} del anuncio`}
					class="h-full w-full object-cover"
				/>
				{#if i === 0}
					<span
						class="bg-background/90 text-foreground absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wider uppercase"
					>
						Portada
					</span>
				{/if}
				<button
					type="button"
					onclick={() => (images = images.filter((_, j) => j !== i))}
					class="bg-background/90 text-muted-foreground hover:text-foreground absolute top-1.5 right-1.5 flex size-7 items-center justify-center rounded-full shadow-sm transition-colors"
					aria-label={`Quitar foto ${i + 1}`}
				>
					<X class="size-4" />
				</button>
			</div>
		{/each}

		{#if images.length < 5 && !panelOpen}
			<button
				type="button"
				onclick={() => (panelOpen = true)}
				class={[
					'border-muted-foreground/40 text-muted-foreground hover:border-foreground hover:text-foreground flex aspect-[4/5] flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed transition-colors',
					error ? 'border-destructive/60' : ''
				].join(' ')}
				aria-label="Añadir foto"
			>
				<Camera class="size-5" />
				<span class="text-xs font-medium">Añadir foto</span>
			</button>
		{/if}
	</div>

	{#if panelOpen}
		<div class="border-border rounded-xl border p-3">
			<div class="mb-2 flex items-center justify-between gap-2">
				<p class="text-muted-foreground text-xs">
					Elige una foto (simulado, hasta 5).
				</p>
				<button
					type="button"
					onclick={() => (panelOpen = false)}
					class="text-muted-foreground hover:text-foreground transition-colors"
					aria-label="Cerrar selector de fotos"
				>
					<X class="size-4" />
				</button>
			</div>
			<div class="grid max-h-64 grid-cols-4 gap-2 overflow-y-auto sm:grid-cols-6">
				{#each pool as src (src)}
					<button
						type="button"
						onclick={() => toggle(src)}
						class={[
							'border-border bg-muted relative aspect-[4/5] overflow-hidden rounded-lg border transition-opacity',
							images.includes(src) ? 'opacity-40' : 'hover:opacity-80'
						].join(' ')}
						aria-label={images.includes(src) ? 'Quitar esta foto' : 'Añadir esta foto'}
					>
						<img
							src={src}
							alt=""
							loading="lazy"
							class="h-full w-full object-cover"
						/>
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>