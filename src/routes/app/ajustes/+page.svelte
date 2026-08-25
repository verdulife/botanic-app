<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="SET-01"
	title="Ajustes"
	description="Pantalla principal de ajustes. Acceso a cuenta, privacidad, ubicación y ayuda."
	mvp={true}
	requiresAuth={true}
	placeholder="Aquí irá la lista de secciones de ajustes."
	primaryActions={[
		{ label: "Cuenta", href: "/app/ajustes/cuenta", variant: "outline" },
		{ label: "Privacidad", href: "/app/ajustes/privacidad", variant: "outline" },
		{ label: "Ubicación", href: "/app/ajustes/ubicacion", variant: "outline" },
		{ label: "Ayuda", href: "/app/ajustes/ayuda", variant: "outline" }
	]}
/>
