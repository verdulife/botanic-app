<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="WISH-02"
	title="Nuevo deseo"
	description="Formulario para crear un deseo: palabras clave, categoría, rango de precio, ubicación, estado."
	mvp={true}
	requiresAuth={true}
	placeholder="Aquí irá el formulario de creación de deseo con sus criterios."
	primaryActions={[
		{ label: "Volver a mis deseos", href: "/app/deseos", variant: "outline" }
	]}
/>
