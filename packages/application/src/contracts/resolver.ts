import type { HtmlLayoutCollector } from "@comity/html";
import type { ApplicationContract } from "./application.js";

/**
 * Context provided to application resolvers during contract resolution.
 */
export interface ApplicationResolverContext {
  /** The HTML layout collector used to collect HTML fragments during resolution. */
  html?: HtmlLayoutCollector;
}

/**
 *
 */
export interface ApplicationResolver<Data = unknown> {
  /**
   * Resolves the given HTTP contract and returns a new contract or null.
   *
   * @param contract - The HTTP contract to resolve.
   * @param ctx - The context provided to the resolver.
   *
   * @returns A new HTTP contract or null if the contract cannot be resolved.
   */
  resolve(
    contract: ApplicationContract<Data>,
    ctx: ApplicationResolverContext
  ): ApplicationContract | null | Promise<ApplicationContract | null>;
}
