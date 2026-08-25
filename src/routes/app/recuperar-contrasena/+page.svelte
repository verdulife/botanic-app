<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="AUTH-03"
	title="Recuperar contraseña"
	description="Formulario de recuperación por email."
	mvp={true}
	placeholder="Aquí irá el formulario de recuperación de contraseña."
	primaryActions={[
		{ label: "Volver a login", href: "/app/login", variant: "outline" }
	]}
/>
