import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import build from '@hono/vite-cloudflare-pages';
import devServer from '@hono/vite-dev-server';
import adapter from '@hono/vite-dev-server/cloudflare';
import { comityRoutes, comityIslands, withComity } from '@comity/islands/vite';
import hono from '@comity/islands/vite';

export default defineConfig(({ mode }) => {
  const alias = {
    '~': resolve(__dirname, './src'),
  };

  return withComity({
    build: {
      emptyOutDir: true,
    },
    ssr: {
      external: [],
    },
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
        injectClientScript: false,
      }),
      comityIslands({
        transpilers: {},
      }),
      comityRoutes(),
    ],
  });
});
