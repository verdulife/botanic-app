<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { mockWishes, wishPriceLabel, type Wish } from '$lib/mock/wishes';
	import { Bell, ChevronRight, Plus, Sparkles } from 'lucide-svelte/icons';

	type Props = {
		wishes?: Wish[];
	};

	let { wishes = mockWishes }: Props = $props();
</script>

<div class="flex flex-col gap-3">
	<Button href="/app/deseos/nuevo" class="self-start">
		<Plus class="size-4" />
		Crear deseo
	</Button>

	{#if wishes.length === 0}
		<Card.Root class="border-dashed">
			<Card.Content class="flex flex-col items-center gap-2 py-10 text-center">
				<div
					class="bg-muted text-muted-foreground flex size-10 items-center justify-center rounded-full"
				>
					<Sparkles class="size-5" />
				</div>
				<p class="text-sm font-medium">Aún no tienes deseos</p>
				<p class="text-muted-foreground max-w-sm text-sm">
					Cuéntanos qué plantas estás buscando y te avisaremos cuando alguien las
					publique.
				</p>
			</Card.Content>
		</Card.Root>
	{:else}
		<Card.Root class="gap-0 overflow-hidden py-0">
			<ul class="divide-border divide-y">
				{#each wishes as wish}
					{@const active = wish.status === 'activo'}
					<li>
						<a
							href="/app/deseo/{wish.id}"
							class="hover:bg-muted flex items-center gap-3 px-4 py-3.5 transition-colors"
						>
							<div
								class="bg-muted text-muted-foreground flex size-10 shrink-0 items-center justify-center rounded-full"
							>
								<Sparkles class="size-5" />
							</div>
							<div class="flex min-w-0 flex-1 flex-col gap-1">
								<div class="flex items-center gap-2">
									<span class="truncate text-sm font-medium">{wish.keywords}</span>
									<Badge
										variant={active ? 'default' : 'secondary'}
										class="shrink-0 text-[10px] tracking-wider uppercase"
									>
										{wish.status}
									</Badge>
								</div>
								<div class="text-muted-foreground flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs">
									<span>{wish.category}</span>
									<span aria-hidden="true" class="opacity-50">·</span>
									<span>{wishPriceLabel(wish)}</span>
									<span aria-hidden="true" class="opacity-50">·</span>
									<span class="truncate">{wish.location}</span>
								</div>
								<div class="text-muted-foreground flex items-center gap-2 text-xs">
									<span class="font-medium text-foreground/80">
										{wish.matches} coincidencia{wish.matches === 1 ? '' : 's'}
									</span>
									<span class="flex items-center gap-1">
										<Bell
											class={['size-3.5', wish.alert ? 'text-foreground' : 'opacity-50'].join(' ')}
										/>
										{wish.alert ? 'Alerta activa' : 'Sin alerta'}
									</span>
								</div>
							</div>
							<ChevronRight class="text-muted-foreground size-4 shrink-0" />
						</a>
					</li>
				{/each}
			</ul>
		</Card.Root>
	{/if}
</div>