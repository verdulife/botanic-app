# Product

<!-- impeccable:product-schema 1 -->

## Platform

web (PWA instalable; app nativa en fase 2)

## Users

Botanic está enfocado en **Plant Lovers** en España. Personas con huerta o huerto urbano también encajan en el público objetivo (misma motivación, ayuda al SEO).

- Aficionados con esquejes, semillas o excedente de sus plantas
- Coleccionistas de variedades específicas
- Personas que se mudan y necesitan dar salida a macetas y plantas
- Principiantes que buscan plantas baratas cerca de su zona

## Product Purpose

Botanic es la app donde las plantas conocen a gente. Plataforma de compra, venta, intercambio y regalo de plantas entre particulares. El éxito es que un **Plant Lovers** publique un anuncio en menos de un minuto y otro lo encuentre cerca.

Módulos adyacentes al particular-a-particular:

- **Deseos** — wishlist supervitaminada: dices qué plantas buscas y te avisamos cuando alguien las publique.
- **Comunidad** — *Próximamente*: preguntar, compartir consejos y aprender entre Plant Lovers.
- **El Market de Botanic** — *Próximamente*: profesionales y tiendas del sector en un solo catálogo.

## Problema y solución

### Problema

- Hoy es más fácil vender una chaqueta usada que un esqueje de Monstera.
- Las plataformas generalistas (Wallapop, Vinted, Milanuncios) tienen las plantas como subcategoría perdida entre muebles, ropa y electrónica.
- No hay filtros específicos para especies vegetales, no hay lenguaje común, no hay comunidad.
- Los intercambios ocurren en grupos de Facebook, foros o WhatsApp, de forma desorganizada.

### Solución

1. **Especialización** — Categorías pensadas para el mundo vegetal.
2. **Cercanía** — Búsqueda por ubicación.
3. **Comunidad** — Perfiles, valoraciones, reputación entre Plant Lovers.
4. **Sencillez** — Publicar un anuncio lleva menos de un minuto.

## Positioning

Única comunidad de España dedicada por completo al mundo vegetal, con lenguaje y categorías propias de plantas. Las plataformas generalistas (Wallapop, Vinted, Milanuncios) tratan las plantas como subcategoría; Botanic ofrece especialización vegetal + cercanía + comunidad de confianza.

Análisis comparativo con la competencia en [docs/mercado.md](docs/mercado.md).

## Operating Context

- Uso principal en móvil, como PWA instalable (SvelteKit)
- Mapas Leaflet + OpenStreetMap para buscar por ubicación
- Comunicación comprador-vendedor vía chat en tiempo real
- Idioma del producto: español
- Mercado objetivo: España (puede expandirse en fase 4)

## Capabilities and Constraints

### Categorías

- Semillas
- Esquejes
- Plantas
- Tiestos
- Accesorios

### Capabilities

- Anuncio con nombre, descripción, precio, ubicación y 1-5 fotos
- Registro con email y Google OAuth
- Perfiles con valoraciones de 1 a 5 estrellas
- Favoritos
- Chat en tiempo real (Supabase Realtime)
- Búsqueda y filtros por categoría, precio y ubicación
- Mapa de anuncios con Leaflet + OpenStreetMap
- Coste operativo objetivo: 0 €/mes

### Restricciones del MVP (decisiones de fase, no promesas de marca)

- Sin pagos integrados (los usuarios se pagan fuera)
- Sin envíos con etiquetas integradas
- Sin identificación por foto (IA)
- Sin live shopping

> Las decisiones anteriores son del MVP y pueden evolucionar. No se declaran como verdades de marca.

## Brand Commitments

- **Nombre**: Botanic
- **Tagline canónico**: "Donde las plantas conocen a gente"
- **Identidad visual**: canon de marketplace — fondo cálido de lino, tinta cálida casi negra, acento verde hoja saturado, estrellas ámbar, tipografía Onest, fotografía real de plantas; tokens en `src/app.css`. Autoridad global: [DESIGN.md](DESIGN.md).
- **Estilo por defecto**: estándar de categoría ejecutado impecablemente (elegido en el flujo new-work, seed 77b83067); sin quirk ni sobre-decoración.
- **Tono**: cercano y de comunidad **Plant Lovers**.
- **Terminología**: lenguaje cercano de comunidad y economía circular ("conocer a gente nueva", "vender, cambiar o regalar", "segunda mano") frente a anglicismos como "marketplace" (que suena técnico y frío); "vender, cambiar o regalar" como tríada de acciones.
- **Restricción de copy**: el copy no declara como promesas permanentes "sin envíos", "sin comisiones", "quedar en mano", "solo cerca de ti" ni "de tu barrio". Son decisiones del MVP, no verdades de marca, para no condicionar la monetización ni los cambios de rumbo.
- **Sustituciones inglés → español**: "waitlist" → "lista de espera"; "match" → "Deseos"; "marketplace profesional" → "El Market de Botanic"; "feedback" → "consejos"/"novedades"; "release/launch" → "lanzamiento"/"estreno"; "signup" → "apuntarse"/"registrarse".

## Evidence on Hand

- Documentación canónica: [PRODUCT.md](PRODUCT.md), [PLAN.md](PLAN.md), [DESIGN.md](DESIGN.md), [architecture.md](architecture.md)
- Análisis de mercado con datos secundarios en [docs/mercado.md](docs/mercado.md)
- Dossier de prensa en [press/](press/) — *pendiente de regeneración*
- Sin usuarios, testimonios, métricas ni capturas reales todavía: no fabricar cifras

## Product Principles

- Especialización total en el mundo vegetal frente a generalistas
- Confianza entre particulares: perfiles, valoraciones y chat directo
- Sencillez: publicar un anuncio en menos de un minuto
- Vocabulario de comunidad: las plantas se comparten para conocer a gente nueva

## User stories (ejemplos)

```
Como usuario quiero registrarme para acceder a la plataforma.
Como usuario quiero publicar un anuncio con fotos para vender mi planta.
Como usuario quiero buscar plantas cerca de mí para encontrar lo que necesito.
Como usuario quiero chatear con el vendedor para acordar la entrega.
Como usuario quiero valorar a otros para construir confianza.
Como usuario quiero guardar favoritos para volver después.
```