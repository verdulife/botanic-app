<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="AUTH-01"
	title="Iniciar sesión"
	description="Formulario de acceso con email y contraseña. Soporte para OAuth más adelante."
	mvp={true}
	placeholder="Aquí irá el formulario de login (email + OAuth)."
	primaryActions={[
		{ label: "Crear cuenta", href: "/app/registro" },
		{ label: "Recuperar contraseña", href: "/app/recuperar-contrasena", variant: "outline" }
	]}
/>
