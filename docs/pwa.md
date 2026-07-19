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
        theme_color: '#22c55e',
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

## Desactivar SW nativo de SvelteKit

```ts
// svelte.config.js
const config = {
  kit: { serviceWorker: { register: false } }
};
```

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
bun add -D @vite-pwa/assets-generator
bunx pwa-assets-generator --preset minimal public/logo.svg
```

La app es instalable desde Safari (iOS) y Chrome (Android) sin App Store. iOS 16.4+ soporta Web Push.
