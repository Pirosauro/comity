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
export const comityIslands = (options: Options): Plugin => {
  // Normalize options
  options.path = options.path?.replace(/\/$/g, '') || './src/components';
  options.extension =
    options.extension?.replace(/\./g, '\\.') || '\\.island\\.tsx';
  options.css = options.css?.replace(/\./g, '\\.');
  options.alias = options.alias?.replace(/\/$/g, '') || '~/components';

  const virtualModuleId = 'virtual:comity-islands';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;
  const cssPattern = options.css ? new RegExp(`${options.css}$`) : false;
  const extensionPattern = new RegExp(`${options.extension}$`);
  const importerPattern = new RegExp(
    `${normalize(options.path)}/(.*${options.extension})$`
  );

  // Scan the components directory
  const files = new fdir()
    .withRelativePaths()
    .withMaxDepth(10)
    .crawl(options.path)
    .sync();
  const styles = cssPattern
    ? files
        .filter((c) => cssPattern.test(c))
        .map((c) => `import('${options.alias}/${c}');\n`)
    : [];
  const components = files
    .filter((c) => extensionPattern.test(c))
    .map((c) => `'${c}': () => import('${options.alias}/${c}'),\n`);

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

        return resolvedVirtualModuleId + `?filename=${file}`;
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
        code.push(`export const filename = '${filename}';`);

        return code.join('\n');
      }
    },
  };
};
