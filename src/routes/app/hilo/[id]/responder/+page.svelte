<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="COMM-05"
	title="Responder"
	description="Formulario de respuesta a un hilo de comunidad."
	mvp={true}
	requiresAuth={true}
	placeholder="Aquí irá el formulario de respuesta (cuerpo)."
	primaryActions={[
		{ label: "Volver al hilo", href: "/app/hilo/1", variant: "outline" }
	]}
/>
