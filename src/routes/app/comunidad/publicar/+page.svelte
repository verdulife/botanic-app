<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="COMM-03"
	title="Crear publicación"
	description="Formulario para crear una pregunta o aportación en la comunidad."
	mvp={true}
	requiresAuth={true}
	placeholder="Aquí irá el formulario de publicación (título, cuerpo, categoría)."
	primaryActions={[
		{ label: "Volver a comunidad", href: "/app/comunidad", variant: "outline" }
	]}
/>
