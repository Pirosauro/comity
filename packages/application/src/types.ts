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

/**
 * Application service interface providing Hono HTTP methods and middleware support.
 *
 * @remarks
 * This type represents a subset of Hono's functionality focused on HTTP routing
 * and middleware. It provides type-safe access to common HTTP methods while
 * maintaining compatibility with Hono's middleware system.
 *
 * **HTTP Methods:**
 * - Standard REST methods: `get`, `post`, `put`, `delete`, `patch`
 * - Additional methods: `options`, `all` (catch-all)
 *
 * **Middleware Support:**
 * - `use`: Apply middleware to routes
 * - `on`: Event-based routing
 * - `route`: Group routes under a common path
 * - `mount`: Mount sub-applications
 *
 * **Advanced Features:**
 * - `fetch`: Direct HTTP request handling
 * - `request`: Programmatic request creation
 * - `notFound`: 404 error handling
 * - `onError`: Global error handling
 *
 * @typeParam E - Hono environment type (default: BlankEnv)
 * @typeParam S - Hono schema type (default: BlankSchema)
 *
 * @example
 * Using the application service
 * ```typescript
 * function setupRoutes(service: ApplicationService) {
 *   service.get('/api/users', async (c) => {
 *     return c.json({ users: [] });
 *   });
 *
 *   service.post('/api/users', async (c) => {
 *     const data = await c.req.json();
 *     // Create user logic
 *     return c.json({ success: true });
 *   });
 * }
 * ```
 */
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

/**
 * Configuration options for application modules.
 *
 * @remarks
 * These options control how modules integrate with the application,
 * particularly around rendering and middleware ordering.
 *
 * @example
 * Module with custom renderer
 * ```typescript
 * const moduleOptions: ApplicationModuleOptions = {
 *   renderer: (c) => c.html('<html>...</html>'),
 *   rendererOrder: 'after'
 * };
 * ```
 */
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
 * Hooks triggered by the application module.
 *
 * @remarks
 * Application hooks provide lifecycle events for modules to integrate
 * with the application initialization and runtime.
 *
 * **Available Hooks:**
 * - `@comity/application:initialized`: Triggered after the application is fully initialized
 *
 * @typeParam E - Hono environment type (default: BlankEnv)
 * @typeParam S - Hono schema type (default: BlankSchema)
 *
 * @example
 * Listening to application initialization
 * ```typescript
 * const hooks: ApplicationModuleHooks = {
 *   '@comity/application:initialized': (app) => {
 *     console.log('Application ready!');
 *     // Register additional routes or middleware
 *     app.get('/health', (c) => c.text('OK'));
 *   }
 * };
 * ```
 */
export type ApplicationModuleHooks<
  E extends Env = BlankEnv,
  S extends Schema = BlankSchema
> = {
  /**
   * Triggered after the application is initialized.
   *
   * @param app - The fully initialized Hono application instance
   */
  "@comity/application:initialized": ApplicationService<E, S>;
};
