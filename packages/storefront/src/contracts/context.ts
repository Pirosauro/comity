import type { HttpRequest } from "@comity/http";

/**
 * Storefront context
 */
export interface StorefrontContext {
  /** Locale for the request. */
  readonly locale?: string;

  /** Currency for the request. */
  readonly currency?: string;

  /** Optional tenant ID to fetch catalog data for a specific tenant. */
  readonly tenant?: string;
}

/**
 * Resolves the storefront context for incoming HTTP requests, including locale, currency, and tenant information.
 */
export interface StorefrontContextResolver {
  /** Resolves the storefront context for a given HTTP request. */
  resolve(request: HttpRequest): Promise<StorefrontContext>;
}
