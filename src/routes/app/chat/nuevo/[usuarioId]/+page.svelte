<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="CHAT-03"
	title="Nueva conversación"
	description="Iniciar una conversación con otro usuario (típicamente desde un anuncio)."
	mvp={true}
	requiresAuth={true}
	placeholder="Aquí irá el primer mensaje para iniciar la conversación con el usuario."
	primaryActions={[
		{ label: "Volver al anuncio", href: "/app/anuncio/1", variant: "outline" }
	]}
/>
