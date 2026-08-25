<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="WISH-04"
	title="Coincidencias"
	description="Anuncios que encajan con los criterios del deseo."
	mvp={true}
	requiresAuth={true}
	placeholder="Aquí irán los anuncios coincidentes con el deseo. El motor de matching se simula con contenido de ejemplo."
	primaryActions={[
		{ label: "Configurar alerta", href: "/app/deseo/1/alerta", variant: "outline" },
		{ label: "Volver al deseo", href: "/app/deseo/1", variant: "outline" }
	]}
/>
