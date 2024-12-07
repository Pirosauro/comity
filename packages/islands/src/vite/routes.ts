import type { Plugin } from 'vite';
import { resolve } from 'node:path';
import { fdir } from 'fdir';
import { normalizePath, sortRoutes } from './utils.js';

type Options = {
  path?: string;
};

/**
 * Retrieve and arrange routes
 *
 * @param {string} path - The path to scan
 * @return {string[]}
 */
export const getRoutes = (path: string): string[] => {
  const files = new fdir()
    .withRelativePaths()
    .withMaxDepth(10)
    .crawl(path)
    .sync();

  return sortRoutes(files);
};

/**
 * Collect routes - Vite plugin
 *
 * @param {Options} options - The plugin options
 * @return {Plugin}
 */
export const comityRoutes = (options?: Options): Plugin => {
  const virtualModuleId = 'virtual:comity-routes';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  const path = options?.path || './src/views';
  const routes = getRoutes(path);

  console.log(`\u001B[34m${routes.length} routes found\u001B[0m`);

  return {
    name: '@comity/vite-routes',

    resolveId(id) {
      if (id.startsWith(virtualModuleId)) {
        const route = id.substring(virtualModuleId.length);

        // resolve esplicit route
        if (route) {
          return {
            id: resolve(path + route),
            external: false,
            moduleSideEffects: true,
          };
        }

        return '\0' + id;
      }
    },

    async load(id) {
      if (id === resolvedVirtualModuleId) {
        const code: string[] = [];

        code.push(
          ...routes.map(
            (r, i) => `import r${i.toString(16)} from '${virtualModuleId}${r}'`
          )
        );
        code.push('export default {');
        code.push(
          ...routes.map((r, i) => `'${normalizePath(r)}': r${i.toString(16)},`)
        );
        code.push('}');

        return code.join('\n');
      }
    },
  };
};
