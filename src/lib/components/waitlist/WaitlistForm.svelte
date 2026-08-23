<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Mail } from "lucide-svelte/icons";

	type Status = "idle" | "loading" | "success" | "error";

	let email = $state("");
	let consent = $state(false);
	let status = $state<Status>("idle");
	let errorMessage = $state("");
	let alreadyRegistered = $state(false);

	const CONFETTI_COLORS = ["#74AA7B", "#45844F", "#32693C", "#285431", "#7C766A", "#4A4238"];

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		const trimmed = email.trim();
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
			status = "error";
			errorMessage = "Introduce un email válido.";
			return;
		}
		if (!consent) {
			status = "error";
			errorMessage = "Debes aceptar la Política de Privacidad y el Aviso Legal.";
			return;
		}
		status = "loading";
		const res = await fetch("/api/waitlist", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email: trimmed, consent }),
		});
		if (!res.ok) {
			status = "error";
			errorMessage = "Algo salió mal. Inténtalo de nuevo.";
			return;
		}
		const data = (await res.json().catch(() => null)) as { alreadyRegistered?: boolean } | null;
		email = "";
		alreadyRegistered = Boolean(data?.alreadyRegistered);
		status = "success";
		if (!alreadyRegistered && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			const confetti = (await import("canvas-confetti")).default;
			confetti({
				particleCount: 280,
				spread: 90,
				startVelocity: 50,
				origin: { y: 0.7 },
				colors: CONFETTI_COLORS,
			});
		}
	}
</script>

<form onsubmit={handleSubmit} novalidate class="mx-auto flex w-full max-w-[31.5rem] flex-col">
	<div class="relative w-full">
		<Mail class="text-muted-foreground absolute top-1/2 left-4 size-5 -translate-y-1/2" />
		<Input
			bind:value={email}
			type="email"
			placeholder="tu@email.com"
			aria-label="Tu email"
			aria-invalid={status === "error"}
			class="h-14 w-full rounded-full border border-border bg-background pl-12 pr-30 text-lg shadow-sm placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring"
		/>
		<Button
			type="submit"
			size="lg"
			class="absolute top-[3px] right-[3px] h-[calc(100%-6px)] rounded-full px-5 text-base"
			disabled={status === "loading" || status === "success"}
		>
			{#if status === "loading"}
				Enviando…
			{:else}
				Unirme
			{/if}
		</Button>
	</div>
	<p aria-live="polite" class="min-h-[1.25rem] pt-2 text-center text-sm">
		{#if status === "success"}
			<span class="text-foreground">
				{alreadyRegistered
					? "Ya estás en la lista de espera de Botanic 🌿"
					: "¡Pase reservado! Te avisaremos antes que a nadie."}
			</span>
		{:else if status === "error"}
			<span class="text-destructive">{errorMessage}</span>
		{/if}
	</p>
	<label class="flex items-center justify-center gap-2 pt-2 text-sm text-muted-foreground">
		<input type="checkbox" bind:checked={consent} class="size-4 shrink-0 accent-[var(--color-still-400)]" />
		<span>
			He leído y acepto la
			<a href="/politica-de-privacidad" class="underline underline-offset-2 hover:text-foreground">Política de Privacidad</a>
			y el
			<a href="/aviso-legal" class="underline underline-offset-2 hover:text-foreground">Aviso Legal</a>.
		</span>
	</label>
	<p class="pt-3 text-center text-xs text-muted-foreground">
		Al unirte, usaremos tu email para mantenerte al día de todas las novedades, actualizaciones,
		contenido del blog y la fecha de lanzamiento. No somos pesados, pero podrás darte de baja cuando quieras.
	</p>
</form>
