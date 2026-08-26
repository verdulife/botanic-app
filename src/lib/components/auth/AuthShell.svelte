<script lang="ts">
	import { Sprout } from 'lucide-svelte/icons';

	type Props = {
		title: string;
		subtitle?: string;
		children: import('svelte').Snippet;
		footer?: import('svelte').Snippet;
	};

	let { title, subtitle, children, footer }: Props = $props();
</script>

<div
	class="bg-background flex min-h-dvh flex-col items-center justify-center px-4 py-8 sm:px-6"
>
	<a href="/" class="mb-6 flex items-center gap-2 sm:mb-8" aria-label="Volver al inicio">
		<div class="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
			<Sprout class="size-6" />
		</div>
		<span class="text-xl font-semibold tracking-tight">Botanic</span>
	</a>

	<div class="w-full max-w-sm">
		<div class="mb-6 flex flex-col gap-1 text-center">
			<h1 class="text-2xl font-medium tracking-tight">{title}</h1>
			{#if subtitle}
				<p class="text-muted-foreground text-sm">{subtitle}</p>
			{/if}
		</div>

		{@render children?.()}

		{#if footer}
			<div class="mt-6 text-center">
				{@render footer?.()}
			</div>
		{/if}
	</div>
</div>