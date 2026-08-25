<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="SET-02"
	title="Ajustes · Cuenta"
	description="Email, contraseña, sesiones, eliminación de cuenta."
	mvp={false}
	requiresAuth={true}
	placeholder="Aquí irá la gestión de cuenta (cambio de email, contraseña, sesiones activas)."
	primaryActions={[
		{ label: "Volver a ajustes", href: "/app/ajustes", variant: "outline" }
	]}
/>
