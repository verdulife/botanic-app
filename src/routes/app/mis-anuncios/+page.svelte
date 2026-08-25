<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="P2P-07"
	title="Mis anuncios"
	description="Listado de anuncios publicados por el usuario."
	mvp={true}
	requiresAuth={true}
	placeholder="Aquí irán los anuncios del usuario autenticado con acciones (editar, eliminar, marcar como vendido)."
	primaryActions={[
		{ label: "Crear nuevo", href: "/app/publicar" },
		{ label: "Volver al inicio", href: "/app", variant: "outline" }
	]}
/>
