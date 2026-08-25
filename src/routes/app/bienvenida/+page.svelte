<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="AUTH-05"
	title="Bienvenida / onboarding"
	description="Onboarding inicial del usuario nuevo."
	mvp={true}
	placeholder="Aquí irá el flujo de bienvenida (selección de intereses, ubicación, etc.)."
	primaryActions={[
		{ label: "Entrar al inicio", href: "/app" }
	]}
/>
