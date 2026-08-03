# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Plant lovers en España que quieren vender lo que les sobra y comprar cerca de casa:

- Aficionados con esquejes, semillas o excedente de sus plantas
- Coleccionistas de variedades específicas
- Personas que se mudan y necesitan dar salida a macetas y plantas
- Principiantes que buscan plantas baratas cerca de su zona

## Product Purpose

Botanic es la comunidad donde las plantas conocen a gente. Cualquiera publica semillas, esquejes, brotes, plantas o tiestos para vender, cambiar o regalar a gente de su zona. El éxito es que un **Plant Lovers** publique un anuncio en menos de un minuto y otro lo encuentre cerca. Modelo 100% gratuito en el MVP: los usuarios se pagan fuera de la plataforma (decisión de fase, no promesa de marca).

## Positioning

Única comunidad de España dedicada por completo al mundo vegetal, con lenguaje y categorías propias de plantas. Las plataformas generalistas (Wallapop, Vinted, Milanuncios) tratan las plantas como subcategoría; Botanic ofrece especialización vegetal + cercanía + comunidad de confianza, donde las plantas conocen a gente nueva.

## Operating Context

- Uso principal en móvil, como PWA instalable (SvelteKit)
- El intercambio se cierra "en mano": el comprador y el vendedor acuerdan un punto de encuentro en su zona
- Sin envíos en el MVP: la cercanía es parte de la propuesta
- Mapas Leaflet + OpenStreetMap para buscar por ubicación
- Comunicación comprador-vendedor vía chat en tiempo real

## Capabilities and Constraints

- Categorías: semilla, esqueje, planta, tiesto, accesorio
- Anuncio con nombre, descripción, precio, ubicación y 1-5 fotos
- Registro con email y Google OAuth; perfiles con valoraciones de 1 a 5 estrellas; favoritos
- Sin envíos, sin pagos integrados, sin comisiones en el MVP (decisiones de fase, no promesas de marca)
- Coste operativo objetivo: 0 €/mes
- Idioma del producto: español
- Stack: SvelteKit 5 + TypeScript + TailwindCSS 4 + shadcn-svelte + Supabase (Free) + Leaflet

## Brand Commitments

- Nombre: Botanic
- Tagline: "Donde las plantas conocen a gente"
- Identidad visual: canon de marketplace — fondo cálido de lino, tinta cálida casi negra, acento verde hoja saturado, estrellas ámbar, tipografía Onest, fotografía real de plantas; tokens en `src/app.css`
- Estilo por defecto: estándar de categoría ejecutado impecablemente (elegido en el flujo new-work, seed 77b83067); sin quirk ni sobre-decoración
- Tono: cercano y de comunidad **Plant Lovers**
- Terminología: lenguaje cercano de comunidad y economía circular ("conocer a gente nueva", "vender, cambiar o regalar", "segunda mano", "pluralidad") frente a "marketplace", que suena técnico y frío; "vender, cambiar o regalar" como tríada de acciones
- Restricción de copy: el copy de la landing no declara como promesas permanentes los "sin envíos", "sin comisiones", "solo cerca de ti", "queda en mano" ni "de tu barrio" — son decisiones del MVP, no verdades de marca, para no condicionar la monetización ni los cambios de rumbo

## Evidence on Hand

- Documentación de producto: `docs/concepto.md`, `docs/mercado.md`, `docs/monetizacion.md`, `docs/mvp-scope.md`, `docs/difusion.md`
- Análisis de mercado con datos secundarios (mercado second-hand +5.000M€/año, Wallapop +15M usuarios, 60% hogares con planta de interior)
- Dossier de prensa en `press/`
- Sin usuarios, testimonios, métricas ni capturas reales todavía: no fabricar cifras

## Product Principles

- La cercanía es el producto: sin logística integrada en el MVP (decisión revisable, no promesa de marca)
- Gratuito para crecer la comunidad antes de monetizar (decisión del MVP, revisable)
- Especialización total en el mundo vegetal frente a generalistas
- Confianza entre particulares: perfiles, valoraciones y chat directo
- Sencillez: publicar un anuncio en menos de un minuto
- Vocabulario de comunidad: las plantas se comparten para conocer a gente nueva
