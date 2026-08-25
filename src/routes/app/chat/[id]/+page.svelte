<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="CHAT-02"
	title="Conversación"
	description="Hilo de mensajes entre dos usuarios."
	mvp={true}
	requiresAuth={true}
	placeholder="Aquí irán los mensajes de la conversación, con la posibilidad de compartir un anuncio."
	primaryActions={[
		{ label: "Compartir anuncio", href: "/app/chat/1/compartir/1" },
		{ label: "Volver a chat", href: "/app/chat", variant: "outline" }
	]}
/>
