import type { Route } from "@comity/router";
import type { MatchFunction } from "path-to-regexp";

/**
 * CompiledRoute represents a route that has been compiled with a path matching function.
 */
export interface CompiledRoute {
  /**
   * The original route object.
   */
  route: Route;
  /**
   * The path matching function generated from the route's path.
   */
  match: MatchFunction<Record<string, string>>;
}
