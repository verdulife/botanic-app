<script lang="ts">
	import { enhance } from '$app/forms';
	import { replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import AuthShell from '$lib/components/auth/AuthShell.svelte';
	import { KeyRound, Mail } from '@lucide/svelte/icons';

	let { form } = $props();

	let passwordPending = $state(false);
	let magicPending = $state(false);
	let magicSent = $derived(form?.mode === 'magic' && form?.sent === true);
	let passwordError = $derived(form?.mode === 'password' ? form?.error : undefined);
	let magicError = $derived(form?.mode === 'magic' && !form?.sent ? form?.error : undefined);
	// El callback manda aquí cuando el enlace del correo caducó o ya se usó. Deja de
	// mostrarse en cuanto se pide uno nuevo: el formulario reenvía a esta misma URL
	// y el aviso quedaría junto al «revisa tu bandeja», contradiciéndose.
	// El callback vuelve aquí con el motivo: `caducado` si el enlace ya no sirve,
	// `fallo` si no se pudo canjear por algo temporal. Deja de mostrarse en cuanto
	// se pide un enlace nuevo, porque el formulario reenvía a esta misma URL.
	let linkIssue = $derived(magicSent ? null : page.url.searchParams.get('enlace'));
</script>

<AuthShell
	title="Inicia sesión"
	subtitle="Entra con tu email y contraseña, o pide un enlace mágico."
>
	{#if linkIssue === 'caducado'}
		<div class="border-destructive/40 bg-destructive/5 rounded-2xl border p-4 text-sm" role="alert">
			<p class="font-medium">Ese enlace ya no sirve</p>
			<p class="text-muted-foreground mt-1">
				Los enlaces de acceso caducan y solo se pueden usar una vez. Pide uno nuevo más abajo, o
				entra con tu contraseña.
			</p>
		</div>
	{:else if linkIssue === 'fallo'}
		<div class="border-border bg-muted/40 rounded-2xl border p-4 text-sm" role="alert">
			<p class="font-medium">No hemos podido completar el acceso</p>
			<p class="text-muted-foreground mt-1">
				No ha sido culpa del enlace: inténtalo otra vez desde el mismo correo. Si vuelve a pasar, pide
				uno nuevo más abajo.
			</p>
		</div>
	{/if}

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
			<p class="text-muted-foreground text-sm">
				¿Todavía no tienes cuenta?
				<a href="/app/registro" class="text-foreground underline underline-offset-4">Crea una</a>
			</p>
		</div>
	{:else}
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
				return async ({ result, update }) => {
					await update();
					magicPending = false;
					// El motivo del fallo viaja en la URL del login. Si el envío salió bien
					// se quita solo ese parámetro —el `next` que trajo el correo se queda—,
					// para que el aviso no conviva con «revisa tu bandeja» ni reaparezca al
					// recargar.
					if (result.type === 'success' && page.url.searchParams.has('enlace')) {
						const clean = new URL(page.url.href);
						clean.searchParams.delete('enlace');
						replaceState(clean.href, page.state);
					}
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