import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

function apiVersionPlugin() {
  const versionData = {
    version: '2.5.0',
    app: 'Vida Real - Simulador Tropical',
    releaseDate: '08/11/2026',
    title: '🎉 Novidades da Versão!',
    features: [
      'Caderno de Receitas com IA',
      'Envio automático para a Lista de Compras',
      'Post-it de anotações com autosave',
      'Adesivos Washi Tape',
      'Alteração do Tempo/Clima',
      'Dicas do porquinho'
    ],
    timestamp: 1794132914000
  };

  const handler = (req: any, res: any, next: any) => {
    const rawUrl = req.url || '';
    const pathname = rawUrl.split('?')[0];
    if (pathname === '/api/version') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.end(JSON.stringify(versionData));
      return;
    }
    next();
  };

  return {
    name: 'api-version-plugin',
    configureServer(server: any) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server: any) {
      server.middlewares.use(handler);
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      apiVersionPlugin(),
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg'],
        manifest: {
          id: '/',
          name: 'Vida Real - Simulador Tropical',
          short_name: 'Vida Real',
          description: 'Simulador de vida brasileira interativo no estilo Tropic Modernism com gestão de carreira, Serasa Score, finanças, dilemas culturais e status vitais.',
          theme_color: '#087F48',
          background_color: '#ffffff',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
