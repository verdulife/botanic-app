<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="WISH-03"
	title="Detalle de deseo"
	description="Información del deseo: criterios, estado, alertas y accesos a coincidencias."
	mvp={true}
	requiresAuth={true}
	placeholder="Aquí irá el detalle del deseo con sus criterios y métricas (coincidencias, última alerta)."
	primaryActions={[
		{ label: "Ver coincidencias", href: "/app/deseo/1/coincidencias" },
		{ label: "Configurar alerta", href: "/app/deseo/1/alerta", variant: "outline" },
		{ label: "Volver a mis deseos", href: "/app/deseos", variant: "outline" }
	]}
/>
