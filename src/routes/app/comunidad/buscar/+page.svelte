<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="COMM-02"
	title="Buscar en comunidad"
	description="Búsqueda dentro de la comunidad (no MVP)."
	mvp={false}
	placeholder="Aquí irán los resultados de búsqueda en comunidad. No es MVP."
	primaryActions={[
		{ label: "Volver a comunidad", href: "/app/comunidad", variant: "outline" }
	]}
/>
