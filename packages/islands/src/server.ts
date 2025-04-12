import type { Env, Schema } from 'hono';
import type {
  H,
  NotFoundHandler,
  ErrorHandler,
  BlankEnv,
  BlankSchema,
  RouterRoute,
} from 'hono/types';
import type { RouteMeta } from './with-route-meta.js';
import { Hono } from 'hono';

/**
 * Custom server class extending Hono framework.
 *
 * This class provides additional functionality for registering routes,
 * handling custom 404 and 500 pages, and generating a sitemap.
 */
export class Server<
  E extends Env = BlankEnv,
  S extends Schema = BlankSchema,
  BasePath extends string = '/'
> extends Hono<E, S, BasePath> {
  /**
   * Register routes and middlewares.
   *
   * @param {Record<string, H | ErrorHandler>} routes - The routes to register.
   * @return {void}
   */
  registerRoutes(routes: Record<string, H | ErrorHandler>): void {
    let count = 0;

    console.log('\u001B[34mRegistering routes and middlewares\u001B[0m');

    Object.entries(routes).forEach(([route, handler]) => {
      this.registerRoute(route, handler);

      ++count;
    });

    console.log(
      `\u001B[33m[OK] ${count}/${
        Object.keys(routes).length
      } items registered\u001B[0m`
    );
  }

  /**
   * Register a single route.
   *
   * @param {string} route - The route to register.
   * @param {H | ErrorHandler} handler - The handler for the route.
   * @return {void}
   */
  registerRoute(route: string, handler: H | ErrorHandler): void {
    const [, path, method = 'all'] =
      route.match(/^(.*?)(?:\.(all|delete|get|middleware|patch|post|put))?$/) ||
      [];

    // Custom 404 page
    if (path === '/_404') {
      this.notFound(handler as NotFoundHandler);
      console.log('*', '/*', '(404 handler)');

      return;
    }

    // Error handling
    if (path === '/_500') {
      this.onError(handler as ErrorHandler);
      console.log('*', '/*', '(error handler)');

      return;
    }

    // Middleware handling
    if (path.endsWith('/_middleware') || method === 'middleware') {
      const p = path.replace(/\/_middleware$/, '/*');

      this.use(p, handler as H);
      console.log('*', p, '(middleware)');

      return;
    }

    // Ignore invalid routes
    if (!path || path.match(/\/_[^\/]+$/) || !method || !handler) return;

    // Normalize path
    const normalized = path.endsWith('/index')
      ? path.slice(0, -6) || '/'
      : path;

    // Register route handler on Hono
    this.on(
      method,
      normalized,
      ...(Array.isArray(handler) ? handler : [handler])
    );
    console.log(method.replace('all', '*').toUpperCase(), normalized);
  }

  /**
   * Get the registered routes with their metadata.
   *
   * @returns {Record<string, RouteMeta>}
   */
  getMeta(): Record<string, RouteMeta> {
    const routes: Record<string, RouteMeta> = {};

    this.routes.map(({ path, method, handler }: RouterRoute) => {
      // Add route to sitemap if applicable
      if (
        ['get', 'all'].includes(method.toLowerCase()) &&
        typeof handler === 'function' &&
        Object.hasOwn(handler, 'meta')
      ) {
        routes[path] = (handler as any).meta;
      }
    });

    return routes;
  }
}
