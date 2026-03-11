import type { Route, RouteMatch } from "../contracts/route.js";
import type { Router, RouteResolutionContext } from "../contracts/router.js";

/**
 * MemoryRouter is a simple in-memory router implementation that matches incoming HTTP requests against a predefined set of routes.
 */
export class MemoryRouter implements Router {
  #routes: Route[];

  /**
   * @param routes - The routes to be managed by the router.
   */
  constructor(routes: Route[]) {
    this.#routes = routes;
  }

  /**
   * @inheritdoc
   */
  async match(ctx: RouteResolutionContext): Promise<RouteMatch | null> {
    const method = ctx.http.request.method;
    const path = ctx.url.pathname;

    for (const r of this.#routes) {
      if (r.method && r.method !== method) continue;
      if (r.path && r.path !== path) continue;

      return {
        route: r,
      };
    }

    return null;
  }
}
