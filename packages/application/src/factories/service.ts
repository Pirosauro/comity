import type { Env, Handler, Hono, MiddlewareHandler, Schema } from "hono";

/**
 * Creates a service interface for a Hono application with additional utilities.
 *
 * @remarks
 * This factory function creates a wrapper around a Hono application that provides
 * a consistent interface for routing and middleware while adding utility methods
 * like lazy loading for better performance.
 *
 * **Provided Methods:**
 * - **HTTP Methods**: `get`, `post`, `put`, `delete`, `options`, `patch`, `all`
 * - **Middleware**: `use`, `on`, `route`, `mount`
 * - **Utilities**: `fetch`, `request`, `notFound`, `onError`
 * - **Lazy Loading**: `lazy` method for dynamic imports
 *
 * **Lazy Loading:**
 * The `lazy` method enables code splitting by loading route handlers on-demand,
 * reducing initial bundle size and improving startup performance.
 *
 * @param app - The Hono application instance to wrap
 * @returns Service interface with routing methods and utilities
 *
 * @typeParam E - Hono environment type
 * @typeParam S - Hono schema type
 *
 * @example
 * Basic service usage
 * ```typescript
 * const app = new Hono();
 * const service = createService(app);
 *
 * service.get('/api/users', async (c) => {
 *   return c.json({ users: [] });
 * });
 * ```
 *
 * @example
 * Lazy loading for code splitting
 * ```typescript
 * const service = createService(app);
 *
 * service.lazy('GET', '/api/admin', () => import('./admin.js'));
 * // Handler is loaded only when /api/admin is accessed
 * ```
 *
 * @example
 * Middleware and routing
 * ```typescript
 * const service = createService(app);
 *
 * service.use('/api/*', cors());
 * service.route('/api/v1', (r) => {
 *   r.get('/users', getUsersHandler);
 *   r.post('/users', createUserHandler);
 * });
 * ```
 */
export function createService<E extends Env, S extends Schema>(
  app: Hono<E, S, "/">
) {
  return {
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
    lazy: async (
      method: string,
      path: string,
      loader: () => Promise<{ default: Handler | MiddlewareHandler }>
    ) => {
      app.on(method, path, async (c, next) => {
        const { default: handler } = await loader();

        return handler(c, next);
      });
    },
  };
}
