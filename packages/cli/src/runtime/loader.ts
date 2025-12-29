import type { CliConfig } from "../types.js";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import {
  CliConfigNotFoundError,
  CliInvalidConfigPathError,
} from "../errors/index.js";

/**
 * Loads and returns the CLI configuration from various possible file locations.
 *
 * @returns Promise resolving to the loaded CLI configuration
 *
 * @remarks
 * This function searches for configuration files in the following order:
 * 1. `comity.config.ts` (current directory)
 * 2. `comity.config.js` (current directory)
 * 3. `config/comity.ts`
 * 4. `config/comity.js`
 * 5. `src/config/comity.ts`
 * 6. `src/config/comity.js`
 *
 * Environment variables can override the search:
 * - `COMITY_CLI_CONFIG_FILE`: Direct path to config file
 * - `VITE_COMITY_CLI_CONFIG_FILE`: Vite-specific override
 *
 * For security, config files must be within the current working directory.
 *
 * @throws {CliInvalidConfigPathError} When the config path is outside the project root
 * @throws {CliConfigNotFoundError} When no valid config file is found in any location
 *
 * @example
 * Basic usage
 * ```typescript
 * try {
 *   const config = await loadCliConfig();
 *   console.log("Config loaded:", config);
 * } catch (error) {
 *   console.error("Failed to load config:", error.message);
 * }
 * ```
 *
 * @example
 * Using environment variable override
 * ```typescript
 * // Set custom config path
 * process.env.COMITY_CLI_CONFIG_FILE = "my-custom-config.ts";
 * const config = await loadCliConfig();
 * ```
 */
export async function loadCliConfig(): Promise<CliConfig> {
  try {
    process.loadEnvFile?.(); // Load .env files if the environment supports it
  } catch {
    // Ignore errors during .env loading
  }

  const root = process.cwd();
  const paths = [
    resolve(root, "comity.config.ts"),
    resolve(root, "comity.config.js"),
    resolve(root, "config", "comity.ts"),
    resolve(root, "config", "comity.js"),
    resolve(root, "src", "config", "comity.ts"),
    resolve(root, "src", "config", "comity.js"),
  ];

  // Add environment variable overrides
  if (process.env.COMITY_CLI_CONFIG_FILE) {
    const path = resolve(root, process.env.COMITY_CLI_CONFIG_FILE);

    if (!path.startsWith(root)) {
      throw new CliInvalidConfigPathError({
        path,
        cwd: root,
      });
    }

    paths.unshift(path);
  }

  // Vite-specific environment variable override
  if (process.env.VITE_COMITY_CLI_CONFIG_FILE) {
    const path = resolve(root, process.env.VITE_COMITY_CLI_CONFIG_FILE);

    if (!path.startsWith(root)) {
      throw new CliInvalidConfigPathError({
        path,
        cwd: root,
      });
    }

    paths.unshift(path);
  }

  // Try to load the configuration file from the possible paths
  for (const path of paths) {
    try {
      const url = pathToFileURL(path).href;
      const { default: config } = await import(url);

      if (config) {
        return config;
      }
    } catch (error) {
      // Ignore errors and continue to the next path
      continue;
    }
  }

  // If no config file is found, throw an error
  throw new CliConfigNotFoundError({
    searchedPaths: paths,
  });
}
