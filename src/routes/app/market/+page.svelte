<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="MARKET-01"
	title="Botanic Market"
	description="Marketplace profesional de productos relacionados con plantas y huerto. Próximamente."
	mvp={false}
	placeholder="Aquí irá la landing de Botanic Market. Próximamente."
	primaryActions={[
		{ label: "Buscar productos", href: "/app/market/buscar", variant: "outline" },
		{ label: "Volver al inicio", href: "/app", variant: "outline" }
	]}
/>
