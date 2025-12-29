/**
 * Regular expression pattern for matching route file paths.
 *
 * @remarks
 * This pattern is used to parse route file names and extract HTTP methods and paths.
 * It supports the file-based routing convention where file names determine routes.
 *
 * **Pattern Breakdown:**
 * - `\/`: Leading slash (required)
 * - `(?:[^.]|\.(?=all$|delete$|get$|middleware$|patch$|post$|put$))*`: Path portion without invalid method extensions
 * - `(?:\.(all|delete|get|middleware|patch|post|put))?`: Optional HTTP method extension
 * - Case insensitive matching (`i` flag)
 *
 * **Supported File Extensions:**
 * - `.get.ts` → GET route
 * - `.post.ts` → POST route
 * - `.put.ts` → PUT route
 * - `.delete.ts` → DELETE route
 * - `.patch.ts` → PATCH route
 * - `.all.ts` → Catch-all route (any method)
 * - `.middleware.ts` → Middleware (no specific method)
 * - No extension → Defaults to `.all`
 *
 * @example
 * Matching route patterns
 * ```typescript
 * // These files match the pattern:
 * 'api/users.get.ts'     // → GET /api/users
 * 'api/users.post.ts'    // → POST /api/users
 * 'api/users.ts'         // → ALL /api/users (default)
 * 'middleware/auth.ts'   // → ALL /middleware/auth
 * ```
 */
export const ROUTE_PATTERN =
  /^\/(.*?)(?:\.(all|delete|get|middleware|patch|post|put))?$/i;
