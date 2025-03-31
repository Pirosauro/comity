import type { Plugin } from 'vite';
import { resolve } from 'node:path';
import { fdir } from 'fdir';

type Options = {
  path?: string;
  extension?: string;
  aliases?: Record<string, string>;
};

/**
 * Vite plugin for handling island components
 *
 * This plugin scans the specified directory for island components and CSS files,
 * generates virtual modules that import these files, and exports them as an object.
 *
 * @param {Options} options - The plugin options.
 * @return {Plugin} - The Vite plugin object.
 */
export const comityIslands = (options: Options = {}): Plugin => {
  // Normalize configuration options
  const config = {
    path: options.path?.replace(/\/$/g, '') || './src/components',
    extension: options.extension?.replace(/\./g, '\\.') || '\\.island\\.tsx',
    aliases: options.aliases || {
      './src/components': '~/components',
    },
  };
  const virtualModuleId = 'virtual:comity-islands';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;
  const extensionPattern = new RegExp(`${config.extension}(\\?hash)?$`);

  const cache = {
    ssr: [] as string[],
    client: [] as string[],
    imports: [] as string[],
    names: {} as Record<string, string>,
  };

  /**
   * Resolve the alias for a given path
   *
   * This function checks if the path starts with any of the configured aliases
   * and replaces it with the corresponding replacement value.
   *
   * @param {string} path - The path to resolve
   * @return {string} - The resolved path
   */
  const resolveAlias = (path: string): string => {
    Object.entries(config.aliases).forEach(([alias, replacement]) => {
      const normalized = resolve(alias);

      if (path.startsWith(normalized)) {
        path = path
          .replace(normalized, replacement)
          .replace(/\.(ts|tsx)$/g, '.js');

        return;
      }
    });

    return path;
  };

  /**
   * Calculate a hash for a given string
   *
   * This function generates a hash for the given string using the DJB2 algorithm.
   *
   * @param {string} str - The string to hash
   * @return {string} - The generated hash
   */
  const hash = (str: string): string => {
    let h = 5381;
    let i = str.length;

    while (i) {
      h = (h * 33) ^ str.charCodeAt(--i);
    }

    return (h >>> 0).toString(36);
  };

  /**
   * Finds components in the specified directory
   *
   * This function scans the specified directory for files matching the
   * configured extension pattern and logs the number of hydratable
   * components found.
   *
   * @return {Promise<void>}
   */
  const buildCache = async (): Promise<void> => {
    const files = new fdir()
      .withFullPaths()
      .withMaxDepth(10)
      .crawl(resolve(config.path))
      .sync();

    cache.imports = files
      .filter((c) => extensionPattern.test(c))
      .map(
        (c) =>
          `${'export { default as C_' + hash(c)} } from ${JSON.stringify(
            resolveAlias(c).replace(/\.tsx$/, '.js')
          )};`
      );
    cache.names = Object.fromEntries(
      files.filter((c) => extensionPattern.test(c)).map((c) => [c, hash(c)])
    );

    console.log(
      `\u001B[34m${cache.ssr.length} hydratable components found\u001B[0m`
    );
  };

  return {
    name: '@comity/vite-islands',

    /**
     * Handle the build start event
     *
     * This function is called when the build starts and is used to
     * initialize the cache for the virtual module.
     *
     * @inheritdoc
     */
    async configResolved() {
      await buildCache();
    },

    /**
     * Resolve the virtual module
     *
     * This function resolves the module ID for the virtual islands module
     * and individual component files.
     *
     * @inheritdoc
     */
    async resolveId(id) {
      if (id.startsWith(virtualModuleId)) {
        return resolvedVirtualModuleId;
      }
    },

    /**
     * Load the virtual module
     *
     * This function loads the virtual islands module and generates the code
     * that imports individual component files and exports them as an object.
     *
     * @inheritdoc
     */
    async load(id) {
      // Handler for virtual:comity-islands
      if (id.startsWith(resolvedVirtualModuleId)) {
        const code = cache.imports; // id.endsWith('?client') ? cache.client : cache.ssr;

        return code.join('\n');
      }

      // Handle island imports
      if (extensionPattern.test(id) && id.endsWith('?hash')) {
        return `export default ${JSON.stringify(
          `${cache.names[id.replace('?hash', '')]}`
        )};`;
      }
    },

    /**
     * Handle the changes on relevant files
     *
     * This function is called when the server starts and is used to
     * watch for changes in the components directory and rebuild the cache.
     *
     * @inheritdoc
     */
    async configureServer(server) {
      server.watcher.on('all', async (file) => {
        // Check if the changed file is in the routes directory
        if (extensionPattern.test(file)) {
          await buildCache();
        }
      });
    },
  };
};
