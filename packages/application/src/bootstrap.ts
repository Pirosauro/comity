import type { Hono } from "hono";
import type { BlankEnv, BlankSchema, Env, Schema } from "hono/types";
import type { ApplicationModuleHooks, ApplicationModuleMeta } from "./types.js";
import { ApplicationContext } from "./context.js";
import { moduleMetaSchema } from "./validation/module-meta.js";
import { resolveModuleOrder } from "./utils/resolver.js";

/**
 * Bootstraps a Comity application by registering modules and setting up the runtime environment.
 *
 * @remarks
 * The createApplication function is the main entry point for initializing a Comity application.
 * It takes a Hono app instance, a list of modules, and configuration options, then:
 *
 * 1. **Validates module dependencies** - Ensures all modules are in correct dependency order
 * 2. **Sets up logging** - Configures application-wide logging system
 * 3. **Creates module context** - Provides hooks, events, and utilities to modules
 * 4. **Registers modules** - Calls each module's setup function with validation
 * 5. **Triggers lifecycle hooks** - Notifies all modules that bootstrap is complete
 *
 * **Module Loading Process:**
 * - Modules are processed in dependency order (dependencies first)
 * - Each module's metadata is validated against the schema
 * - Module setup functions receive a context with hooks, events, and logging
 * - Modules can register lifecycle hooks and event handlers
 *
 * **Lifecycle Hooks vs Events:**
 * - **Hooks**: Sequential processing where each function can transform the payload
 * - **Events**: Parallel processing for notifications without payload transformation
 *
 * @param app - The Hono application instance to bootstrap
 * @param modules - Array of module metadata objects defining the application modules
 * @param options - Configuration options, including module-specific configurations and framework options
 *
 * @returns Promise resolving to the bootstrapped Hono application instance
 *
 * @throws {@link Error}
 * Thrown when module dependencies are invalid, modules fail validation, or setup functions fail
 *
 * @example
 * Basic application bootstrap
 * ```typescript
 * import { Hono } from 'hono';
 * import { createApplication } from '@comity/application';
 * import { userModule } from './modules/user.js';   // userModule.name === '@example/user'
 * import { authModule } from './modules/auth.js';   // authModule.name === '@example/auth'
 *
 * const app = new Hono();
 * const modules = [authModule, userModule];
 * const options = {
 *   "@example/auth": {
 *     secret: process.env.JWT_SECRET,
 *     expiresIn: '24h'
 *   },
 *   "@example/user": {
 *     databaseUrl: 'postgresql://localhost/app'
 *   }
 * };
 *
 * const app = await createApplication(app, modules, options);
 *
 * export default app;
 * ```
 *
 * @example
 * Module with lifecycle hooks
 * ```typescript
 * export const databaseModule = {
 *   name: '@example/database',
 *   version: '1.0.0',
 *   setup: (options) => {
 *     return async (ctx) => {
 *       const db = await createConnection(options.url);
 *
 *       // Register a lifecycle hook that runs after bootstrap
 *       ctx.onHook('@comity/application:initialized', async (payload) => {
 *         console.log('Database ready, app bootstrapped');
 *         return payload;
 *       });
 *
 *       // Register an event listener for shutdown
 *       ctx.onEvent('@comity/application:shutdown', async () => {
 *         await db.close();
 *       });
 *     };
 *   }
 * };
 * ```
 */
export async function createApplication<
  E extends Env = BlankEnv,
  S extends Schema = BlankSchema
>(
  app: Hono<E, S, "/">,
  modules: ApplicationModuleMeta<any, any>[],
  options: Record<string, any> = {}
): Promise<Hono<E, S, "/">> {
  modules = resolveModuleOrder(modules);

  // Create module context with app, api, and optional Pino logger
  const ctx = new ApplicationContext();

  // Register modules
  for (const mod of modules) {
    moduleMetaSchema.parse(mod);

    // Call the module's setup function
    const setup = await mod.setup(options[mod.name]);

    await setup(ctx);
  }

  // Trigger lifecycle hook
  await ctx.trigger<
    ApplicationModuleHooks<E, S>["@comity/application:initialized"]
  >("@comity/application:initialized", {
    get: app.get.bind(app),
    post: app.post.bind(app),
    put: app.put.bind(app),
    delete: app.delete.bind(app),
    options: app.options.bind(app),
    patch: app.patch.bind(app),
    use: app.use.bind(app),
    on: app.on.bind(app),
    all: app.all.bind(app),
    route: app.route.bind(app),
    mount: app.mount.bind(app),
    fetch: app.fetch.bind(app),
    request: app.request.bind(app),
    notFound: app.notFound.bind(app),
    onError: app.onError.bind(app),
  });

  return app;
}
