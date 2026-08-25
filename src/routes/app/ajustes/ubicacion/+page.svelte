<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="SET-04"
	title="Ajustes · Ubicación"
	description="Gestión del permiso y la ubicación del usuario."
	mvp={true}
	requiresAuth={true}
	placeholder="Aquí irá la configuración de ubicación (conceder/rechazar permiso, radio de búsqueda)."
	primaryActions={[
		{ label: "Volver a ajustes", href: "/app/ajustes", variant: "outline" }
	]}
/>
