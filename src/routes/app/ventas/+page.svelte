<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="P2P-10"
	title="Mis ventas"
	description="Placeholder de futuras ventas. Botanic no incluye pagos integrados en MVP."
	mvp={false}
	requiresAuth={true}
	placeholder="Aquí irán las ventas del usuario. En el MVP no hay pagos integrados, así que esto queda como ruta futura."
	primaryActions={[
		{ label: "Volver al inicio", href: "/app", variant: "outline" }
	]}
/>
