<script lang="ts">
	import { page } from '$app/state';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import {
		Heart,
		Bell,
		Package,
		Bookmark,
		MessageCircle,
		Settings,
		Plus,
		LogOut,
		ChevronRight,
		Sparkles
	} from 'lucide-svelte/icons';

	let { data } = $props();

	let displayName = $derived(
		data.profile?.full_name?.trim() || data.profile?.username || 'Tu cuenta'
	);
	let initial = $derived(
		(data.profile?.full_name?.trim()?.[0] ?? data.profile?.username?.[0] ?? '?').toUpperCase()
	);

	type Entry = {
		label: string;
		href: string;
		icon: typeof Heart;
		soon?: boolean;
		badge?: string;
	};

	let sections: { title?: string; items: Entry[] }[] = $derived([
		{
			items: [
				{
					label: 'Anunciar',
					href: '/app/publicar',
					icon: Plus,
					badge: 'Acción principal'
				}
			]
		},
		{
			title: 'Mi cuenta',
			items: [
				{ label: 'Mi perfil', href: '/app/perfil', icon: Sparkles },
				{ label: 'Notificaciones', href: '/app/notificaciones', icon: Bell },
				{ label: 'Mis anuncios', href: '/app/mis-anuncios', icon: Package },
				{ label: 'Favoritos', href: '/app/favoritos', icon: Bookmark },
				{ label: 'Conversaciones', href: '/app/chat', icon: MessageCircle },
				{
					label: 'Deseos y alertas',
					href: '/app/deseos',
					icon: Heart,
					soon: true
				}
			]
		},
		{
			title: 'Ajustes',
			items: [{ label: 'Ajustes', href: '/app/ajustes', icon: Settings }]
		}
	]);
</script>

<svelte:head>
	<title>Mi Botanic · Botanic</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 pt-6 pb-28 sm:px-6 sm:pt-8 sm:pb-32">
	<header class="flex items-center gap-3">
		{#if data.profile?.avatar_url}
			<img
				src={data.profile.avatar_url}
				alt=""
				class="size-14 rounded-full object-cover"
			/>
		{:else}
			<div
				class="bg-primary/15 text-primary flex size-14 items-center justify-center rounded-full text-xl font-medium"
			>
				{initial}
			</div>
		{/if}
		<div class="flex min-w-0 flex-col">
			<h1 class="truncate text-xl font-medium">Mi Botanic</h1>
			<p class="text-muted-foreground truncate text-sm">{displayName}</p>
		</div>
	</header>

	{#each sections as section}
		<section class="flex flex-col gap-2">
			{#if section.title}
				<h2
					class="text-muted-foreground font-mono text-[10px] tracking-wider uppercase"
				>
					{section.title}
				</h2>
			{/if}
			<Card.Root class="gap-0 overflow-hidden py-0">
				<ul class="divide-border divide-y">
					{#each section.items as item, i}
						{@const Icon = item.icon}
						<li>
							<a
								href={item.href}
								class="hover:bg-muted flex items-center gap-3 px-4 py-3 transition-colors"
								class:opacity-60={item.soon}
							>
								<div
									class="bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-md"
								>
									<Icon class="size-5" />
								</div>
								<span class="flex-1 text-sm font-medium">{item.label}</span>
								{#if item.badge}
									<Badge
										variant="secondary"
										class="text-[10px] tracking-wider uppercase"
									>
										{item.badge}
									</Badge>
								{/if}
								{#if item.soon}
									<Badge
										variant="outline"
										class="text-[10px] tracking-wider uppercase"
									>
										próximamente
									</Badge>
								{/if}
								<ChevronRight class="text-muted-foreground size-4" />
							</a>
						</li>
					{/each}
				</ul>
			</Card.Root>
		</section>
	{/each}

	<form method="POST" action="/app/logout" class="mt-2">
		<Button type="submit" variant="outline" class="w-full">
			<LogOut class="size-4" />
			Cerrar sesión
		</Button>
	</form>
</div>