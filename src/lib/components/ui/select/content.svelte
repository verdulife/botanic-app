<script lang="ts">
	import { Select as SelectPrimitive } from "bits-ui";
	import { ChevronDown, ChevronUp } from "lucide-svelte/icons";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: SelectPrimitive.ContentProps = $props();
</script>

<SelectPrimitive.Portal>
	<SelectPrimitive.Content
		bind:ref
		data-slot="select-content"
		class={cn(
			"bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--bits-select-content-available-height) min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
			className
		)}
		{...restProps}
	>
		<SelectPrimitive.ScrollUpButton
			class="flex cursor-default items-center justify-center py-1"
		>
			<ChevronUp class="text-muted-foreground size-4" />
		</SelectPrimitive.ScrollUpButton>
		<SelectPrimitive.Viewport
			class={cn(
				"p-1",
				"h-[var(--bits-select-anchor-height)] w-full min-w-[var(--bits-select-anchor-width)] scroll-my-1"
			)}
		>
			{@render children?.()}
		</SelectPrimitive.Viewport>
		<SelectPrimitive.ScrollDownButton
			class="flex cursor-default items-center justify-center py-1"
		>
			<ChevronDown class="text-muted-foreground size-4" />
		</SelectPrimitive.ScrollDownButton>
	</SelectPrimitive.Content>
</SelectPrimitive.Portal>
