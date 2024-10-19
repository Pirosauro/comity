import type { Plugin } from "vite";
import { resolve } from "node:path";
import { fdir } from "fdir";

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
  const grouped: Record<string, string[]> = {};
  const result: string[] = [];
  const files = new fdir()
    .withRelativePaths()
    .withMaxDepth(10)
    .crawl(path)
    .sync();

  // organize files by folder
  for (let i = 0; i < files.length; i++) {
    const path = files[i];
    const parts = path.split("/");
    const file = parts.pop();
    const directory = parts.join("/");

    // init
    if (!grouped[directory]) {
      grouped[directory] = [];
    }

    if (file) {
      grouped[directory].push(file);
    }
  }

  // sort the files in each directory
  Object.entries(grouped)
    .sort(([a], [b]) => {
      // sort descending - longer paths first
      return b.length - a.length;
    })
    .forEach(([directory, file]) => {
      const sorted = file.sort(([a], [b]) => {
        if (a[0] === "[" && b[0] !== "[") {
          return 1;
        }

        if (a[0] !== "[" && b[0] === "[") {
          return -1;
        }

        return a.localeCompare(b);
      });

      result.push(...sorted.map((s) => (directory ? directory + "/" + s : s)));
    });

  return result;
};

/**
 *
 *
 * @param {string} str
 * @return {string}
 */
const getPath = (str: string): string => {
  const path = str.substring(0, str.lastIndexOf("."));

  // handling index
  if (path === "index") {
    return "";
  }

  return path.endsWith("/index") ? path.substring(0, path.length - 6) : path;
};

/**
 * Collect routes - Vite plugin
 *
 * @param {Options} options - The plugin options
 * @return {Plugin}
 */
export const comityRoutes = (options?: Options): Plugin => {
  const virtualModuleId = "virtual:comity-routes";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  const path = options?.path || "./src/views";
  const routes = getRoutes(path);

  console.log(`\u001B[34m${routes.length} routes found\u001B[0m`);

  return {
    name: "@comity/vite-routes",

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

        return "\0" + id;
      }
    },

    async load(id) {
      if (id === resolvedVirtualModuleId) {
        const code: string[] = [];

        code.push(
          ...routes.map(
            (r, i) => `import r${i.toString(16)} from '${virtualModuleId}/${r}'`
          )
        );
        code.push("export default {");
        code.push(
          ...routes.map(
            (r, i) => `'/${getPath(r).toLowerCase()}': r${i.toString(16)},`
          )
        );
        code.push("}");

        return code.join("\n");
      }
    },
  };
};
