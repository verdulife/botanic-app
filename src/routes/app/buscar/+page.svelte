<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="P2P-02"
	title="Buscar"
	description="Resultados de búsqueda por texto + filtros (categoría, precio, ubicación)."
	mvp={true}
	placeholder="Aquí irán los resultados de búsqueda con filtros."
	primaryActions={[
		{ label: "Ver en mapa", href: "/app/mapa", variant: "outline" },
		{ label: "Volver al inicio", href: "/app" }
	]}
/>
