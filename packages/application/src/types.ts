import type {
  ContextRenderer as HonoContextRenderer,
  Handler as HonoHandler,
  Hono,
  MiddlewareHandler as HonoMiddlewareHandler,
} from "hono";
import type { BlankEnv, BlankSchema, Env, Schema } from "hono/types";

export type {
  BlankEnv,
  BlankSchema,
  Env,
  Hono,
  HonoContextRenderer,
  HonoHandler,
  HonoMiddlewareHandler,
  Schema,
};

export type ApplicationService<
  E extends Env = Env,
  S extends Schema = Schema
> = Pick<
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

export type ApplicationModuleOptions = {
  /** Renderer function to render responses */
  renderer?: HonoContextRenderer;

  /** Order in which the renderer should be applied relative to other middleware */
  rendererOrder?: "before" | "after";
};

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
  "@comity/application:initialized": ApplicationService<E, S>;
};
