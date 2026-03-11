import type { HttpContext, HttpHandler, HttpMethod } from "@comity/http";

/**
 * HTTP handler type.
 */
export interface Route {
  /** HTTP method */
  readonly method?: HttpMethod;

  /** URL path (or slug, or pattern, or...). Matched against ctx.url.pathname */
  readonly path?: string;

  /** HTTP handler function */
  readonly handler: HttpHandler;

  /** Policies associated with the route */
  readonly policies?: Readonly<Record<string, unknown>>;

  /** Metadata associated with the route */
  readonly meta?: Readonly<Record<string, unknown>>;
}

/**
 * Result of a successful route match.
 */
export interface RouteMatch {
  /** Matched route */
  readonly route: Route;

  /** Route parameters */
  readonly params?: Readonly<Record<string, string>>;
}

/**
 * Defines a policy that can be applied to a route.
 */
export type RoutePolicyHandler = (
  ctx: HttpContext,
  match: RouteMatch,
  config: unknown
) => Promise<void>;
