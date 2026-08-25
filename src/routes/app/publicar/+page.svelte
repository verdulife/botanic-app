<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="P2P-05"
	title="Publicar anuncio"
	description="Formulario para crear un anuncio nuevo (título, descripción, imágenes, precio, categoría, ubicación)."
	mvp={true}
	requiresAuth={true}
	placeholder="Aquí irá el formulario de creación de anuncio (1–5 fotos, título, descripción, precio, categoría, ubicación)."
	primaryActions={[
		{ label: "Volver al inicio", href: "/app", variant: "outline" },
		{ label: "Mis anuncios", href: "/app/mis-anuncios", variant: "outline" }
	]}
/>
