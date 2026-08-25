<script lang="ts">
	import { Dialog as SheetPrimitive } from "bits-ui";
	import { X } from "lucide-svelte/icons";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: SheetPrimitive.CloseProps = $props();
</script>

<SheetPrimitive.Close
	bind:ref
	data-slot="sheet-close"
	class={cn(
		"ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden",
		className
	)}
	{...restProps}
>
	<X class="size-4" />
	<span class="sr-only">Close</span>
</SheetPrimitive.Close>
