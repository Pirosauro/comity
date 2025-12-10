import type { UserConfig } from "vite";
import { resolve } from "node:path";
import { existsSync, statSync } from "node:fs";

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
export type ComityViteOptions = {};

// Cache the configuration since options are not used
let cachedConfig: UserConfig | null = null;

// For testing: clear the cache
export function __test_clearCache() {
  cachedConfig = null;
}

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
  if (cachedConfig) {
    return cachedConfig;
  }

  cachedConfig = {
    resolve: {
      alias: [
        // Replace package imports with local overrides if the file exists
        {
          // find: /^(?:@[^\/]+\/[^\/]+|[^@][^\/]*)(?:\/.*)?$/,
          find: /^(?:@[a-zA-Z0-9][a-zA-Z0-9\-_]*\/[a-zA-Z0-9][a-zA-Z0-9\-_]*|[a-zA-Z0-9][a-zA-Z0-9\-_]*)(?:\/.*)?$/,
          replacement: resolve(
            __dirname || process.cwd(),
            "./src/overrides/$1"
          ),
          customResolver: (source: string) => {
            try {
              if (existsSync(source) && statSync(source).isFile()) {
                return source;
              }
            } catch (error) {
              // Fallback to default resolution if any error occurs
            }

            return null;
          },
        },
      ],
    },
  };

  return cachedConfig;
}
