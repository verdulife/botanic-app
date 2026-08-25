<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="NOTIF-01"
	title="Notificaciones"
	description="Centro de notificaciones: coincidencias de deseos, mensajes de chat, actividad de comunidad."
	mvp={true}
	requiresAuth={true}
	placeholder="Aquí irán las notificaciones del usuario, con la posibilidad de abrir el recurso asociado."
	primaryActions={[
		{ label: "Volver al inicio", href: "/app", variant: "outline" }
	]}
/>
