<script lang="ts">
	import { Input } from "$lib/components/ui/input";
	import { ChevronDown } from "lucide-svelte/icons";

	type Props = {
		id?: string;
		items: string[];
		placeholder?: string;
		ariaLabel?: string;
		value?: string;
		minChars?: number;
		limit?: number;
		error?: boolean;
	};

	let {
		id,
		items,
		placeholder = "Buscar…",
		ariaLabel = "Buscar",
		value = $bindable(""),
		minChars = 2,
		limit = 6,
		error = false
	}: Props = $props();

	let inputEl = $state<HTMLInputElement | null>(null);
	let open = $state(false);

	// Filtro por subcadena excluyendo el match exacto: una opción ya escogida
	// (o el valor exacto) no vuelve a aparecer como sugerencia.
	let matches = $derived(
		(value ?? "").trim().length >= minChars
			? items
					.filter((it) => {
						const l = it.toLowerCase();
						const q = (value ?? "").trim().toLowerCase();
						return l.includes(q) && l !== q;
					})
					.slice(0, limit)
			: []
	);

	let showList = $derived(open && matches.length > 0);

	$effect(() => {
		if (error) inputEl?.focus();
	});
</script>

<div class="relative">
	<Input
		bind:ref={inputEl}
		{id}
		type="text"
		{placeholder}
		aria-label={ariaLabel}
		aria-invalid={error}
		aria-expanded={showList}
		bind:value
		class="h-12 pr-10"
		onfocus={() => (open = true)}
		onblur={() => (open = false)}
	/>
	<ChevronDown
		class={[
			"text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 transition-transform duration-200",
			showList ? "rotate-180" : ""
		].join(" ")}
		aria-hidden="true"
	/>

	{#if showList}
		<ul
			class="border-border bg-card shadow-lg absolute inset-x-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-xl border py-1"
		>
			{#each matches as m}
				<li>
					<button
						type="button"
						onmousedown={(e) => e.preventDefault()}
						onclick={() => (value = m)}
						class="text-muted-foreground hover:bg-muted hover:text-foreground w-full px-3 py-2 text-left text-sm transition-colors"
					>
						{m}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>