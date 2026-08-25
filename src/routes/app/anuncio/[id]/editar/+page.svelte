<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="P2P-06"
	title="Editar anuncio"
	description="Formulario de edición de un anuncio propio."
	mvp={true}
	requiresAuth={true}
	placeholder="Aquí irá el formulario de edición (mismos campos que en publicar)."
	primaryActions={[
		{ label: "Cancelar", href: "/app/mis-anuncios", variant: "outline" },
		{ label: "Volver al detalle", href: "/app/anuncio/1", variant: "outline" }
	]}
/>
