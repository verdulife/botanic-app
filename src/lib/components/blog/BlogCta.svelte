<script lang="ts">
	import WaitlistForm from "$lib/components/waitlist/WaitlistForm.svelte";
	import Logo from "$lib/components/Logo.svelte";

	let {
		title = "Consigue tu pase para el día uno de Botanic",
		subtitle = "Apúntate a la lista de espera y te avisamos en cuanto abramos: acceso anticipado y cero spam.",
	}: { title?: string; subtitle?: string } = $props();
</script>

<section
	id="waitlist"
	class="relative scroll-mt-16 overflow-hidden rounded-3xl bg-secondary/70 px-6 py-16 md:py-20"
>
	<div class="relative mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
		<Logo class="h-7" />
		<h2 class="max-w-2xl text-4xl leading-tight font-light text-balance text-still-950 md:text-6xl">
			{title}
		</h2>
		<p class="max-w-xl text-pretty text-muted-foreground">{subtitle}</p>
		<div class="mt-2 w-full">
			<WaitlistForm />
		</div>
	</div>
</section>
