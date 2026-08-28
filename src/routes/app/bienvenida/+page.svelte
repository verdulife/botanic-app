<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Sprout } from 'lucide-svelte/icons';

	let { data, form } = $props();

	let profile = $derived(data.profile);
	let firstName = $derived(
		profile?.full_name?.trim()?.split(' ')[0] ||
			profile?.username?.replace(/^mock_/, '') ||
			''
	);
	let initial = $derived(
		(profile?.full_name?.trim()?.[0] ?? profile?.username?.[0] ?? '?').toUpperCase()
	);

	let pending = $state(false);
</script>

<svelte:head>
	<title>Bienvenida · Botanic</title>
</svelte:head>

<div class="bg-background flex min-h-dvh flex-col items-center justify-center px-4 pt-8 pb-28 sm:px-6 sm:pb-32">
	<div class="w-full max-w-md">
		<div class="mb-8 flex flex-col items-center gap-3 text-center">
			<div
				class="bg-primary/10 text-primary flex size-14 items-center justify-center rounded-2xl"
			>
				<Sprout class="size-7" />
			</div>
			<h1 class="text-3xl font-medium tracking-tight">
				¡Hola{firstName ? `, ${firstName}` : ''}!
			</h1>
			<p class="text-muted-foreground text-sm">
				Bienvenido/a a Botanic. Cuéntanos un poco sobre ti para empezar.
			</p>
		</div>

		<div
			class="bg-card text-card-foreground rounded-2xl border p-6 shadow-sm"
		>
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
				<input type="hidden" name="intent" value="save" />

				<div class="flex items-center gap-3 pb-2">
					{#if profile?.avatar_url}
						<img
							src={profile.avatar_url}
							alt=""
							class="size-12 rounded-full object-cover"
						/>
					{:else}
						<div
							class="bg-primary/15 text-primary flex size-12 items-center justify-center rounded-full text-lg font-medium"
						>
							{initial}
						</div>
					{/if}
					<div class="text-muted-foreground text-xs">
						Tu avatar se genera con tu nombre. Podrás cambiarlo más tarde.
					</div>
				</div>

				<div class="flex flex-col gap-2">
					<Label for="username">Nombre de usuario</Label>
					<Input
						id="username"
						name="username"
						type="text"
						autocomplete="username"
						value={form?.values?.username ?? profile?.username ?? ''}
						placeholder="ej. ana_ruiz"
						minlength={3}
						maxlength={20}
					/>
					<p class="text-muted-foreground text-xs">
						3-20 caracteres. Letras minúsculas, números y guiones bajos. Será tu
						identificador único en Botanic.
					</p>
				</div>

				<div class="flex flex-col gap-2">
					<Label for="full_name">Nombre</Label>
					<Input
						id="full_name"
						name="full_name"
						type="text"
						autocomplete="name"
						value={form?.values?.full_name ?? profile?.full_name ?? ''}
						placeholder="Tu nombre completo"
						maxlength={80}
					/>
				</div>

				<div class="flex flex-col gap-2">
					<Label for="location_label">Ciudad o barrio</Label>
					<Input
						id="location_label"
						name="location_label"
						type="text"
						autocomplete="address-level2"
						value={form?.values?.location_label ?? profile?.location_label ?? ''}
						placeholder="ej. Madrid, Malasaña"
						maxlength={120}
					/>
				</div>

				<div class="flex flex-col gap-2">
					<Label for="bio">Bio (opcional)</Label>
					<textarea
						id="bio"
						name="bio"
						class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-20 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						maxlength={280}
						placeholder="Cuéntanos qué plantas te interesan…"
						value={form?.values?.bio ?? profile?.bio ?? ''}
					></textarea>
				</div>

				{#if form?.error}
					<p class="text-destructive text-sm" role="alert">{form.error}</p>
				{/if}

				<Button type="submit" disabled={pending} class="w-full">
					{pending ? 'Guardando…' : 'Guardar y empezar'}
				</Button>

				<button
					type="submit"
					name="intent"
					value="skip"
					formnovalidate
					class="text-muted-foreground hover:text-foreground text-center text-sm underline-offset-4 hover:underline"
					disabled={pending}
				>
					Omitir por ahora
				</button>
			</form>
		</div>

		<p class="text-muted-foreground mt-6 text-center text-xs">
			Podrás cambiar todo esto desde Ajustes cuando quieras.
		</p>
	</div>
</div>