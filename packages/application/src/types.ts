import type {
  ContextRenderer as HonoContextRenderer,
  Handler as HonoHandler,
  Hono,
  MiddlewareHandler as HonoMiddlewareHandler,
} from "hono";
import type { BlankEnv, BlankSchema, Env, Schema } from "hono/types";
import type { z } from "zod";
import type { Context } from "@comity/core/patterns";

export {
  BlankEnv,
  BlankSchema,
  Env,
  Hono,
  HonoContextRenderer,
  HonoHandler,
  HonoMiddlewareHandler,
  Schema,
};

export type ApplicationModuleOptions = {};

/**
 * Metadata structure defining a Comity module's configuration and dependencies.
 *
 * @remarks
 * ModuleMeta defines the complete specification for a Comity module, including
 * its identity, dependencies, compatibility constraints, and setup function.
 * This metadata is used by the bootstrap system to:
 *
 * - **Validate modules**: Ensure all required fields are present and valid
 * - **Resolve dependencies**: Order modules based on dependency relationships
 * - **Check compatibility**: Prevent incompatible modules from being loaded together
 * - **Configure modules**: Validate module-specific configuration options
 *
 * @template O - The type of options the module's setup function expects
 *
 * @example
 * Complete module definition
 * ```typescript
 * import { z } from 'zod';
 *
 * const configSchema = z.object({
 *   apiKey: z.string(),
 *   timeout: z.number().default(5000),
 *   retries: z.number().default(3)
 * });
 *
 * export const apiModule: ModuleMeta<z.infer<typeof configSchema>> = {
 *   name: 'api-client',
 *   version: '2.1.0',
 *   dependsOn: ['logger', 'config'],
 *   incompatibleWith: ['legacy-api'],
 *   configSchema,
 *   setup: (options) => async (ctx) => {
 *     const client = new ApiClient(options);
 *
 *     // Prefer the `onHook` API from the shared Context implementation:
 *     ctx.onHook('@comity/application:initialized', async (app) => {
 *       app.use('/api/*', client.middleware());
 *       return app;
 *     });
 *   }
 * };
 * ```
 *
 * @example
 * Simple module without dependencies
 * ```typescript
 * export const utilsModule: ModuleMeta = {
 *   name: 'utils',
 *   version: '1.0.0',
 *   setup: () => async (ctx) => {
 *     // Module initialization logic
 *     console.log('Utils module loaded');
 *   }
 * };
 * ```
 */
export interface ApplicationModuleMeta<O extends {} = {}, C = Context> {
  /** Unique identifier for the module */
  name: string;

  /** Semantic version string (e.g., "1.2.3") */
  version: string;

  /** Priority for loading order (lower numbers load first, default is 100) */
  priority?: number;

  /** Array of module names this module depends on (optional) */
  dependsOn?: string[];

  /** Array of module names this module requires (optional) */
  requires?: string[];

  /** Array of module names this module cannot coexist with (optional) */
  incompatibleWith?: string[];

  /** Zod schema for validating module configuration (optional) */
  configSchema?: z.ZodTypeAny;

  /**
   * Function that returns the module setup function.
   * Receives module-specific options and returns an async function
   * that performs the actual module setup with the provided context.
   */
  setup: (options?: O) => Promise<(ctx: C) => Promise<void>>;

  /** Additional metadata or configuration options */
  [key: string]: any;
}

/**
 * Hooks triggered by the core module.
 *
 * These hooks allow other modules to react to core-related
 * actions and access the core context.
 */
/**
 * Hooks triggered by the core module.
 *
 * - `@comity/core:initialized`: Triggered after the core module is initialized.
 *   Payload: Hono instance representing the application.
 */
export type ApplicationModuleHooks<
  E extends Env = BlankEnv,
  S extends Schema = BlankSchema
> = {
  /**
   * Triggered after the application is initialized.
   */
  "@comity/application:initialized": Pick<
    Hono<E, S, "/">,
    | "get"
    | "post"
    | "put"
    | "delete"
    | "options"
    | "patch"
    | "all"
    | "use"
    | "on"
    | "route"
    | "mount"
    | "fetch"
    | "request"
    | "notFound"
    | "onError"
  >;
};
