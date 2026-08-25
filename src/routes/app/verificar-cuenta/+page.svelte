<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="AUTH-04"
	title="Verificación de cuenta"
	description="Pantalla de verificación por email o código."
	mvp={true}
	placeholder="Aquí irá la pantalla de verificación de cuenta."
	primaryActions={[
		{ label: "Volver a login", href: "/app/login", variant: "outline" }
	]}
/>
