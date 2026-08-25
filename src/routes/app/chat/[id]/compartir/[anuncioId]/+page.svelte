<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="CHAT-04"
	title="Compartir anuncio en chat"
	description="Compartir un anuncio dentro de una conversación."
	mvp={true}
	requiresAuth={true}
	placeholder="Aquí irá la previsualización del anuncio a compartir dentro de la conversación."
	primaryActions={[
		{ label: "Volver a la conversación", href: "/app/chat/1", variant: "outline" }
	]}
/>
