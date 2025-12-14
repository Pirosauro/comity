import type { UserConfig } from "vite";
import { normalize, resolve } from "node:path";
import { existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, sep } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Configuration options for the withComity Vite plugin.
 *
 * @remarks
 * Currently unused but reserved for future configuration options
 * such as custom override directories, alias patterns, or resolver behavior.
 *
 * @example
 * Basic usage (no options needed)
 * ```typescript
 * import { defineConfig } from 'vite';
 * import { withComity } from '@comity/application/vite';
 *
 * export default defineConfig({
 *   ...withComity({})
 * });
 * ```
 */
export type ComityViteOptions = {
  /** List of package names allowed to be overridden */
  allowedOverrides?: string[];

  /** Base folder for resolution, defaults to "./src" */
  baseFolder?: string;
};

/**
 * Creates a Vite configuration with Comity-specific alias resolution.
 *
 * @remarks
 * Configures Vite to check for local overrides in `src/overrides/` directory
 * before resolving package imports, allowing selective package replacement.
 *
 * **Override Resolution:**
 * - Searches for local files in `src/overrides/` matching package names
 * - Falls back to normal package resolution if no override exists
 * - Enables development-time package replacement without npm linking
 *
 * **Alias Pattern:**
 * Matches valid npm package names (scoped and unscoped) with optional subpaths.
 * Examples: `@scope/package`, `package-name`, `@scope/package/subpath`
 *
 * **Security Considerations:**
 * - Only resolves to actual files (not directories)
 * - Gracefully handles filesystem errors
 * - Controlled by Vite's build process (safe from user input)
 *
 * @param options - Configuration options (currently unused, reserved for future use)
 * @returns Vite configuration object with custom alias resolver
 *
 * @example
 * Basic Vite configuration with Comity
 * ```typescript
 * import { defineConfig } from 'vite';
 * import { withComity } from '@comity/application/vite';
 *
 * export default defineConfig({
 *   ...withComity({}),
 *   // Your other Vite config
 *   server: {
 *     port: 3000
 *   }
 * });
 * ```
 *
 * @example
 * Using with custom Vite plugins
 * ```typescript
 * import { defineConfig } from 'vite';
 * import react from '@vitejs/plugin-react';
 * import { withComity } from '@comity/application/vite';
 *
 * export default defineConfig({
 *   plugins: [
 *     react(),
 *   ],
 *   ...withComity({}),
 * });
 * ```
 *
 * @example
 * Override directory structure
 * ```
 * src/
 *   overrides/
 *     @comity/
 *       auth/
 *         index.ts    // Overrides @comity/auth
 *     lodash/
 *       index.js     // Overrides lodash
 * ```
 */
export function withComity(
  options: ComityViteOptions
): Promise<UserConfig> | UserConfig {
  const cwd = normalize(__dirname || process.cwd());
  const root = resolve(cwd, options.baseFolder || "./src");

  // Path traversal protection
  if (!root.startsWith(cwd + sep)) {
    throw new Error(
      "Path Traversal detected: 'baseFolder' must resolve within the current working directory."
    );
  }

  /** Override aliases for allowed packages */
  const alias =
    options.allowedOverrides?.map((name) => {
      // Construct a regex to match the package name exactly, including subpaths
      // e.g., /^@my-org\/ui(\/.*)?$/
      const finder = new RegExp(
        `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\/.*)?$`
      );

      return {
        find: finder,
        replacement: resolve(
          __dirname || process.cwd(),
          `${options.baseFolder || "./src"}/overrides/${name}/$1`
        ),
        customResolver: (source: string) => {
          // The customResolver logic remains the same:
          // Check if the replacement file exists.
          try {
            if (existsSync(source) && statSync(source).isFile()) {
              return source;
            }
          } catch (error) {
            // Fallback to default resolution if any error occurs
          }
          return null;
        },
      };
    }) ?? [];

  return {
    resolve: {
      alias,
    },
  };
}
