<script lang="ts">
	import { page } from "$app/state";
	import * as Card from "$lib/components/ui/card";
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import { LogIn } from "lucide-svelte/icons";

	type Action = {
		label: string;
		href: string;
		variant?: "default" | "outline" | "secondary" | "ghost";
	};

	type Props = {
		id: string;
		title: string;
		description?: string;
		mvp?: boolean;
		requiresAuth?: boolean;
		placeholder?: string;
		primaryActions?: Action[];
		secondaryActions?: Action[];
		showParams?: boolean;
	};

	let {
		id,
		title,
		description,
		mvp = false,
		requiresAuth = false,
		placeholder,
		primaryActions = [],
		secondaryActions = [],
		showParams = true
	}: Props = $props();

	let params = $derived(Object.entries(page.params));
</script>

<svelte:head>
	<title>{title} · Botanic</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-12">
	<header class="flex flex-col gap-3">
		<div class="flex flex-wrap items-center gap-2">
			<Badge variant="outline" class="font-mono text-[10px] tracking-wider uppercase">
				{id}
			</Badge>
			{#if mvp}
				<Badge variant="default" class="text-[10px] tracking-wider uppercase">MVP</Badge>
			{:else}
				<Badge variant="secondary" class="text-[10px] tracking-wider uppercase">futuro</Badge>
			{/if}
			{#if requiresAuth}
				<Badge variant="secondary" class="text-[10px] tracking-wider uppercase">requiere sesión</Badge>
			{/if}
		</div>
		<h1 class="text-3xl font-medium sm:text-4xl">{title}</h1>
		{#if description}
			<p class="text-muted-foreground text-sm sm:text-base">{description}</p>
		{/if}
	</header>

	{#if showParams && params.length > 0}
		<Card.Root class="border-dashed">
			<Card.Content class="flex flex-col gap-2 py-4">
				<p class="text-muted-foreground font-mono text-[10px] tracking-wider uppercase">
					Parámetros de ruta
				</p>
				<dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
					{#each params as [key, value]}
						<dt class="text-muted-foreground font-mono">{key}</dt>
						<dd class="font-mono">{value}</dd>
					{/each}
				</dl>
			</Card.Content>
		</Card.Root>
	{/if}

	<Card.Root class="bg-muted/30 border-dashed">
		<Card.Content class="flex flex-col items-center justify-center gap-3 py-12 text-center">
			<div
				class="bg-background text-muted-foreground flex size-12 items-center justify-center rounded-full border"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					class="size-6"
				>
					<rect x="3" y="3" width="18" height="18" rx="2" />
					<path d="M9 9h6M9 13h6M9 17h4" />
				</svg>
			</div>
			<p class="text-muted-foreground max-w-md text-sm">
				{placeholder ?? "Aquí irá el contenido de esta vista."}
			</p>
		</Card.Content>
	</Card.Root>

	{#if requiresAuth}
		<Card.Root class="border-dashed">
			<Card.Content class="flex flex-col items-center gap-3 py-6 text-center">
				<div
					class="bg-background text-muted-foreground flex size-10 items-center justify-center rounded-full border"
				>
					<LogIn class="size-5" />
				</div>
				<div class="flex flex-col gap-1">
					<p class="text-sm font-medium">Esta vista requiere iniciar sesión.</p>
					<p class="text-muted-foreground text-xs">
						El wireframe muestra el flujo de navegación aunque no haya lógica de auth implementada.
					</p>
				</div>
				<Button href="/app/login" variant="default">Iniciar sesión</Button>
			</Card.Content>
		</Card.Root>
	{/if}

	{#if primaryActions.length > 0}
		<section class="flex flex-col gap-2">
			<h2 class="text-muted-foreground font-mono text-[10px] tracking-wider uppercase">
				Acciones principales
			</h2>
			<div class="flex flex-wrap gap-2">
				{#each primaryActions as action}
					<Button href={action.href} variant={action.variant ?? "default"}>
						{action.label}
					</Button>
				{/each}
			</div>
		</section>
	{/if}

	{#if secondaryActions.length > 0}
		<section class="flex flex-col gap-2">
			<h2 class="text-muted-foreground font-mono text-[10px] tracking-wider uppercase">
				Accesos relacionados
			</h2>
			<div class="flex flex-wrap gap-2">
				{#each secondaryActions as action}
					<Button href={action.href} variant={action.variant ?? "outline"}>
						{action.label}
					</Button>
				{/each}
			</div>
		</section>
	{/if}
</div>
