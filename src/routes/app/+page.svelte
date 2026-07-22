<script lang="ts">
	import { Input } from "$lib/components/ui/input";
	import { Badge } from "$lib/components/ui/badge";
	import * as Card from "$lib/components/ui/card";
	import { Search, MapPin, Heart, Sprout } from "lucide-svelte/icons";
	import { mockListings, categories } from "$lib/mock/listings";

	let activeCategory = $state("Todas");

	let filtered = $derived(
		activeCategory === "Todas"
			? mockListings
			: mockListings.filter((l) => l.category === activeCategory)
	);
</script>

<div class="flex flex-col gap-5 px-5 pt-5 pb-3">
	<div class="flex items-center gap-3">
		<div class="bg-primary/10 flex size-9 items-center justify-center rounded-xl">
			<Sprout class="text-primary size-5" />
		</div>
		<div class="relative flex-1">
			<Search class="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
			<Input class="bg-muted/50 border-0 pl-9 ring-1 ring-transparent focus-visible:ring-ring placeholder:text-muted-foreground/60" placeholder="Busca esquejes, semillas..." />
		</div>
	</div>

	<div class="flex gap-2 overflow-x-auto pb-0.5">
		{#each categories as cat}
			<button
				onclick={() => (activeCategory = cat)}
				type="button"
			>
				<Badge
					variant={activeCategory === cat ? "default" : "secondary"}
					class="cursor-pointer whitespace-nowrap rounded-full px-3.5 py-1 text-xs"
				>
					{cat}
				</Badge>
			</button>
		{/each}
	</div>
</div>

<div class="grid grid-cols-2 gap-4 px-5 pb-24">
	{#each filtered as listing (listing.id)}
		<Card.Card class="group overflow-hidden">
			<div
				class="from-primary/15 to-primary/5 relative flex aspect-square items-center justify-center bg-gradient-to-br"
			>
				<Card.CardAction>
					<button
						type="button"
						class="hover:bg-background/80 text-muted-foreground hover:text-destructive flex size-7 items-center justify-center rounded-full bg-white/70 text-xs backdrop-blur-xs transition-colors"
					>
						<Heart class="size-3.5" />
					</button>
				</Card.CardAction>
			</div>
			<Card.CardContent class="flex flex-col gap-2 px-3 py-3">
				<div class="flex items-center justify-between">
					<Badge variant="secondary" class="rounded-full px-2 text-[10px]">
						{listing.category}
					</Badge>
					<span class="text-foreground font-bold text-sm">{listing.price} €</span>
				</div>
				<span class="font-semibold text-sm leading-snug">{listing.title}</span>
				<div class="flex items-center gap-1.5">
					<div class="flex size-5 items-center justify-center rounded-full {listing.avatar} text-[9px] font-bold text-white">
						{listing.seller[0]}
					</div>
					<span class="text-muted-foreground text-xs">{listing.seller}</span>
					<span class="text-muted-foreground/40">·</span>
					<div class="flex items-center gap-0.5">
						<MapPin class="text-muted-foreground/60 size-3" />
						<span class="text-muted-foreground/70 text-xs">{listing.location}</span>
					</div>
				</div>
			</Card.CardContent>
		</Card.Card>
	{/each}
</div>
