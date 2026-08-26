<script lang="ts" module>
	export const MIN_PASSWORD_HINT = 8;
</script>

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
	title={sent ? 'Confirma tu email' : 'Crea tu cuenta'}
	subtitle={sent
		? `Te hemos enviado un enlace a ${form?.email}. Ábrelo para activar tu cuenta.`
		: 'Empieza a comprar, vender y conectar en Botanic.'}
>
	{#if sent}
		<div
			class="bg-card text-card-foreground flex flex-col items-center gap-3 rounded-2xl border p-6 text-center"
		>
			<div class="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full">
				<Mail class="size-5" />
			</div>
			<div class="space-y-1">
				<p class="font-medium">Revisa tu bandeja</p>
				<p class="text-muted-foreground text-sm">
					El enlace caduca en 1 hora. Si no lo ves, revisa la carpeta de spam.
				</p>
			</div>
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

			<div class="flex flex-col gap-2">
				<Label for="password">Contraseña</Label>
				<Input
					id="password"
					name="password"
					type="password"
					autocomplete="new-password"
					required
					minlength={8}
					placeholder={`Mínimo ${MIN_PASSWORD_HINT} caracteres`}
				/>
			</div>

			{#if form?.error}
				<p class="text-destructive text-sm" role="alert">{form.error}</p>
			{/if}

			<Button type="submit" disabled={pending} class="w-full">
				{pending ? 'Creando cuenta…' : 'Crear cuenta'}
			</Button>

			<p class="text-muted-foreground text-center text-xs">
				Al crear tu cuenta aceptas los términos legales.
			</p>
		</form>
	{/if}

	{#snippet footer()}
		<p class="text-muted-foreground text-sm">
			¿Ya tienes cuenta?
			<a
				href="/app/login"
				class="text-foreground font-medium underline-offset-4 hover:underline"
			>
				Inicia sesión
			</a>
		</p>
	{/snippet}
</AuthShell>