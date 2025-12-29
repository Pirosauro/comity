import { ROUTE_PATTERN } from "../constants.js";

/**
 * Normalizes a file path to extract route path and HTTP method.
 *
 * @remarks
 * This function processes file-based routing paths to extract the URL path
 * and HTTP method from file names. It converts file naming conventions
 * into route definitions that can be used by the routing system.
 *
 * **Transformation Process:**
 * 1. Convert to lowercase for consistent processing
 * 2. Remove file extension
 * 3. Extract path and method using regex pattern
 * 4. Default method to 'all' if not specified
 *
 * **File Naming Convention:**
 * - `api/users.get.ts` → `api/users.get`
 * - `api/users.ts` → `api/users.all` (default)
 * - `middleware/auth.ts` → `middleware/auth.all`
 *
 * @param str - The file path string to normalize
 * @returns Normalized path with method (e.g., "api/users.get")
 *
 * @example
 * Basic path normalization
 * ```typescript
 * normalizePath('api/users.get.ts');     // → "api/users.get"
 * normalizePath('api/users.ts');         // → "api/users.all"
 * normalizePath('blog/posts.put.js');    // → "blog/posts.put"
 * ```
 *
 * @example
 * Index route handling
 * ```typescript
 * normalizePath('index.get.ts');         // → ".get"
 * normalizePath('api/index.ts');         // → "api/.all"
 * ```
 */
export const normalizePath = (str: string): string => {
  const replacer = (_: string, p: string, m: string) => {
    // normalize method, defaulting to 'all'
    return `/${p || "index"}.${m || "all"}`;
  };

  return str
    .toLocaleLowerCase() // lowercase
    .substring(0, str.lastIndexOf(".")) // remove extension
    .replace(/^\/?/, "/") // ensure leading slash for ROUTE_PATTERN matching
    .replace(ROUTE_PATTERN, replacer);
};
