<script lang="ts">
	import { Select as SelectPrimitive } from "bits-ui";

	type Props = {
		open?: boolean;
		value?: string | string[];
		type?: "single" | "multiple";
		name?: string;
		required?: boolean;
		disabled?: boolean;
		children?: import("svelte").Snippet;
		onOpenChange?: (open: boolean) => void;
		onValueChange?: (value: string | string[] | undefined) => void;
	};

	let {
		open = $bindable(false),
		value = $bindable<string | string[]>(),
		type = "single" as "single" | "multiple",
		name,
		required = false,
		disabled = false,
		children,
		onOpenChange,
		onValueChange
	}: Props = $props();

	const Root = SelectPrimitive.Root as unknown as import("svelte").Component<
		{
			open?: boolean;
			value?: string | string[];
			type?: "single" | "multiple";
			name?: string;
			required?: boolean;
			disabled?: boolean;
			children?: import("svelte").Snippet;
			onOpenChange?: (open: boolean) => void;
			onValueChange?: (value: string | string[] | undefined) => void;
			[key: string]: unknown;
		}
	>;
</script>

<Root
	bind:open
	bind:value
	{type}
	{name}
	{required}
	{disabled}
	{onOpenChange}
	{onValueChange}
>
	{@render children?.()}
</Root>
