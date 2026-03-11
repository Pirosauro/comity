import type { Route, RouteMatch, Router, RouteResolutionContext } from "@comity/router";

/**
 * In-memory router implementation.
 */
export class MemoryRouter implements Router {
  #routes: Route[];

  /**
   * @param routes - List of routes to be matched by this router.
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
