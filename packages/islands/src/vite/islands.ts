import type { Plugin } from 'vite';
import { fdir } from 'fdir';

type Options = {
  framework: string;
  css?: boolean;
};

export const comityIslands = (options: Options): Plugin => {
  const virtualModuleId = 'virtual:comity-islands';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;
  //
  const components = new fdir()
    .withRelativePaths()
    .withMaxDepth(10)
    .crawl('./src/components')
    .sync();

  /**
   *
   *
   * @param {string} str
   * @return {string}
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
   * Convert kebab-case into PascalCase
   *
   * @param {string} s - The string to convert
   * @return {string}
   */
  const toPascalCase = (s: string): string =>
    s.replace(/(^\w|-\w)/g, (x: string) => x.replace(/-/, '').toUpperCase());

  return {
    name: '@comity/vite-islands',
    // enforce: 'post',

    resolveId(id) {
      if (id.includes(virtualModuleId)) {
        return '\0' + id;
      }
    },

    load(id) {
      if (id === resolvedVirtualModuleId) {
        const code: string[] = [];

        // css
        code.push(
          ...components
            .filter((c) => /\.(css)$/.test(c))
            .map((c) => `import('~/components/${c}');\n`)
        );

        // js
        code.push('export default {');
        code.push(
          ...components
            .filter((c) => /\.(tsx?|jsx?)$/.test(c))
            .map((c) => `'${hash(c)}': () => import('~/components/${c}'),\n`)
        );
        code.push('}');

        return code.join('\n');
      }
    },

    transform(code, id) {
      const file = id.match(/\/src\/components\/(.*\.island\.tsx)$/)?.at(1);

      if (typeof file === 'string') {
        const basename = file.split(/[\\/]/).pop() as string;
        const component = toPascalCase(basename?.replace('.island.tsx', ''));

        // add island properties
        code += `\nObject.defineProperty(${component}, 'name', { writable: false, value: '${hash(
          file
        )}' })`;
        code += `\nObject.defineProperty(${component}, 'framework', { writable: false, value: '${options.framework}' })`;

        return {
          code,
        };
      }
    },
  };
};
