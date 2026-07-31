<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Mail, Send } from "lucide-svelte/icons";

	type Status = "idle" | "loading" | "success" | "error";

	let email = $state("");
	let status = $state<Status>("idle");

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		const trimmed = email.trim();
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
			status = "error";
			return;
		}
		status = "loading";
		await new Promise((resolve) => setTimeout(resolve, 700));
		email = "";
		status = "success";
	}
</script>

<form onsubmit={handleSubmit} novalidate class="flex w-full max-w-sm flex-col gap-3">
	<div class="relative">
		<Mail class="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
		<Input
			bind:value={email}
			type="email"
			placeholder="tu@email.com"
			aria-label="Tu email"
			aria-invalid={status === "error"}
			class="border-0 bg-muted/50 pl-9 placeholder:text-muted-foreground/60 focus-visible:ring-ring"
		/>
	</div>
	<Button type="submit" size="lg" disabled={status === "loading" || status === "success"}>
		{#if status === "loading"}
			Enviando…
		{:else}
			<Send data-icon="inline-end" />
			Unirme a la lista
		{/if}
	</Button>
	<p aria-live="polite" class="min-h-4 text-center text-xs">
		{#if status === "success"}
			<span class="text-foreground">¡Listo! Te avisaremos cuando haya novedades.</span>
		{:else if status === "error"}
			<span class="text-destructive">Introduce un email válido.</span>
		{:else}
			<span class="text-muted-foreground">Sin spam. Date de baja cuando quieras.</span>
		{/if}
	</p>
</form>
