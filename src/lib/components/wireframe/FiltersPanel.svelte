<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import * as Select from "$lib/components/ui/select";
	import { Separator } from "$lib/components/ui/separator";
	import { Slider } from "$lib/components/ui/slider";
	import * as Accordion from "$lib/components/ui/accordion";
	import {
		categories,
		listingTypes,
		publishedOptions,
		sortOptions,
		PRICE_MAX,
		PRICE_MIN,
		RADIO_MAX,
		RADIO_MIN,
		type ListingType,
		type PublishedOption,
		type SortOption
	} from "$lib/mock/listings";
	import { defaultFilters, type Filters } from "$lib/mock/filters";

	type Props = {
		filters: Filters;
		onChange: (next: Filters) => void;
		showSort?: boolean;
	};

	let { filters, onChange, showSort = true }: Props = $props();

	function patch(partial: Partial<Filters>) {
		onChange({ ...filters, ...partial });
	}

	function toggleType(t: ListingType) {
		const next = filters.tipo.includes(t)
			? filters.tipo.filter((x) => x !== t)
			: [...filters.tipo, t];
		patch({ tipo: next });
	}

	function clearAll() {
		onChange({ ...defaultFilters, sort: filters.sort });
	}
</script>

<div class="flex flex-col">
	<Accordion.Root
		type="multiple"
		value={showSort
			? ["sort", "tipo", "categoria", "ubicacion", "precio", "publicado"]
			: ["tipo", "categoria", "ubicacion", "precio", "publicado"]}
		class="flex flex-col pb-6"
	>
		<!-- Ordenar por -->
		{#if showSort}
			<Accordion.Item value="sort">
				<Accordion.Trigger class="text-base font-medium">
					Ordenar por
				</Accordion.Trigger>
				<Accordion.Content>
					<Select.Root
						type="single"
						value={filters.sort}
						onValueChange={(v) => patch({ sort: v as SortOption })}
					>
						<Select.Trigger class="w-full">
							<Select.Value class="capitalize" />
						</Select.Trigger>
						<Select.Content>
							{#each sortOptions as opt}
								<Select.Item value={opt.value} label={opt.label} />
							{/each}
						</Select.Content>
					</Select.Root>
				</Accordion.Content>
				<Separator class="my-4" />
			</Accordion.Item>
		{/if}

		<!-- Tipo de anuncio -->
		<Accordion.Item value="tipo">
			<Accordion.Trigger class="text-base font-medium">
				Tipo de anuncio
			</Accordion.Trigger>
			<Accordion.Content>
				<div class="flex flex-col gap-3">
					{#each listingTypes as t}
						<label class="flex items-center gap-2 text-base">
							<Checkbox
								checked={filters.tipo.includes(t)}
								onCheckedChange={() => toggleType(t)}
							/>
							<span class="capitalize">{t}</span>
						</label>
					{/each}
				</div>
			</Accordion.Content>
			<Separator class="my-4" />
		</Accordion.Item>

		<!-- Categoría -->
		<Accordion.Item value="categoria">
			<Accordion.Trigger class="text-base font-medium">
				Categoría
			</Accordion.Trigger>
			<Accordion.Content>
				<div class="flex flex-wrap gap-2">
					{#each categories as cat}
						<button
							onclick={() => patch({ categoria: cat })}
							type="button"
							class="rounded-full border px-3.5 py-1.5 text-sm transition-colors"
							class:bg-primary={filters.categoria === cat}
							class:text-primary-foreground={filters.categoria === cat}
							class:border-primary={filters.categoria === cat}
							class:border-border={filters.categoria !== cat}
							class:hover:bg-muted={filters.categoria !== cat}
						>
							{cat}
						</button>
					{/each}
				</div>
			</Accordion.Content>
			<Separator class="my-4" />
		</Accordion.Item>

		<!-- Ubicación -->
		<Accordion.Item value="ubicacion">
			<Accordion.Trigger class="text-base font-medium">
				Ubicación
			</Accordion.Trigger>
			<Accordion.Content>
				<div class="flex flex-col gap-3">
					<Input
						class="h-10"
						type="search"
						placeholder="Ciudad o barrio"
						value={filters.ubicacion}
						oninput={(e) =>
							patch({ ubicacion: (e.currentTarget as HTMLInputElement).value })}
					/>
					<Slider
						value={[filters.radio]}
						min={RADIO_MIN}
						max={RADIO_MAX}
						step={1}
						onValueChange={(v) => patch({ radio: v[0] })}
					/>
					<div class="text-muted-foreground flex items-center justify-between text-sm">
						<span>Radio de alcance</span>
						<span class="text-foreground font-medium">{filters.radio} km</span>
					</div>
				</div>
			</Accordion.Content>
			<Separator class="my-4" />
		</Accordion.Item>

		<!-- Precio -->
		<Accordion.Item value="precio">
			<Accordion.Trigger class="text-base font-medium">
				Precio
			</Accordion.Trigger>
			<Accordion.Content>
				<div class="flex flex-col gap-4">
					<Slider
						value={[filters.precioMin, filters.precioMax]}
						min={PRICE_MIN}
						max={PRICE_MAX}
						step={1}
						onValueChange={(v) => {
							const [min, max] = v;
							patch({ precioMin: min, precioMax: max });
						}}
					/>
					<div class="flex items-center gap-3">
						<div class="flex flex-1 flex-col gap-1.5">
							<Label class="text-muted-foreground text-xs tracking-wider uppercase">
								Mín
							</Label>
							<Input
								class="h-10"
								type="number"
								min={PRICE_MIN}
								max={PRICE_MAX}
								value={filters.precioMin}
								oninput={(e) => {
									const v = Number(
										(e.currentTarget as HTMLInputElement).value
									);
									if (!Number.isNaN(v)) patch({ precioMin: v });
								}}
							/>
						</div>
						<div class="flex flex-1 flex-col gap-1.5">
							<Label class="text-muted-foreground text-xs tracking-wider uppercase">
								Máx
							</Label>
							<Input
								class="h-10"
								type="number"
								min={PRICE_MIN}
								max={PRICE_MAX}
								value={filters.precioMax}
								oninput={(e) => {
									const v = Number(
										(e.currentTarget as HTMLInputElement).value
									);
									if (!Number.isNaN(v)) patch({ precioMax: v });
								}}
							/>
						</div>
					</div>
				</div>
			</Accordion.Content>
			<Separator class="my-4" />
		</Accordion.Item>

		<!-- Publicado -->
		<Accordion.Item value="publicado">
			<Accordion.Trigger class="text-base font-medium">
				Publicado
			</Accordion.Trigger>
			<Accordion.Content>
				<div class="flex flex-wrap gap-2">
					{#each publishedOptions as opt}
						<button
							onclick={() =>
								patch({ publicado: opt.value as PublishedOption })}
							type="button"
							class="rounded-full border px-3.5 py-1.5 text-sm transition-colors"
							class:bg-primary={filters.publicado === opt.value}
							class:text-primary-foreground={filters.publicado === opt.value}
							class:border-primary={filters.publicado === opt.value}
							class:border-border={filters.publicado !== opt.value}
							class:hover:bg-muted={filters.publicado !== opt.value}
						>
							{opt.label}
						</button>
					{/each}
				</div>
			</Accordion.Content>
		</Accordion.Item>

	</Accordion.Root>
</div>
