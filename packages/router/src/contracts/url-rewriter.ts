import type { HttpContext } from "@comity/http";

/**
 * Defines the contract for URL rewriting within the routing system. Implementations of this interface can be used to modify incoming request URLs before they are processed by route handlers, enabling features such as URL normalization, redirection, or custom routing logic.
 */
export interface UrlRewriter {
  /**
   * Rewrites the given URL based on the provided HTTP context. This method can modify the URL as needed, or return null to indicate that the URL should not be rewritten.
   *
   * @param url - The original URL to be rewritten.
   * @param http - The HTTP context of the incoming request, which may contain additional information useful for rewriting the URL.
   *
   * @returns The rewritten URL, or null if no rewriting should occur.
   *
   * @remarks
   * - Implementations should ensure that the rewritten URL is valid and properly formatted.
   * - This method is called before route matching occurs, so it can influence which route handlers are invoked for a given request.
   * - Rewriters should be designed to be composable, allowing multiple rewriters to be applied in sequence if needed.
   * - Care should be taken to avoid infinite rewriting loops, where a rewriter continuously modifies the URL in a way that triggers itself repeatedly.
   */
  rewrite(url: URL, http: HttpContext): URL | null;
}
