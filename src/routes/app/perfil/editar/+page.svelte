<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="PROF-02"
	title="Editar perfil"
	description="Formulario de edición de datos del perfil."
	mvp={true}
	requiresAuth={true}
	placeholder="Aquí irá el formulario de edición de perfil (avatar, nombre, bio, ubicación)."
	primaryActions={[
		{ label: "Volver a mi perfil", href: "/app/perfil", variant: "outline" }
	]}
/>
