<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="P2P-03"
	title="Mapa"
	description="Vista geográfica de anuncios cercanos. Aquí irá el mapa (Leaflet + OSM)."
	mvp={true}
	placeholder="Aquí irá el mapa de anuncios (Leaflet + OpenStreetMap)."
	primaryActions={[
		{ label: "Volver al inicio", href: "/app", variant: "outline" },
		{ label: "Ver en lista", href: "/app/buscar", variant: "outline" }
	]}
/>
