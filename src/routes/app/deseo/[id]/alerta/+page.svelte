<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="WISH-05"
	title="Configurar alerta"
	description="Activar/desactivar la alerta del deseo, elegir canales y frecuencia."
	mvp={true}
	requiresAuth={true}
	placeholder="Aquí irá la configuración de alerta (on/off, canal, frecuencia)."
	primaryActions={[
		{ label: "Volver al deseo", href: "/app/deseo/1", variant: "outline" }
	]}
/>
