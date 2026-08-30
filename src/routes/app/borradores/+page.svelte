<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { listingDraft } from '$lib/stores/listing-draft.svelte';
	import { FileText, Plus, Trash2 } from 'lucide-svelte/icons';

	function timeAgo(iso: string): string {
		const diff = Date.now() - new Date(iso).getTime();
		const m = Math.floor(diff / 60000);
		if (m < 1) return 'ahora mismo';
		if (m < 60) return `hace ${m} min`;
		const h = Math.floor(m / 60);
		if (h < 24) return `hace ${h} h`;
		const d = Math.floor(h / 24);
		if (d === 1) return 'ayer';
		if (d < 30) return `hace ${d} días`;
		const mes = Math.floor(d / 30);
		return mes === 1 ? 'hace 1 mes' : `hace ${mes} meses`;
	}

	$effect(() => {
		listingDraft.load();
	});
</script>

<svelte:head>
	<title>Mis borradores · Botanic</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div
	class="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 pt-6 pb-28 sm:px-6 sm:pt-8 sm:pb-32"
>
	<header class="flex flex-col gap-1">
		<h1 class="text-xl font-medium sm:text-2xl">Mis borradores</h1>
		<p class="text-muted-foreground text-sm">
			Anuncios que empezaste a publicar y guardaste para más tarde.
		</p>
	</header>

	{#if listingDraft.list.length === 0}
		<Card.Root class="border-dashed">
			<Card.Content class="flex flex-col items-center gap-2 py-12 text-center">
				<div
					class="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full border"
				>
					<FileText class="size-6" />
				</div>
				<p class="text-sm font-medium">No tienes borradores</p>
				<p class="text-muted-foreground max-w-sm text-sm">
					Cuando guardes un anuncio sin publicar, aparecerá aquí para retomarlo
					cuando quieras.
				</p>
				<Button href="/app/publicar" class="mt-1">
					<Plus class="size-4" />
					Crear anuncio
				</Button>
			</Card.Content>
		</Card.Root>
	{:else}
		<Card.Root class="gap-0 overflow-hidden py-0">
			<ul class="divide-border divide-y">
				{#each listingDraft.list as d (d.id)}
					<li>
						<div class="flex items-center gap-3 p-3">
							<div class="bg-muted relative h-16 w-12 shrink-0 overflow-hidden rounded-lg">
								{#if d.images[0]}
									<img src={d.images[0]} alt="" class="h-full w-full object-cover" />
								{/if}
							</div>
							<div class="flex min-w-0 flex-1 flex-col">
								<span class="truncate text-sm font-medium">
									{d.title || 'Borrador sin título'}
								</span>
								<span class="text-muted-foreground truncate text-xs">
									{d.category || 'Sin categoría'} · {timeAgo(d.savedAt)}
								</span>
							</div>
							<Button
								href="/app/publicar?draft={d.id}"
								variant="outline"
								size="sm"
								class="shrink-0"
							>
								Continuar
							</Button>
							<button
								type="button"
								onclick={() => listingDraft.remove(d.id)}
								class="text-muted-foreground hover:text-destructive flex size-9 shrink-0 items-center justify-center rounded-full transition-colors"
								aria-label="Eliminar borrador"
							>
								<Trash2 class="size-4" />
							</button>
						</div>
					</li>
				{/each}
			</ul>
		</Card.Root>
	{/if}
</div>