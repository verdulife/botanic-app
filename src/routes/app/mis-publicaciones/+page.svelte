<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="COMM-06"
	title="Mis publicaciones"
	description="Publicaciones de comunidad creadas por el usuario."
	mvp={false}
	requiresAuth={true}
	placeholder="Aquí irán las publicaciones del usuario en la comunidad."
	primaryActions={[
		{ label: "Volver a comunidad", href: "/app/comunidad", variant: "outline" }
	]}
/>
