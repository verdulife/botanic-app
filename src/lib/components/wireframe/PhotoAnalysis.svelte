<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Check, Leaf, Loader2, RefreshCw, X } from 'lucide-svelte/icons';
	import type { IdentifyResult } from '$lib/identify-plant';

	type Props = {
		cover: string;
		analyzing: boolean;
		error: string | null;
		candidates: IdentifyResult[];
		onPick: (r: IdentifyResult) => void;
		onNone: () => void;
		onRetry: () => void;
	};

	let { cover, analyzing, error, candidates, onPick, onNone, onRetry }: Props = $props();

	// Preselecciona la mejor candidata al llegar resultados (una vez por tanda);
	// el usuario puede cambiar. Se resetea al reanalizar.
	let selected = $state('');
	let appliedBest = $state(false);

	$effect(() => {
		if (candidates.length === 0) {
			appliedBest = false;
			selected = '';
			return;
		}
		if (appliedBest) return;
		const best = candidates[0];
		if (best) {
			appliedBest = true;
			selected = best.name;
			onPick(best);
		}
	});

	const shown = $derived(candidates.slice(0, 4));
</script>

<div class="flex flex-col gap-3">
	{#if analyzing}
		<div
			class="border-border bg-muted/40 relative aspect-[4/5] max-h-72 w-full overflow-hidden rounded-xl border"
		>
			<img
				src={cover}
				alt="Portada del anuncio que se está analizando"
				class="absolute inset-0 h-full w-full object-cover opacity-40"
			/>
			<div class="scan-line bg-foreground/40 absolute right-0 left-0 h-1" aria-hidden="true"></div>
			<div
				class="bg-background/40 absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center"
			>
				<Loader2 class="size-6 animate-spin" />
				<p class="text-sm font-medium">Analizando fotografía…</p>
				<p class="text-muted-foreground text-xs">Esto puede tardar unos segundos.</p>
			</div>
		</div>
	{:else if error}
		<div
			class="border-border bg-muted/40 flex flex-col items-center gap-2 rounded-xl border p-6 text-center"
		>
			<p class="text-destructive text-sm">{error}</p>
			<Button type="button" variant="outline" size="sm" onclick={onRetry}>
				<RefreshCw class="size-4" />
				Reintentar
			</Button>
		</div>
	{:else if candidates.length > 0}
		<Card.Root class="gap-0 overflow-hidden py-0">
			<ul class="divide-border divide-y">
				{#each shown as c}
					<li>
						<button
							type="button"
							onclick={() => {
								selected = c.name;
								onPick(c);
							}}
							class="hover:bg-muted flex w-full items-center gap-3 px-4 py-3 text-left transition-colors"
							class:bg-muted={selected === c.name}
						>
							<div
								class="bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-md"
							>
								<Leaf class="size-5" />
							</div>
							<span class="flex min-w-0 flex-1 flex-col">
								<span class="text-sm font-medium">{c.name}</span>
								<span class="text-muted-foreground truncate text-xs">{c.scientific}</span>
							</span>
							<span class="text-muted-foreground shrink-0 text-xs font-medium">
								{(c.confidence * 100).toFixed(0)}%
							</span>
							{#if selected === c.name}
								<Check class="size-4 shrink-0" />
							{/if}
						</button>
					</li>
				{/each}
				<li>
					<button
						type="button"
						onclick={onNone}
						class="hover:bg-muted flex w-full items-center gap-3 px-4 py-3 text-left transition-colors"
					>
						<div
							class="bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-md"
						>
							<X class="size-5" />
						</div>
						<span class="text-sm font-medium">Ninguna de estas</span>
					</button>
				</li>
			</ul>
		</Card.Root>
	{:else}
		<div
			class="border-border bg-muted/40 rounded-xl border p-6 text-center text-sm text-muted-foreground"
		>
			No hemos podido identificar la planta desde esta foto. Puedes continuar y
			rellenar la especie manualmente.
		</div>
	{/if}
</div>

<style>
	.scan-line {
		animation: scanline 1.8s ease-in-out infinite;
	}
	@keyframes scanline {
		0% {
			top: 0%;
			opacity: 0;
		}
		10% {
			opacity: 1;
		}
		90% {
			opacity: 1;
		}
		100% {
			top: calc(100% - 4px);
			opacity: 0;
		}
	}
</style>