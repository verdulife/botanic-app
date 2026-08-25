<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="COMM-01"
	title="Comunidad"
	description="Feed de preguntas y respuestas de la comunidad de Botanic (estilo Reddit)."
	mvp={true}
	placeholder="Aquí irán las publicaciones de la comunidad, ordenadas por recientes o populares."
	primaryActions={[
		{ label: "Crear publicación", href: "/app/comunidad/publicar" },
		{ label: "Mis publicaciones", href: "/app/mis-publicaciones", variant: "outline" }
	]}
/>
