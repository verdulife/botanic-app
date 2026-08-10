<script lang="ts">
	import WaitlistForm from "$lib/components/waitlist/WaitlistForm.svelte";
	import Logo from "$lib/components/Logo.svelte";

	let {
		title = "Únete a la primera comunidad donde las plantas conocen a gente nueva",
		subtitle = "Déjanos tu email y entérate antes que nadie del lanzamiento.",
	}: { title?: string; subtitle?: string } = $props();
</script>

<section
	id="waitlist"
	class="relative scroll-mt-16 overflow-hidden rounded-3xl bg-secondary/70 px-6 py-16 md:py-20"
>
	<div class="relative mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
		<Logo class="h-7" />
		<h2 class="max-w-2xl text-3xl leading-tight font-light text-balance text-still-950 md:text-4xl">
			{title}
		</h2>
		<p class="max-w-md text-pretty text-muted-foreground">{subtitle}</p>
		<div class="mt-2 w-full">
			<WaitlistForm />
		</div>
	</div>
</section>
