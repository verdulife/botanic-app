<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="SET-05"
	title="Ajustes · Ayuda"
	description="Preguntas frecuentes y contacto."
	mvp={false}
	placeholder="Aquí irá la pantalla de ayuda (FAQ, contacto, términos)."
	primaryActions={[
		{ label: "Volver a ajustes", href: "/app/ajustes", variant: "outline" }
	]}
/>
