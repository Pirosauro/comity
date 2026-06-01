import type { Route, RouteMatch, Router, RouteResolutionContext } from "@comity/router";
import type { CompiledRoute } from "./types.js";

import { match } from "path-to-regexp";

/**
 * PathRouter is a router implementation that matches incoming HTTP requests based on their URL path and HTTP method. It supports static paths and can be extended to support dynamic path parameters in the future.
 */
export class PathRouter implements Router {
  #routes: CompiledRoute[];

  /**
   * @param routes - An array of Route objects that define the routing rules for this router.
   */
  constructor(routes: Route[]) {
    this.#routes = routes
      .filter((r) => r.path)
      .map((r) => ({
        route: r,
        match: match(r.path!, { decode: decodeURIComponent }),
      }));
  }

  /**
   * Matches an incoming HTTP request against the defined routes.
   *
   * @param ctx - The context of the incoming HTTP request.
   *
   * @returns A promise that resolves to a RouteMatch object if a matching route is found, or null if no match is found.
   */
  async match(ctx: RouteResolutionContext): Promise<RouteMatch | null> {
    const method = ctx.http.request.method;
    const pathname = ctx.url.pathname;

    for (const r of this.#routes) {
      if (r.route.method && r.route.method !== method) {
        continue;
      }

      const m = r.match(pathname);

      if (!m) continue;

      return {
        route: r.route,
        params: m.params as Record<string, string>,
      };
    }

    return null;
  }
}
