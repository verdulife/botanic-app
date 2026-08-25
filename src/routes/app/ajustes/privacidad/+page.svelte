<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="SET-03"
	title="Ajustes · Privacidad"
	description="Visibilidad del perfil, datos compartidos, descargas."
	mvp={false}
	requiresAuth={true}
	placeholder="Aquí irá la configuración de privacidad (visibilidad de perfil, datos compartidos)."
	primaryActions={[
		{ label: "Volver a ajustes", href: "/app/ajustes", variant: "outline" }
	]}
/>
