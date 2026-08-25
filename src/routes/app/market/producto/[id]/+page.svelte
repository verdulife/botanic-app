<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="MARKET-02"
	title="Producto profesional"
	description="Detalle de un producto del Botanic Market (futuro)."
	mvp={false}
	placeholder="Aquí irá la ficha del producto profesional (catálogo)."
	primaryActions={[
		{ label: "Volver a Market", href: "/app/market", variant: "outline" }
	]}
/>
