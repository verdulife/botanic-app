<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import AuthShell from '$lib/components/auth/AuthShell.svelte';
	import { Mail } from 'lucide-svelte/icons';

	let { form } = $props();
	let pending = $state(false);
	let sent = $derived(form?.sent === true);
</script>

<AuthShell
	title={sent ? 'Revisa tu bandeja' : 'Recuperar contraseña'}
	subtitle={sent
		? `Si ${form?.email} existe, te enviaremos un enlace para restablecerla.`
		: 'Te enviaremos un enlace por email para crear una contraseña nueva.'}
>
	{#if sent}
		<div
			class="bg-card text-card-foreground flex flex-col items-center gap-3 rounded-2xl border p-6 text-center"
		>
			<div class="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full">
				<Mail class="size-5" />
			</div>
			<p class="text-muted-foreground text-sm">
				Si no lo ves, revisa la carpeta de spam. El enlace caduca en 1 hora.
			</p>
			<a
				href="/app/login"
				class="text-foreground mt-2 text-sm font-medium underline-offset-4 hover:underline"
			>
				Volver a iniciar sesión
			</a>
		</div>
	{:else}
		<form
			method="POST"
			use:enhance={() => {
				pending = true;
				return async ({ update }) => {
					await update();
					pending = false;
				};
			}}
			class="flex flex-col gap-4"
		>
			<div class="flex flex-col gap-2">
				<Label for="email">Email</Label>
				<Input
					id="email"
					name="email"
					type="email"
					autocomplete="email"
					required
					value={form?.email ?? ''}
					placeholder="tu@email.com"
				/>
			</div>

			{#if form?.error}
				<p class="text-destructive text-sm" role="alert">{form.error}</p>
			{/if}

			<Button type="submit" disabled={pending} class="w-full">
				{pending ? 'Enviando…' : 'Enviar enlace de recuperación'}
			</Button>
		</form>
	{/if}

	{#snippet footer()}
		<p class="text-muted-foreground text-sm">
			<a href="/app/login" class="text-foreground font-medium underline-offset-4 hover:underline">
				Volver a iniciar sesión
			</a>
		</p>
	{/snippet}
</AuthShell>