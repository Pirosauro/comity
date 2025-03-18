import type { Plugin } from 'vite';
import { normalize } from 'node:path';
import { fdir } from 'fdir';

type Options = {
  css?: string;
  path?: string;
  extension?: string;
  alias?: string;
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
    css: options.css?.replace(/\./g, '\\.'),
    alias: options.alias?.replace(/\/$/g, '') || '~/components',
  };

  const virtualModuleId = 'virtual:comity-islands';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;
  const cssPattern = config.css ? new RegExp(`${config.css}$`) : false;
  const extensionPattern = new RegExp(`${config.extension}$`);
  const importerPattern = new RegExp(
    `${normalize(config.path)}/(.*${config.extension})$`
  );

  // Scan the components directory
  const files = new fdir()
    .withRelativePaths()
    .withMaxDepth(10)
    .crawl(config.path)
    .sync();
  const styles = cssPattern
    ? files
        .filter((c) => cssPattern.test(c))
        .map((c) => `import('${config.alias}/${c}');`)
    : [];
  const components = files
    .filter((c) => extensionPattern.test(c))
    .map((c) => `'${c}': () => import('${config.alias}/${c}'),`);

  console.log(`\u001B[34m${styles.length} CSS files found\u001B[0m`);
  console.log(
    `\u001B[34m${components.length} hydratable components found\u001B[0m`
  );

  return {
    name: '@comity/vite-islands',

    /**
     * Resolve the virtual module
     *
     * This function resolves the module ID for the virtual islands module
     * and individual component files.
     *
     * @inheritdoc
     */
    async resolveId(id, importer) {
      if (id === virtualModuleId) {
        const file = importer?.match(importerPattern)?.at(1);

        return resolvedVirtualModuleId + `?filename=${file || ''}`;
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
      if (id.startsWith(resolvedVirtualModuleId)) {
        const filename = new URLSearchParams(
          id.substring(resolvedVirtualModuleId.length)
        ).get('filename');

        const code: string[] = [];

        // Styles
        if (styles.length > 0) {
          code.push(...styles);
        }

        // Components
        code.push('export const components = {');
        code.push(...components);
        code.push('};');

        // Current island filename
        if (filename) {
          code.push(`export const filename = '${filename}';`);
        }

        return code.join('\n');
      }
    },
  };
};
