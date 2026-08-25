<script lang="ts">
	import RoutePlaceholder from "$lib/components/wireframe/RoutePlaceholder.svelte";
</script>

<RoutePlaceholder
	id="COMM-04"
	title="Hilo"
	description="Publicación raíz + respuestas (estilo Reddit)."
	mvp={true}
	placeholder="Aquí irá la publicación y todas sus respuestas."
	primaryActions={[
		{ label: "Responder", href: "/app/hilo/1/responder" },
		{ label: "Volver a comunidad", href: "/app/comunidad", variant: "outline" }
	]}
/>
