# Poster Botanic A3

Poster A3 vertical para captación de waitlist en viveros. Autónomo, fuera del proyecto web, no se publica en Vercel.

## Stack

- **HTML standalone** (`index.html`)
- **CSS plano** (`poster.css`) con tokens sincronizados con `DESIGN.md`
- **@page A3 nativo** de Chrome al imprimir (sin paged.js)
- **Onest Variable** vía Google Fonts
- **QR SVG vectorial** (`qr.svg`) con módulos Still Green sobre fondo lino

## Render a PDF A3

1. Desde la raíz del repo, ejecuta:
   ```bash
   bun run poster
   ```
   Esto arranca un servidor local en `http://localhost:4322` sirviendo la raíz del repo (para que `poster/` pueda referenciar `static/images/`).

2. Abre `http://localhost:4322/poster/` en **Chrome**.
3. `Cmd + P` (mac) o `Ctrl + P` (Windows/Linux).
4. En "Destino": selecciona "Guardar como PDF".
5. En "Tamaño": A3.
6. En "Márgenes": **Ninguno**.
7. Activa "Gráficos de fondo" (para que el lino, el QR y los bordes se impriman).
8. Guarda.

El resultado es un PDF A3 listo para imprenta.

> **¿Por qué un servidor local y no doble click en el HTML?** Chrome bloquea cargar recursos locales (CSS, imágenes) desde `file://` por CORS. Servir por HTTP local lo resuelve. `bunx serve` se cachea tras el primer uso.
>
> **¿Por qué no se usa paged.js?** Para una sola página A3 no hace falta: Chrome respeta `@page { size: A3; margin: 0 }` nativamente al imprimir. paged.js se diseñó para escenarios multi-página con encabezados/pies de página y maquetación compleja.

## Estructura

```
poster/
├── index.html           # el poster (semántico, un solo archivo)
├── poster.css          # tokens + @page A3 + estilos paged-media
├── qr.svg              # QR vectorial, color Still Green
├── regen-qr.mjs        # regenera el QR si cambia la URL (no requiere instalar nada)
└── README.md           # este archivo
```

## Regenerar el QR

Si cambia la URL de la waitlist:

```bash
bun poster/regen-qr.mjs
```

El script genera `qr.svg` con módulos `#1D3723` (still-900) sobre fondo `#F8F5EE` (linen-100). El QR mantiene contraste suficiente para escaneo fiable, dentro de la paleta de marca.

## Imagen hero

El poster referencia `../static/images/monstera.jpg` desde la raíz del repo. Si la imagen original no llega a la calidad de impresión, reemplazarla por una versión optimizada y actualizar la ruta.

## Diseño

- **On-brand** con `DESIGN.md`: Still Green como acento sobre fondo `tranquil-200` (acento complementario amarillo), Onest Variable como única familia.
- **Sin imagen hero**: el poster funciona solo con tipografía, color y QR. Más bold y cálido para captar atención desde el cristal del vivero.
- **Sin AI slop**: sin glassmorphism, sin degradados neón, sin serif decorativos, sin sombras flotantes.
- **Sin métricas inventadas**, sin testimonios, sin slogans vacíos.

Detalles de copy y composición en `docs/ideas.md` (item #11 — documentos para impresión).

## Auditoría

Pendiente de auditoría humana. El render propio se evalúa abriendo el PDF A3 exportado a tamaño real.