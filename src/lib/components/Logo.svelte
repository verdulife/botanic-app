<script lang="ts">
	import { logoSvg } from "$lib/logo-svg";

	let {
		class: className = "h-7",
	}: { class?: string } = $props();
</script>

{@html logoSvg({ class: `text-still-800 ${className}` })}
