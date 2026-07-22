<script lang="ts">
	import { Sprout, Search, Heart, PlusCircle, User } from "lucide-svelte/icons";

	let { children } = $props();
</script>

<div class="mx-auto flex min-h-dvh max-w-lg flex-col bg-background">
	<main class="flex-1">
		{@render children()}
	</main>

	<nav class="border-border sticky bottom-0 flex items-center justify-around border-t bg-card px-2 pt-2 pb-1">
		<a href="/app" class="flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium text-primary">
			<Search class="size-5" />
			Explorar
		</a>
		<a href="/app" class="flex flex-col items-center gap-0.5 px-3 py-1 text-xs text-muted-foreground">
			<Heart class="size-5" />
			Favoritos
		</a>
		<a href="/app" class="flex flex-col items-center gap-0.5 px-3 py-1 text-xs text-muted-foreground">
			<PlusCircle class="size-5" />
			Publicar
		</a>
		<a href="/app" class="flex flex-col items-center gap-0.5 px-3 py-1 text-xs text-muted-foreground">
			<User class="size-5" />
			Perfil
		</a>
	</nav>
</div>
