<script lang="ts">
	import "../app.css";

	let { children } = $props();
</script>

<!--
	DIRECTION CONTRACT — Botanic landing (canon)
	THESIS: La landing es el estándar de categoría del marketplace de plantas ejecutado a pleno oficio: fotografía real, jerarquía limpia, un solo acento y cero quirk.
	OWN-WORLD: Fondo cálido de lino, tinta cálida casi negra, acento verde hoja saturado, estrellas ámbar; tipografía Onest; tarjetas fotográficas redondeadas y listados al estilo marketplace.
	STORY: Un Plant Lovers entiende en segundos qué es Botanic (comunidad donde las plantas conocen a gente nueva), por qué importa (vender, cambiar o regalar cerca de casa) y qué hacer (apuntarse a la waitlist).
	FIRST VIEWPORT: Nav sticky con el logo y el CTA; a la izquierda el titular grande, la promesa y el botón primario; a la derecha un panel con anuncios de ejemplo (fotos reales, precio, barrio, valoración) etiquetado como demo.
	FORM: Canon — estándar de categoría, la salida permanente del flujo new-work; seed 77b83067.
	FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
	STATUS: discharged 2026-07-31 — review degraded (no visión); tablas en DESIGN.md y en el veredicto al usuario.
-->

{@render children()}
