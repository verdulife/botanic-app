<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="WISH-01"
	title="Mis deseos"
	description="Lista de deseos activos del usuario. Cada deseo define criterios y puede activar una alerta."
	mvp={true}
	requiresAuth={true}
	placeholder="Aquí irán los deseos del usuario con sus criterios y estado (activo / en pausa)."
	primaryActions={[
		{ label: "Crear deseo", href: "/app/deseos/nuevo" }
	]}
/>
