import type { CliConfig } from "./types.js";

/**
 * Type-safe configuration definition helper for Comity applications.
 *
 * @remarks
 * This function provides type safety and IDE autocompletion for configuration objects.
 * It's a simple identity function that returns the configuration as-is, but with full
 * type checking and intellisense support.
 *
 * **Benefits:**
 * - Compile-time type checking for configuration values
 * - IDE autocompletion and validation
 * - Clear documentation of expected configuration structure
 * - Runtime validation can be added by extending this function
 *
 * @param config - The configuration object to define and validate
 * @returns The same configuration object with full type information
 *
 * @example
 * Basic configuration definition
 * ```typescript
 * interface MyAppConfig extends Config {
 *   apiKey: string;
 *   debug: boolean;
 *   features: {
 *     analytics: boolean;
 *     cache: boolean;
 *   };
 * }
 *
 * const config = defineConfig<MyAppConfig>({
 *   apiKey: process.env.API_KEY!,
 *   debug: process.env.NODE_ENV === 'development',
 *   features: {
 *     analytics: true,
 *     cache: process.env.NODE_ENV === 'production'
 *   }
 * });
 *
 * // TypeScript will enforce the correct structure
 * // config.apiKey is known to be a string
 * // config.features.analytics is known to be a boolean
 * ```
 *
 * @example
 * Environment-based configuration
 * ```typescript
 * interface DatabaseConfig extends Config {
 *   host: string;
 *   port: number;
 *   database: string;
 *   ssl: boolean;
 * }
 *
 * const dbConfig = defineConfig<DatabaseConfig>({
 *   host: process.env.DB_HOST || 'localhost',
 *   port: parseInt(process.env.DB_PORT || '5432'),
 *   database: process.env.DB_NAME || 'app',
 *   ssl: process.env.NODE_ENV === 'production'
 * });
 * ```
 *
 * @example
 * Nested configuration with validation
 * ```typescript
 * interface AppConfig extends Config {
 *   server: {
 *     port: number;
 *     host: string;
 *   };
 *   logging: {
 *     level: 'debug' | 'info' | 'warn' | 'error';
 *     format: 'json' | 'text';
 *   };
 * }
 *
 * const config = defineConfig<AppConfig>({
 *   server: {
 *     port: 3000,
 *     host: '0.0.0.0'
 *   },
 *   logging: {
 *     level: 'info',
 *     format: 'json'
 *   }
 * });
 *
 * // TypeScript ensures logging.level is one of the allowed values
 * ```
 */
export function defineConfig<T extends CliConfig>(config: T): T {
  return config;
}
