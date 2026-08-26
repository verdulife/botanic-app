<script lang="ts">
	import { SlidersHorizontal } from 'lucide-svelte/icons';
	import VistaSelector from './VistaSelector.svelte';

	type Props = {
		onFilter: () => void;
		class?: string;
	};

	let { onFilter, class: className = '' }: Props = $props();
</script>

<div
	class="border-border inline-flex items-center rounded-full border {className}"
	role="group"
	aria-label="Controles del marketplace"
>
	<button
		type="button"
		onclick={onFilter}
		class="hover:bg-muted inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors"
		aria-label="Filtrar"
	>
		<SlidersHorizontal class="size-4" />
		<span>Filtrar</span>
	</button>

	<span class="bg-border h-4 w-px shrink-0" aria-hidden="true"></span>

	<div class="inline-flex items-center">
		<VistaSelector variant="inline" />
	</div>
</div>