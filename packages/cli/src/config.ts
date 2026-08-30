import type { CliConfig } from "./types.js";

/**
 * Type-safe configuration definition helper.
 *
 * @template T - Configuration type extending CliConfig
 *
 * @param config - The configuration object to define
 *
 * @returns The same configuration object with full type inference
 *
 * @remarks
 * This function provides compile-time type checking and IDE autocompletion
 * for configuration objects. It is a simple identity function that returns
 * the configuration as-is, but with full type information preserved.
 *
 * @example
 * ```ts
 * interface MyCliConfig extends CliConfig {
 *   apiKey: string;
 *   debug: boolean;
 * }
 *
 * const config = defineConfig<MyCliConfig>({
 *   apiKey: process.env.API_KEY!,
 *   debug: process.env.NODE_ENV === "development",
 * });
 * ```
 */
export function defineConfig<T extends CliConfig>(config: T): T {
  return config;
}