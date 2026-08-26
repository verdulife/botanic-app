<script lang="ts">
	import AuthShell from '$lib/components/auth/AuthShell.svelte';
	import { Mail, LogIn } from 'lucide-svelte/icons';

	let { data } = $props();
</script>

<AuthShell
	title="Verifica tu email"
	subtitle="Confirma tu dirección de email para empezar a usar Botanic."
>
	<div
		class="bg-card text-card-foreground flex flex-col items-center gap-4 rounded-2xl border p-6 text-center"
	>
		<div class="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
			<Mail class="size-6" />
		</div>

		{#if data.status === 'pending'}
			<div class="space-y-1">
				<p class="font-medium">Te hemos enviado un enlace</p>
				<p class="text-muted-foreground text-sm">
					Revisa tu bandeja y abre el enlace para activar tu cuenta. Caduca en 1 hora.
				</p>
			</div>
			<a
				href="/app/login"
				class="text-foreground mt-2 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
			>
				<LogIn class="size-4" />
				Volver a iniciar sesión
			</a>
		{:else}
			<div class="space-y-1">
				<p class="font-medium">Confirma tu email para continuar</p>
				<p class="text-muted-foreground text-sm">
					Estás autenticado como {data.email}, pero tu email aún no está confirmado. Revisa
					tu bandeja y abre el enlace que te hemos enviado.
				</p>
			</div>
			<form method="POST" action="/app/logout">
				<button type="submit" class="text-muted-foreground hover:text-foreground text-sm underline-offset-4 hover:underline">
					Cerrar sesión
				</button>
			</form>
		{/if}
	</div>
</AuthShell>