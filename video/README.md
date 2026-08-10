# video/ — Remotion (reels IG + TikTok y carruseles IG)

Carpeta **autónoma** con su propio `package.json` y `node_modules`. Fuera de workspaces y de la build de Vercel. `bun install` en la raíz no la toca.

## Setup

```sh
cd video
bun install
bun run browser     # descarga Chrome Headless Shell
```

## Uso

```sh
bun run studio                  # preview en tiempo real (http://localhost:3000)
bun run render:reel out/<slug>.mp4 --props=../src/lib/social/posts/<slug>/script.json
bun run still BotanicReel out/<slug>/cover.png --props=... --frame=0
```

El guion `script.json` (en `../src/lib/social/`) se pasa como `--props`. Detalle completo en [`docs/social-video.md`](../docs/social-video.md) y [`docs/social-post.md`](../docs/social-post.md).

## Estructura

```
video/
├── package.json              # autónomo
├── remotion.config.ts
├── templates/manifest.json   # catálogo de plantillas/estilos (para el agente)
└── src/
    ├── index.ts              # entry
    ├── Root.tsx              # registro de composiciones
    ├── BotanicReel.tsx       # script.json → composición 9:16
    ├── types.ts              # tipos del script.json
    ├── brand.ts              # tokens de marca
    ├── styles.ts             # energy | cozy | minimal
    └── components/
        ├── Logo.tsx
        └── scenes/           # Hook, Tip, Outro
```
