<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="AUTH-02"
	title="Registro"
	description="Formulario de alta de cuenta nueva. Email + Google OAuth."
	mvp={true}
	placeholder="Aquí irá el formulario de registro."
	primaryActions={[
		{ label: "Ya tengo cuenta", href: "/app/login", variant: "outline" }
	]}
/>
