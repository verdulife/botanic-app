<script lang="ts">
	import { MAX_PHOTOS, compressPhoto, type PickedPhoto } from '$lib/listings/image';
	import { Camera, Loader2, X } from '@lucide/svelte/icons';

	type Props = {
		photos: PickedPhoto[];
		error?: boolean;
	};

	let { photos = $bindable([]), error = false }: Props = $props();

	let fileInput = $state<HTMLInputElement | null>(null);
	let preparing = $state(0);
	let message = $state<string | null>(null);

	const full = $derived(photos.length >= MAX_PHOTOS);

	// La foto se comprime aquí, en el navegador, antes de salir: el bucket rechaza
	// cualquier fichero de más de 512 KB y una foto de móvil los supera de largo.
	async function onPick(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const files = Array.from(input.files ?? []);
		// Se limpia para poder volver a elegir la misma foto (por ejemplo tras un
		// error de compresión).
		input.value = '';
		if (files.length === 0) return;

		message = null;
		const room = MAX_PHOTOS - photos.length;
		if (files.length > room) {
			message = `Solo caben ${MAX_PHOTOS} fotos por anuncio.`;
		}

		const selected = files.slice(0, Math.max(0, room));
		preparing += selected.length;
		for (const file of selected) {
			try {
				const photo = await compressPhoto(file);
				if (photos.some((picked) => picked.preview === photo.preview)) {
					message = 'Esa foto ya está en el anuncio.';
					continue;
				}
				if (photos.length < MAX_PHOTOS) photos = [...photos, photo];
			} catch (cause) {
				message = cause instanceof Error ? cause.message : 'No pudimos preparar la foto.';
			} finally {
				preparing -= 1;
			}
		}
	}

	function remove(index: number) {
		photos = photos.filter((_, i) => i !== index);
		message = null;
	}
</script>

<div class="flex flex-col gap-2">
	<div
		class="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5"
		aria-label="Fotos del anuncio"
	>
		{#each photos as photo, i (photo.preview)}
			<div
				class="border-border bg-muted relative aspect-[4/5] overflow-hidden rounded-xl border"
			>
				<img
					src={photo.preview}
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
					onclick={() => remove(i)}
					class="bg-background/90 text-muted-foreground hover:text-foreground absolute top-1.5 right-1.5 flex size-7 items-center justify-center rounded-full shadow-sm transition-colors"
					aria-label={`Quitar foto ${i + 1}`}
				>
					<X class="size-4" />
				</button>
			</div>
		{/each}

		{#each Array.from({ length: preparing }) as _, i (i)}
			<div
				class="border-border bg-muted text-muted-foreground flex aspect-[4/5] items-center justify-center rounded-xl border"
				aria-hidden="true"
			>
				<Loader2 class="size-4 animate-spin" />
			</div>
		{/each}

		{#if !full}
			<button
				type="button"
				onclick={() => fileInput?.click()}
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

	<input
		bind:this={fileInput}
		type="file"
		accept="image/webp,image/jpeg,image/png"
		multiple
		class="sr-only"
		onchange={onPick}
		aria-label="Elegir fotos del anuncio"
	/>

	{#if message}
		<p class="text-destructive text-xs">{message}</p>
	{:else}
		<p class="text-muted-foreground text-xs">
			Hasta {MAX_PHOTOS} fotos. Se reducen y comprimen en tu navegador antes de subirlas.
		</p>
	{/if}
</div>
