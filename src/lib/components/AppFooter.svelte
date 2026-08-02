<script lang="ts">
	import { Heart } from "lucide-svelte/icons";
</script>

<footer
	class="border-t border-border/70 px-4 py-8 text-center text-sm text-muted-foreground"
>
	<nav
		class="mb-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1"
		aria-label="Enlaces"
	>
		<a href="/" class="text-primary hover:underline">Inicio</a>
		<span aria-hidden="true">·</span>
		<a href="/blog" class="text-primary hover:underline">Blog</a>
	</nav>
	<p>
		Botanic™ 2026 · Hecho con
		<Heart class="inline size-3.5 fill-primary text-primary" aria-hidden="true" /> para la
		comunidad <strong class="text-foreground">Plant Lovers</strong>
	</p>
</footer>
