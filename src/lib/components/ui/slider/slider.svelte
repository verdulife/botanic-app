<script lang="ts">
	import { Slider as SliderPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	type Props = {
		ref?: HTMLElement | null;
		value?: number[];
		min?: number;
		max?: number;
		step?: number;
		disabled?: boolean;
		class?: string;
		onValueChange?: (value: number[]) => void;
	};

	let {
		ref = $bindable(null),
		value = $bindable<number[]>([0]),
		min = 0,
		max = 100,
		step = 1,
		disabled = false,
		class: className,
		onValueChange
	}: Props = $props();

	const Root = SliderPrimitive.Root as unknown as import("svelte").Component<{
		ref?: HTMLElement | null;
		value?: number[];
		min?: number;
		max?: number;
		step?: number;
		disabled?: boolean;
		class?: string;
		"data-slot"?: string;
		onValueChange?: (value: number[]) => void;
		children?: import("svelte").Snippet<[{ thumbItems: Array<{ value: number; index: number }> }]>;
		[key: string]: unknown;
	}>;
</script>

<Root
	bind:ref
	bind:value
	{min}
	{max}
	{step}
	{disabled}
	{onValueChange}
	data-slot="slider"
	class={cn(
		"relative flex w-full touch-none items-center select-none py-2.5 data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
		className
	)}
>
	{#snippet children({ thumbItems })}
		<span
			data-orientation="horizontal"
			class="bg-muted relative grow rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
		>
			<SliderPrimitive.Range
				data-slot="slider-range"
				class="bg-primary absolute rounded-full data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
			/>
		</span>
		{#each thumbItems as thumbItem}
			<SliderPrimitive.Thumb
				index={thumbItem.index}
				class="border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
			>
				{#snippet child({ props })}
					<div {...props}></div>
				{/snippet}
			</SliderPrimitive.Thumb>
		{/each}
	{/snippet}
</Root>
