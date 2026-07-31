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

<form onsubmit={handleSubmit} novalidate class="mx-auto flex w-full max-w-[31.5rem] flex-col gap-3">
	<div class="relative w-full">
		<Mail class="text-muted-foreground absolute top-1/2 left-4 size-5 -translate-y-1/2" />
		<Input
			bind:value={email}
			type="email"
			placeholder="tu@email.com"
			aria-label="Tu email"
			aria-invalid={status === "error"}
			class="h-14 w-full rounded-full border border-border bg-background pl-12 pr-40 text-lg shadow-sm placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring"
		/>
		<Button
			type="submit"
			size="lg"
			style="corner-shape: round"
			class="absolute top-[3px] right-[3px] h-[calc(100%-6px)] rounded-full px-5 text-base"
			disabled={status === "loading" || status === "success"}
		>
			{#if status === "loading"}
				Enviando…
			{:else}
				<Send />
				Unirme
			{/if}
		</Button>
	</div>
	<p aria-live="polite" class="min-h-4 text-center text-xs">
		{#if status === "success"}
			<span class="text-foreground">¡Pase reservado! Te avisaremos antes que a nadie.</span>
		{:else if status === "error"}
			<span class="text-destructive">Introduce un email válido.</span>
		{/if}
	</p>
	<p class="text-center text-xs text-muted-foreground">
		Al unirte, usaremos tu email para mantenerte al día de todas las novedades, actualizaciones
		y la fecha de lanzamiento. No somos pesados, pero podrás darte de baja cuando quieras.
	</p>
</form>
