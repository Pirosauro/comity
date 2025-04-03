import type { Plugin } from 'vite';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { hash } from '../hash.js';

export type Transpiler = (
  hash: string,
  source: string,
  name: string
) => Promise<string>;

type Options = {
  /**
   * The transpiler functions to use for processing the island components.
   * @default undefined
   */
  transpilers: Record<string, Transpiler>;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Vite plugin for handling island components
 *
 * This plugin scans the specified directory for island components and CSS files,
 * generates virtual modules that import these files, and exports them as an object.
 *
 * @param {Options} options - The plugin options.
 * @return {Plugin} - The Vite plugin object.
 */
export const comityIslands = (options: Options): Plugin => {
  const virtualModuleId = 'virtual:comity-islands';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;
  //
  const index: Record<string, string> = {};
  let cwd: string;

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
    const code = [
      'export default {',
      ...Object.entries(index).map(
        ([path, hash]) =>
          `${JSON.stringify(hash)}: () => import(${JSON.stringify(path)}),`
      ),
      '};',
    ].join('\n');

    await writeFile(join(cwd, '.comity', 'index.js'), code, 'utf-8');
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
    async configResolved({ root, build }) {
      cwd = root;

      if (build.ssr) {
        try {
          await rm(join(root, '.comity'), { recursive: true });
        } catch (e) {
          // Ignore error if the directory does not exist
        }

        await mkdir(join(root, '.comity'), { recursive: true });
      }
    },

    /**
     * Resolve the virtual module
     *
     * This function resolves the module ID for the virtual islands module
     * and individual component files.
     *
     * @inheritdoc
     */
    async resolveId(id, importer) {
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
      if (id === resolvedVirtualModuleId) {
        //
        const code = await readFile(join(cwd, '.comity', 'index.js'), 'utf-8');

        return code;
      }

      if (id.includes('?')) {
        const { pathname, searchParams } = new URL(id, 'file://');
        const key = Object.keys(options.transpilers).find((key) =>
          searchParams.has(key)
        );

        if (key) {
          const name = searchParams.get(key) || 'default';
          const code = await options.transpilers[key](
            hash(pathname),
            pathname,
            name
          );

          // Store the hash in the index
          if (!index[pathname]) {
            index[pathname] = hash(pathname);

            console.log('GENERATE CACHE', index);

            await buildCache();
          }

          return code;
        }
      }
    },
  };
};
