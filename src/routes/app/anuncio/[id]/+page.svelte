<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="P2P-04"
	title="Detalle de anuncio"
	description="Vista de detalle de un anuncio concreto: imágenes, descripción, vendedor, precio, ubicación."
	mvp={true}
	placeholder="Aquí irá la galería de imágenes, descripción, info del vendedor y acciones (contactar, guardar)."
	primaryActions={[
		{ label: "Volver al inicio", href: "/app", variant: "outline" },
		{ label: "Contactar", href: "/app/chat/nuevo/1" },
		{ label: "Ver perfil del vendedor", href: "/app/perfil/1", variant: "outline" }
	]}
/>
