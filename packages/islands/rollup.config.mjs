import { defineConfig } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default defineConfig({
  input: 'dist/cli.js',
  output: {
    file: 'dist/cli.bundle.js',
    format: 'esm',
    // banner: '#!/usr/bin/env node',
  },
  external: ['vite'],
  plugins: [resolve(), commonjs()],
});
