<script lang="ts">
	import { Dialog as SheetPrimitive } from "bits-ui";

	type Props = SheetPrimitive.RootProps & {
		children?: import("svelte").Snippet;
	};

	let {
		open = $bindable(false),
		children,
		...restProps
	}: Props = $props();
</script>

<SheetPrimitive.Root
	bind:open
	{...restProps}
>
	{@render children?.()}
</SheetPrimitive.Root>
