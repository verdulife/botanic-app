<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="CHAT-01"
	title="Chat"
	description="Lista de conversaciones con otros usuarios."
	mvp={true}
	requiresAuth={true}
	placeholder="Aquí irán las conversaciones activas del usuario."
	primaryActions={[
		{ label: "Volver al inicio", href: "/app", variant: "outline" }
	]}
/>
