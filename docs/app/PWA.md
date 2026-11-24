# PWA

## Plugin

`@vite-pwa/sveltekit` — zero-config para SvelteKit.

## Configuración

```ts
// vite.config.ts
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
  plugins: [
    sveltekit(),
    SvelteKitPWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Botanic',
        short_name: 'Botanic',
        description: 'Compra y vende plantas entre particulares',
        theme_color: '#74AA7B',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,txt}']
      }
    })
  ]
});
```

## Service worker nativo de SvelteKit

SvelteKit solo registra su propio service worker si existe `src/service-worker.js`. Aquí no existe: el único service worker es el que genera `@vite-pwa/sveltekit`, así que no hay que desactivar nada. Si algún día se añade, se desactiva en las opciones del plugin `sveltekit()` de `vite.config.ts`.

## Layout

```svelte
<script>
  import { pwaInfo } from 'virtual:pwa-info';
  import { onMount } from 'svelte';
  let webManifestLink = $derived(pwaInfo?.webManifest.linkTag ?? '');
  onMount(async () => {
    if (pwaInfo) {
      const { registerSW } = await import('virtual:pwa-register');
      registerSW({ immediate: true });
    }
  });
</script>
<svelte:head>{@html webManifestLink}</svelte:head>
```

## Iconos

```bash
pnpm add -D @vite-pwa/assets-generator
bunx pwa-assets-generator --preset minimal public/logo.svg
```

La app es instalable desde Safari (iOS) y Chrome (Android) sin App Store. iOS 16.4+ soporta Web Push.
