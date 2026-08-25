<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="P2P-08"
	title="Guardados"
	description="Anuncios que el usuario ha guardado como favoritos."
	mvp={true}
	requiresAuth={true}
	placeholder="Aquí irán los anuncios guardados por el usuario."
	primaryActions={[
		{ label: "Volver al inicio", href: "/app", variant: "outline" }
	]}
/>
