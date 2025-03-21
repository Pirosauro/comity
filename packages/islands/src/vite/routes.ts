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
 * This function scans the specified directory for route files, sorts them,
 * and returns an array of sorted route paths.
 *
 * @param {string} path - The path to scan for route files.
 * @return {string[]} - The sorted array of route paths.
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
 * This Vite plugin collects route files from the specified directory,
 * normalizes their paths, and generates a virtual module that exports
 * the routes as an object.
 *
 * @param {Options} options - The plugin options.
 * @return {Plugin} - The Vite plugin object.
 */
export const comityRoutes = (options?: Options): Plugin => {
  const virtualModuleId = 'virtual:comity-routes';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  const cwd = process.cwd();
  const path = options?.path || './src/views';
  let routes = getRoutes(path);

  console.log(`\u001B[34m${routes.length} routes found\u001B[0m`);

  return {
    name: '@comity/vite-routes',

    /**
     * Resolve module ID
     *
     * This function resolves the module ID for the virtual routes module
     * and individual route files.
     *
     * @inheritdoc
     */
    resolveId(id: string) {
      if (id.startsWith(virtualModuleId)) {
        const route = id.substring(virtualModuleId.length);

        // Resolve explicit route
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

    /**
     * Load module
     *
     * This function loads the virtual routes module and generates the code
     * that imports individual route files and exports them as an object.
     *
     * @inheritdoc
     */
    async load(id: string) {
      if (id === resolvedVirtualModuleId) {
        const code: string[] = [];

        // Add imports of single routes
        code.push(
          ...routes.map(
            (r, i) => `import r${i.toString(16)} from '${virtualModuleId}${r}'`
          )
        );

        // Add export of all mapped routes
        code.push('export const routes = {');
        code.push(
          ...routes.map((r, i) => `'${normalizePath(r)}': r${i.toString(16)},`)
        );
        code.push('};');

        return code.join('\n');
      }
    },

    /**
     * Configure server
     *
     * This function configures the Vite server to watch for changes in the
     * specified directory and updates the routes accordingly.
     *
     * @inheritdoc
     */
    configureServer(server) {
      server.watcher.on('all', (file) => {
        // Check if the changed file is in the routes directory
        if (file.startsWith(cwd)) {
          routes = getRoutes(path);

          console.log(`\u001B[34m${routes.length} routes found\u001B[0m`);
        }
      });
    },
  };
};
