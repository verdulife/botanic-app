<script lang="ts">
	import { Accordion as AccordionPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	type Props = AccordionPrimitive.RootProps & {
		children?: import("svelte").Snippet;
	};

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: Props = $props();
</script>

<AccordionPrimitive.Root
	bind:ref
	data-slot="accordion"
	class={cn("", className)}
	{...restProps}
>
	{@render children?.()}
</AccordionPrimitive.Root>
