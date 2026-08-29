<script lang="ts">
	import { page } from '$app/state';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import AuthRequired from '$lib/components/wireframe/AuthRequired.svelte';
	import { wishes } from '$lib/stores/wishes.svelte';
	import { wishPriceLabel } from '$lib/mock/wishes';
	import { ArrowLeft, Coins, MapPin, Sparkles, Tag } from 'lucide-svelte/icons';

	let { data } = $props();

	let wish = $derived(wishes.list.find((w) => w.id === page.params.id));
</script>

<svelte:head>
	<title>{wish ? wish.keywords : 'Deseo'} · Botanic</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div
	class="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 pt-6 pb-28 sm:px-6 sm:pt-8 sm:pb-32"
>
	{#if data.user}
		{#if wish}
			{@const active = wish.status === 'activo'}
			<header class="flex flex-col gap-1">
				<h1 class="text-xl font-medium sm:text-2xl">{wish.keywords}</h1>
				<p class="text-muted-foreground text-sm">Detalle de tu deseo.</p>
			</header>

			<Card.Root class="gap-0 overflow-hidden py-0">
				<Card.Content class="flex flex-col gap-4 py-5">
					<div class="flex items-center gap-2">
						<Badge
							variant={active ? 'default' : 'secondary'}
							class="text-[10px] tracking-wider uppercase"
						>
							{wish.status}
						</Badge>
						{#if wish.alert}
							<Badge
								variant="outline"
								class="text-[10px] tracking-wider uppercase"
							>
								Alerta activa
							</Badge>
						{/if}
					</div>

					<dl class="flex flex-col gap-3">
						<div class="flex items-center gap-3">
							<Tag class="text-muted-foreground size-4 shrink-0" />
							<dt class="text-muted-foreground text-sm">Categoría</dt>
							<dd class="ml-auto text-sm">{wish.category}</dd>
						</div>
						<div class="flex items-center gap-3">
							<Coins class="text-muted-foreground size-4 shrink-0" />
							<dt class="text-muted-foreground text-sm">Presupuesto</dt>
							<dd class="ml-auto text-sm">{wishPriceLabel(wish)}</dd>
						</div>
						<div class="flex items-center gap-3">
							<MapPin class="text-muted-foreground size-4 shrink-0" />
							<dt class="text-muted-foreground text-sm">Dónde</dt>
							<dd class="ml-auto text-sm">{wish.location}</dd>
						</div>
						<div class="flex items-center gap-3">
							<Sparkles class="text-muted-foreground size-4 shrink-0" />
							<dt class="text-muted-foreground text-sm">Coincidencias</dt>
							<dd class="ml-auto text-sm font-medium">{wish.matches}</dd>
						</div>
					</dl>

					<label class="border-border flex cursor-pointer items-start gap-3 border-t pt-4">
						<Checkbox
							checked={wish.alert}
							onCheckedChange={() => wishes.toggleAlert(wish.id)}
							class="mt-0.5"
						/>
						<span class="flex flex-col gap-0.5">
							<span class="text-sm font-medium">Avisarme</span>
							<span class="text-muted-foreground text-xs">
								Te avisamos cuando alguien publique algo que encaje con este deseo.
							</span>
						</span>
					</label>
				</Card.Content>
			</Card.Root>

			<div class="flex flex-col gap-2 sm:flex-row">
				<Button href="/app/deseo/{wish.id}/coincidencias" class="w-full sm:flex-1">
					Ver coincidencias
				</Button>
				<Button
					href="/app/deseo/{wish.id}/alerta"
					variant="outline"
					class="w-full sm:flex-1"
				>
					Configurar alerta
				</Button>
			</div>

			<a
				href="/app/deseos"
				class="text-muted-foreground hover:text-foreground flex items-center gap-1 self-center text-sm underline-offset-4 hover:underline"
			>
				<ArrowLeft class="size-4" />
				Volver a mis deseos
			</a>
		{:else}
			<Card.Root class="border-dashed">
				<Card.Content class="flex flex-col items-center gap-2 py-12 text-center">
					<div
						class="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full border"
					>
						<Sparkles class="size-6" />
					</div>
					<p class="text-sm font-medium">No se encontró el deseo</p>
					<p class="text-muted-foreground max-w-sm text-sm">
						Puede que se haya eliminado o que la dirección no sea correcta.
					</p>
					<Button href="/app/deseos" variant="outline" size="sm" class="mt-1">
						Mis deseos
					</Button>
				</Card.Content>
			</Card.Root>
		{/if}
	{:else}
		<AuthRequired title="Gestiona tus deseos y sus alertas" />
	{/if}
</div>