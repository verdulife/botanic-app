<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Heart } from 'lucide-svelte/icons';

	type Props = {
		/** Qué hace esta ruta, explicado brevemente (ej. "Guarda anuncios y sigue tus deseos"). */
		title: string;
		/** Contexto adicional opcional. */
		description?: string;
		icon?: typeof Heart;
	};

	let { title, description, icon = Heart }: Props = $props();
	let Icon = $derived(icon);
</script>

<Card.Root class="border-dashed">
	<Card.Content class="flex flex-col items-center gap-4 py-12 text-center">
		<div
			class="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full border"
		>
			<Icon class="size-6" />
		</div>
		<div class="flex max-w-md flex-col gap-1.5">
			<h2 class="text-lg font-medium">{title}</h2>
			{#if description}
				<p class="text-muted-foreground text-sm">{description}</p>
			{/if}
			<p class="text-muted-foreground text-sm">
				Esta sección es solo para usuarios registrados. Crea tu cuenta gratis y no
				perderás de vista las plantas que te enamoran.
			</p>
		</div>
		<div class="flex flex-col gap-2 sm:flex-row">
			<Button href="/app/registro" class="w-full sm:w-auto">Crear cuenta</Button>
			<Button href="/app/login" variant="outline" class="w-full sm:w-auto">
				Ya tengo cuenta
			</Button>
		</div>
	</Card.Content>
</Card.Root>