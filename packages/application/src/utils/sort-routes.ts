import { ROUTE_PATTERN } from "../constants.js";

/**
 * Sorts an array of route paths according to routing priority rules.
 *
 * @remarks
 * This function implements a sophisticated sorting algorithm for file-based routing
 * that ensures routes are processed in the correct order. Routes are sorted by:
 *
 * 1. **Directory depth**: Deeper paths (longer directory chains) come first
 * 2. **Directory alphabetical order**: For same depth, alphabetical sorting
 * 3. **File priority within directories**: Special rules for dynamic routes and index files
 *
 * **Sorting Rules within Directories:**
 * - Files starting with `_` (private routes) come last
 * - Dynamic routes `[param]` come after static routes but before private routes
 * - Index files are treated as root routes (empty string)
 * - Longer filenames come before shorter ones (more specific routes first)
 * - Alphabetical sorting as final tiebreaker
 *
 * **Use Cases:**
 * - File-based routing systems where route order matters
 * - Ensuring specific routes are matched before catch-all routes
 * - Maintaining consistent route resolution across different file systems
 *
 * @param routes - Array of route file paths to sort
 * @returns Sorted array of route paths
 *
 * @example
 * Basic route sorting
 * ```typescript
 * const routes = [
 *   'api/users.ts',
 *   'index.ts',
 *   'api/users/[id].ts',
 *   'blog/posts.ts'
 * ];
 *
 * sortRoutes(routes);
 * // Returns: ['api/users/[id].ts', 'api/users.ts', 'blog/posts.ts', 'index.ts']
 * ```
 *
 * @example
 * Complex nested routes
 * ```typescript
 * const routes = [
 *   'api/v1/users/profile.get.ts',
 *   'api/v1/users.ts',
 *   'api/users.ts',
 *   '_middleware.ts'
 * ];
 *
 * sortRoutes(routes);
 * // Returns: ['api/v1/users/profile.get.ts', 'api/v1/users.ts', 'api/users.ts', '_middleware.ts']
 * ```
 *
 * @example
 * Dynamic vs static routes
 * ```typescript
 * const routes = [
 *   'users/[id].ts',      // Dynamic route
 *   'users/profile.ts',   // Static route
 *   'users/_private.ts'   // Private route
 * ];
 *
 * sortRoutes(routes);
 * // Returns: ['users/profile.ts', 'users/[id].ts', 'users/_private.ts']
 * ```
 */
export const sortRoutes = (routes: string[]): string[] => {
  const groups: Record<string, string[]> = {};

  // arrange files by folder
  routes.forEach((path) => {
    const parts = path.replace(/^\//, "").split("/");
    const filename = parts.pop();
    const directory = parts.length === 0 ? "/" : `/${parts.join("/")}/`;

    // init group
    if (!groups[directory]) {
      groups[directory] = [];
    }

    if (filename) {
      groups[directory].push(filename);
    }
  });

  // sort groups by length - longer paths first
  const index = Object.keys(groups).sort((a, b) => {
    if (a.length === b.length) {
      return a.localeCompare(b);
    }

    return b.length - a.length;
  });
  const result: string[] = [];
  const replacer = (_: string, p: string) => (p.slice(1) === "index" ? "" : p.slice(1));

  // sort files in each directory
  index.forEach((directory) => {
    result.push(
      ...groups[directory]!.sort((a, b) => {
        if (a[0] === "_" || (a[0] === "[" && b[0] !== "[")) {
          return 1;
        }

        if (a[0] !== "[" && b[0] === "[") {
          return -1;
        }

        const an = a.toLocaleLowerCase().replace(/^\/?/, "/").replace(ROUTE_PATTERN, replacer);
        const bn = b.toLocaleLowerCase().replace(/^\/?/, "/").replace(ROUTE_PATTERN, replacer);

        if (an.length === bn.length) {
          return an.localeCompare(bn);
        }

        return bn.length - an.length;
      }).map((s) => directory + s)
    );
  });

  return result;
};
