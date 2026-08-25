<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="PROF-03"
	title="Perfil público"
	description="Perfil visible para otros usuarios. Accesible desde un anuncio o un chat."
	mvp={true}
	placeholder="Aquí irá el perfil público del usuario con sus anuncios activos."
	primaryActions={[
		{ label: "Iniciar conversación", href: "/app/chat/nuevo/1" },
		{ label: "Volver atrás", href: "/app", variant: "outline" }
	]}
/>
