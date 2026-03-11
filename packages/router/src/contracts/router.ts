import type { HttpContext } from "@comity/http";
import type { RouteMatch } from "./route.js";

/**
 * URL rewriter function type.
 */
export interface Router {
  /**
   * Match a route for the given route resolution context.
   *
   * @param ctx - The route resolution context.
   *
   * @returns A promise that resolves to a RouteMatch if a matching route is found, or null if no match is found.
   */
  match(ctx: RouteResolutionContext): Promise<RouteMatch | null>;
}

/**
 * Context provided to route policies during evaluation.
 */
export interface RouteResolutionContext {
  /** The HTTP context of the incoming request */
  readonly http: HttpContext;

  /**
   * The URL to be matched against the defined routes.
   * This URL may have been rewritten by URL rewriters in the pipeline.
   */
  url: URL;
}
