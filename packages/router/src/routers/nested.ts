import type { RouteMatch } from "../contracts/route.js";
import type { Router, RouteResolutionContext } from "../contracts/router.js";

/**
 * NestedRoute represents a route that contains a nested router. It consists of a URL prefix and a child router that will be used to match requests that start with the specified prefix.
 */
export interface NestedRoute {
  /** The URL prefix for this nested route. */
  prefix: string;

  /** The child router that will handle requests matching the prefix. */
  router: Router;
}

/**
 * NestedRouter is a router implementation that supports nested routes. It allows you to define routes with a common prefix and delegate the handling of requests to child routers.
 */
export class NestedRouter implements Router {
  #routes: NestedRoute[];

  /**
   * @param routes - An array of NestedRoute objects that define the nested routing rules for this router.
   */
  constructor(routes: NestedRoute[]) {
    this.#routes = routes;
  }

  /** @inheritdoc */
  async match(ctx: RouteResolutionContext): Promise<RouteMatch | null> {
    const pathname = ctx.url.pathname;

    for (const r of this.#routes) {
      // Skip routes that don't match the prefix
      if (!pathname.startsWith(r.prefix)) continue;

      const rest = pathname.slice(r.prefix.length) || "/";
      const url = new URL(ctx.url.toString());

      url.pathname = rest.startsWith("/") ? rest : "/" + rest;

      const match = await r.router.match({
        http: ctx.http,
        url,
      });

      if (match) return match;
    }

    return null;
  }
}
