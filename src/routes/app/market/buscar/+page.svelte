<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="MARKET-03"
	title="Buscar productos profesionales"
	description="Búsqueda en el catálogo profesional de Botanic Market (futuro)."
	mvp={false}
	placeholder="Aquí irán los resultados de búsqueda de productos profesionales."
	primaryActions={[
		{ label: "Volver a Market", href: "/app/market", variant: "outline" }
	]}
/>
