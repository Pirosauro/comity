import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import build from '@hono/vite-cloudflare-pages';
import devServer from '@hono/vite-dev-server';
import adapter from '@hono/vite-dev-server/cloudflare';
import { comityRoutes, comityIslands } from '@comity/islands/vite';

export default defineConfig(({ mode }) => {
  const alias = {
    '~': resolve(__dirname, './src'),
  };

  if (mode === 'client') {
    return {
      build: {
        rollupOptions: {
          input: ['./src/client.ts'],
          output: {
            entryFileNames: 'static/client.js',
            chunkFileNames: 'static/assets/[name]-[hash].js',
            assetFileNames: 'static/assets/[name].[ext]',
          },
        },
        emptyOutDir: true,
      },
      resolve: {
        alias,
      },
      plugins: [
        comityIslands({
          framework: 'hono',
        }),
      ],
    };
  }

  return {
    resolve: {
      alias,
    },
    plugins: [
      build({
        entry: 'src/index.ts',
      }),
      devServer({
        adapter,
        entry: 'src/index.ts',
      }),
      comityIslands({
        framework: 'hono',
      }),
      comityRoutes(),
    ],
  };
});
