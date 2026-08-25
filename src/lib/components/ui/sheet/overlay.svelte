<script lang="ts">
	import { Dialog as SheetPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		...restProps
	}: SheetPrimitive.OverlayProps = $props();
</script>

<SheetPrimitive.Overlay
	data-slot="sheet-overlay"
	class={cn(
		"fixed inset-x-0 top-28 bottom-16 z-40 bg-black/40",
		className
	)}
	style="touch-action: none; overscroll-behavior: none;"
	{...restProps}
/>
