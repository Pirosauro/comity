import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { comityIslands, withComity } from '@comity/islands/vite';
import react from '@comity/react/vite';

export default defineConfig(({ mode }) => {
  const alias = {
    '~': resolve(__dirname, './src'),
  };

  return withComity({
    build: {
      rollupOptions: {
        input: ['./src/client.ts'],
        output: {
          entryFileNames: 'static/client.js',
          chunkFileNames: 'static/assets/[name]-[hash].js',
          assetFileNames: 'static/assets/[name].[ext]',
        },
      },
      emptyOutDir: false,
    },
    resolve: {
      alias,
    },
    plugins: [
      comityIslands({
        transpilers: {
          island: react,
        },
      }),
    ],
  });
});
