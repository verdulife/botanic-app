<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="P2P-01"
	title="Anuncios"
	description="Listado completo de anuncios (alias de inicio)."
	mvp={true}
	placeholder="Aquí irá el listado completo con filtros y orden."
	primaryActions={[
		{ label: "Volver al inicio", href: "/app", variant: "outline" },
		{ label: "Publicar anuncio", href: "/app/publicar" }
	]}
/>
