<script lang="ts">
	import { Input } from "$lib/components/ui/input";
	import { Search, X } from "lucide-svelte/icons";

	type Props = {
		placeholder?: string;
		label?: string;
		value?: string;
	};

	let {
		placeholder = "Buscar…",
		label = "Buscar",
		value = $bindable("")
	}: Props = $props();
</script>

<div class="relative">
	<Search
		class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2"
		aria-hidden="true"
	/>
	<Input
		type="text"
		{placeholder}
		aria-label={label}
		bind:value
		class="h-11 rounded-full pl-10 pr-9"
	/>
	{#if value}
		<button
			type="button"
			onclick={() => (value = "")}
			class="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 flex size-6 -translate-y-1/2 items-center justify-center rounded-full transition-colors"
			aria-label="Limpiar búsqueda"
		>
			<X class="size-4" />
		</button>
	{/if}
</div>