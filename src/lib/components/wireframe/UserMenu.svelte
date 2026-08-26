<script lang="ts">
	import { page } from '$app/state';
	import { LogOut, User as UserIcon } from 'lucide-svelte/icons';

	type Profile = {
		username: string;
		avatar_url?: string | null;
		full_name?: string | null;
	} | null;

	let { profile }: { profile: Profile } = $props();

	let displayName = $derived(profile?.full_name?.trim() || profile?.username || '');
	let initial = $derived(
		(profile?.full_name?.trim()?.[0] ?? profile?.username?.[0] ?? '?').toUpperCase()
	);
</script>

<details class="group relative">
	<summary
		class="hover:bg-muted flex cursor-pointer list-none items-center gap-2 rounded-md p-1 transition-colors [&::-webkit-details-marker]:hidden"
		aria-label="Menú de cuenta"
	>
		{#if profile?.avatar_url}
			<img
				src={profile.avatar_url}
				alt={displayName}
				class="size-9 rounded-full object-cover"
			/>
		{:else}
			<div
				class="bg-primary/15 text-primary flex size-9 items-center justify-center rounded-full text-sm font-medium"
			>
				{initial}
			</div>
		{/if}
		<span class="hidden text-sm font-medium md:inline">
			{displayName || page.data.user?.email?.split('@')[0]}
		</span>
	</summary>

	<div
		class="bg-card border-border absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-xl border shadow-lg"
		role="menu"
	>
		<div class="border-border border-b px-3 py-3">
			<p class="truncate text-sm font-medium">{displayName || 'Tu cuenta'}</p>
			<p class="text-muted-foreground truncate text-xs">{page.data.user?.email}</p>
		</div>
		<div class="flex flex-col py-1">
			<a
				href="/app/perfil"
				class="hover:bg-muted flex items-center gap-2 px-3 py-2 text-sm transition-colors"
				role="menuitem"
			>
				<UserIcon class="size-4" />
				Mi perfil
			</a>
			<a
				href="/app/ajustes"
				class="hover:bg-muted flex items-center gap-2 px-3 py-2 text-sm transition-colors"
				role="menuitem"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.75"
					class="size-4"
				>
					<circle cx="12" cy="12" r="3" />
					<path
						d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
					/>
				</svg>
				Ajustes
			</a>
		</div>
		<div class="border-border border-t py-1">
			<form method="POST" action="/app/logout">
				<button
					type="submit"
					class="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors"
					role="menuitem"
				>
					<LogOut class="size-4" />
					Cerrar sesión
				</button>
			</form>
		</div>
	</div>
</details>