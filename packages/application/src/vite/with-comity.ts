import type { UserConfig } from "vite";
import { resolve } from "node:path";
import { existsSync, statSync } from "node:fs";

export type ComityViteOptions = {};

/**
 * Creates a Vite configuration with Comity-specific alias resolution.
 *
 * @remarks
 * Configures Vite to check for local overrides in `src/overrides/` directory
 * before resolving package imports, allowing selective package replacement.
 *
 * @param options - Configuration options (currently unused)
 * @returns Vite configuration object with custom alias resolver
 *
 * @example
 * ```typescript
 * import { defineConfig } from 'vite';
 * import { withComity } from '@comity/application/vite';
 *
 * export default defineConfig({
 *   ...withComity({})
 * });
 * ```
 */
export function withComity(
  options: ComityViteOptions
): Promise<UserConfig> | UserConfig {
  return {
    resolve: {
      alias: [
        // Replace package imports with local overrides if the file exists
        {
          find: /^(?:@[^\/]+\/[^\/]+|[^@][^\/]*)(?:\/.*)?$/,
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
}
