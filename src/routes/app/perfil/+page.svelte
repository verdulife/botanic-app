<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="PROF-01"
	title="Mi perfil"
	description="Perfil del usuario autenticado: avatar, nombre, ubicación, anuncios activos."
	mvp={true}
	requiresAuth={true}
	placeholder="Aquí irá el perfil del usuario autenticado."
	primaryActions={[
		{ label: "Editar perfil", href: "/app/perfil/editar" },
		{ label: "Ajustes", href: "/app/ajustes", variant: "outline" }
	]}
/>
