import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'favicon.ico',
        'robots.txt',
        'apple-touch-icon.png',
      ],
      manifest: {
        name: 'Mélanjeux',
        short_name: 'Melanjeux',
        description:
            "Application pour gérer et réserver des salles d’escape game",
        theme_color: '#000000',
        background_color: '#DFE0E6',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'icons/melanjeux-icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/melanjeux-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/melanjeux-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
                url.origin === self.location.origin &&
                url.pathname.startsWith('/assets'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-assets',
            },
          },
          {
            urlPattern: ({ url }) =>
                url.origin === self.location.origin &&
                url.pathname.startsWith('/api'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
            },
          },
        ],
      },
    }),
  ],
});
