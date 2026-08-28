<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import AuthShell from '$lib/components/auth/AuthShell.svelte';
	import { KeyRound, Mail, Sprout } from 'lucide-svelte/icons';

	let { form } = $props();

	let passwordPending = $state(false);
	let magicPending = $state(false);
	let demoPending = $state(false);
	let magicSent = $derived(form?.mode === 'magic' && form?.sent === true);
	let passwordError = $derived(form?.mode === 'password' ? form?.error : undefined);
	let magicError = $derived(form?.mode === 'magic' && !form?.sent ? form?.error : undefined);
</script>

<AuthShell
	title="Inicia sesión"
	subtitle="Prueba la cuenta demo o entra con tu email y contraseña."
>
	{#if magicSent}
		<div
			class="bg-card text-card-foreground flex flex-col items-center gap-3 rounded-2xl border p-6 text-center"
		>
			<div class="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full">
				<Mail class="size-5" />
			</div>
			<div class="space-y-1">
				<p class="font-medium">Revisa tu bandeja</p>
				<p class="text-muted-foreground text-sm">
					Si {form?.email} existe, te hemos enviado un enlace mágico. Abre el enlace para iniciar
					sesión.
				</p>
			</div>
			<a
				href="/app/login"
				class="text-muted-foreground hover:text-foreground mt-2 text-sm underline-offset-4 hover:underline"
			>
				Volver al inicio de sesión
			</a>
		</div>
	{:else}
		<form
			method="POST"
			action="?/demo"
			use:enhance={() => {
				demoPending = true;
				return async ({ update }) => {
					await update();
					demoPending = false;
				};
			}}
			class="flex flex-col gap-2"
		>
			<Button type="submit" variant="outline" disabled={demoPending} class="w-full">
				<Sprout class="size-4" />
				{demoPending ? 'Entrando como demo…' : 'Entrar con cuenta demo'}
			</Button>
			<p class="text-muted-foreground text-center text-xs">
				Modo demo: sin registro ni email. Entras como Ana Ruiz.
			</p>
		</form>

		<div class="relative my-6 flex items-center" aria-hidden="true">
			<div class="border-border w-full border-t"></div>
			<span class="text-muted-foreground bg-background absolute px-3 text-xs uppercase">o</span>
		</div>

		<form
			method="POST"
			action="?/password"
			use:enhance={() => {
				passwordPending = true;
				return async ({ update }) => {
					await update();
					passwordPending = false;
				};
			}}
			class="flex flex-col gap-4"
		>
			<div class="flex flex-col gap-2">
				<Label for="email-password">Email</Label>
				<Input
					id="email-password"
					name="email"
					type="email"
					autocomplete="email"
					required
					value={form?.email ?? ''}
					placeholder="tu@email.com"
				/>
			</div>

			<div class="flex flex-col gap-2">
				<div class="flex items-center justify-between">
					<Label for="password">Contraseña</Label>
					<a
						href="/app/recuperar-contrasena"
						class="text-muted-foreground hover:text-foreground text-xs underline-offset-4 hover:underline"
					>
						¿Olvidaste?
					</a>
				</div>
				<Input
					id="password"
					name="password"
					type="password"
					autocomplete="current-password"
					required
					minlength={8}
					placeholder="••••••••"
				/>
			</div>

			{#if passwordError}
				<p class="text-destructive text-sm" role="alert">{passwordError}</p>
			{/if}

			<Button type="submit" disabled={passwordPending} class="w-full">
				<KeyRound class="size-4" />
				{passwordPending ? 'Entrando…' : 'Entrar'}
			</Button>
		</form>

		<div class="relative my-6 flex items-center" aria-hidden="true">
			<div class="border-border w-full border-t"></div>
			<span class="text-muted-foreground bg-background absolute px-3 text-xs uppercase">o</span>
		</div>

		<form
			method="POST"
			action="?/magic"
			use:enhance={() => {
				magicPending = true;
				return async ({ update }) => {
					await update();
					magicPending = false;
				};
			}}
			class="flex flex-col gap-4"
		>
			<div class="flex flex-col gap-2">
				<Label for="email-magic">Email</Label>
				<Input
					id="email-magic"
					name="email"
					type="email"
					autocomplete="email"
					required
					value={form?.email ?? ''}
					placeholder="tu@email.com"
				/>
			</div>

			{#if magicError}
				<p class="text-destructive text-sm" role="alert">{magicError}</p>
			{/if}

			<Button type="submit" variant="outline" disabled={magicPending} class="w-full">
				<Mail class="size-4" />
				{magicPending ? 'Enviando…' : 'Enviar enlace mágico'}
			</Button>
		</form>
	{/if}

	{#snippet footer()}
		<p class="text-muted-foreground text-sm">
			¿No tienes cuenta?
			<a
				href="/app/registro"
				class="text-foreground font-medium underline-offset-4 hover:underline"
			>
				Crea una
			</a>
		</p>
	{/snippet}
</AuthShell>