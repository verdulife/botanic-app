<script lang="ts">
	import { Dialog as SheetPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	type Props = {
		ref?: HTMLElement | null;
		class?: string;
		side?: "top" | "right" | "bottom" | "left";
		children?: import("svelte").Snippet;
		[key: string]: unknown;
	};

	let {
		ref = $bindable(null),
		class: className,
		side = "right",
		children
	}: Props = $props();
</script>

<SheetPrimitive.Portal>
	<SheetPrimitive.Overlay />
	<SheetPrimitive.Content
		bind:ref
		data-slot="sheet-content"
		data-side={side}
		class={cn(
			"bg-card fixed z-50 flex flex-col gap-4 shadow-lg",
			"data-[side=top]:inset-x-0 data-[side=top]:top-28 data-[side=top]:bottom-16",
			"data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t",
			"data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=right]:sm:max-w-sm",
			"data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=left]:sm:max-w-sm",
			className
		)}
	>
		{@render children?.()}
	</SheetPrimitive.Content>
</SheetPrimitive.Portal>
