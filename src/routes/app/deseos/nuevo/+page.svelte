<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import AuthRequired from '$lib/components/wireframe/AuthRequired.svelte';
	import AutocompleteInput from '$lib/components/wireframe/AutocompleteInput.svelte';
	import { CATEGORIES, PLANT_TERMS } from '$lib/mock/seed-data';
	import {
		CIUDADES,
		COMUNIDADES,
		allProvincias,
		composeLocationLabel,
		type LocationScope
	} from '$lib/mock/locations';
	import { wishes } from '$lib/stores/wishes.svelte';
	import { ChevronDown } from 'lucide-svelte/icons';

	let { data } = $props();

	let keywords = $state('');
	let error = $state(false);

	$effect(() => {
		if (error && keywords.trim()) error = false;
	});

	let locationInput = $state('');
	let alert = $state(true);

	let category = $state('Cualquiera');
	let priceMax = $state('');
	let moreOpen = $state(false);

	const categoryOptions = ['Cualquiera', ...CATEGORIES.map((c) => c.name)];

	type LocationSuggestion = { scope: LocationScope; value: string; label: string };
	const locationSuggestions: LocationSuggestion[] = [
		{ scope: 'pais', value: '', label: 'Todo el país' },
		...COMUNIDADES.map((c) => ({
			scope: 'comunidad' as const,
			value: c.name,
			label: composeLocationLabel('comunidad', c.name)
		})),
		...allProvincias().map((p) => ({
			scope: 'provincia' as const,
			value: p,
			label: composeLocationLabel('provincia', p)
		})),
		...CIUDADES.map((c) => ({
			scope: 'ciudad' as const,
			value: c,
			label: composeLocationLabel('ciudad', c)
		}))
	];
	const locationLabels = locationSuggestions.map((s) => s.label);

	function resolveLocation(): { scope: LocationScope | undefined; value: string; label: string } {
		const q = locationInput.trim();
		if (!q) return { scope: 'pais', value: '', label: 'Todo el país' };
		const hit = locationSuggestions.find((s) => s.label.toLowerCase() === q.toLowerCase());
		if (hit) return hit;
		return { scope: undefined, value: q, label: q };
	}

	function newWishId(): string {
		return typeof crypto !== 'undefined' && 'randomUUID' in crypto
			? crypto.randomUUID()
			: `wish-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
	}

	function onSubmit() {
		const q = keywords.trim();
		if (!q) {
			error = true;
			return;
		}

		const rawPrice = String(priceMax ?? '').trim();
		const price = rawPrice ? Number(rawPrice) : null;
		const loc = resolveLocation();

		wishes.add({
			id: newWishId(),
			keywords: q,
			category,
			priceMin: null,
			priceMax: price !== null && Number.isFinite(price) && price >= 0 ? price : null,
			location: loc.label,
			locationScope: loc.scope,
			status: 'activo',
			alert,
			matches: 0
		});

		goto('/app/deseos');
	}
</script>

<svelte:head>
	<title>Nuevo deseo · Botanic</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div
	class="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 pt-6 pb-28 sm:px-6 sm:pt-8 sm:pb-32"
>
	{#if data.user}
		<header class="flex flex-col gap-1">
			<h1 class="text-xl font-medium sm:text-2xl">Nuevo deseo</h1>
			<p class="text-muted-foreground text-sm">
				Dinos qué plantas buscas y te avisaremos cuando alguien las publique.
			</p>
		</header>

		<form
			onsubmit={(e) => {
				e.preventDefault();
				onSubmit();
			}}
			class="flex flex-col gap-5"
		>
			<Card.Root class="gap-0 overflow-visible py-0">
				<Card.Content class="flex flex-col gap-5 py-6">
					<div class="flex flex-col gap-2">
						<Label for="keywords" class="text-sm font-medium">¿Qué buscas?</Label>
						<AutocompleteInput
							id="keywords"
							items={PLANT_TERMS}
							placeholder="Ej. Monstera deliciosa, esquejes de pothos…"
							ariaLabel="Qué plantas buscas"
							bind:value={keywords}
							{error}
						/>
						{#if error}
							<p class="text-destructive text-xs">
								Escribe qué plantas buscas para crear el deseo.
							</p>
						{/if}
					</div>

					<div class="flex flex-col gap-2">
						<Label for="location" class="text-sm font-medium"
							>¿Dónde quieres encontrarlas?</Label
						>
						<AutocompleteInput
							id="location"
							items={locationLabels}
							placeholder="Todo el país, una ciudad, provincia o comunidad…"
							ariaLabel="Dónde quieres encontrarlas"
							bind:value={locationInput}
						/>
					</div>

					<label class="flex cursor-pointer items-start gap-3">
						<Checkbox bind:checked={alert} class="mt-0.5" />
						<span class="flex flex-col gap-0.5">
							<span class="text-sm font-medium">Avisarme</span>
							<span class="text-muted-foreground text-xs">
								Te avisaremos cuando alguien publique algo que encaje con tu búsqueda.
							</span>
						</span>
					</label>

					<button
						type="button"
						onclick={() => (moreOpen = !moreOpen)}
						class="text-muted-foreground hover:text-foreground flex items-center gap-1 self-start text-sm font-medium transition-colors"
						aria-expanded={moreOpen}
					>
						Más opciones
						<ChevronDown
							class={['size-4 transition-transform', moreOpen ? 'rotate-180' : ''].join(' ')}
						/>
					</button>

					{#if moreOpen}
						<div class="flex flex-col gap-4">
							<div class="flex flex-col gap-2">
								<Label class="text-sm font-medium">Categoría</Label>
								<Select.Root bind:value={category}>
									<Select.Trigger class="w-full">
										<Select.Value />
									</Select.Trigger>
									<Select.Content>
										{#each categoryOptions as c}
											<Select.Item value={c} label={c} />
										{/each}
									</Select.Content>
								</Select.Root>
							</div>

							<div class="flex flex-col gap-2">
								<Label class="text-sm font-medium">Presupuesto</Label>
								<div class="relative">
									<Input
										type="number"
										min="0"
										step="1"
										placeholder="Sin límite"
										bind:value={priceMax}
										class="h-11 pr-9"
									/>
									<span
										class="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm"
										>€</span
									>
								</div>
							</div>
						</div>
					{/if}
				</Card.Content>
			</Card.Root>

			<Button type="submit" size="lg" class="w-full">
				Crear deseo
			</Button>
		</form>
	{:else}
		<AuthRequired title="Di qué plantas buscas y recibe avisos" />
	{/if}
</div>