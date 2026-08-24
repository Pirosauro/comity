/**
 * Options for taxonomy repository requests, including fields selection, locale, and tenant information.
 */
export interface TaxonomyRepositoryContext {
  /** Fields to include in the response. */
  readonly fields?: unknown;

  /** Locale for the request. */
  readonly locale?: string;

  /** Optional tenant ID to fetch taxonomy data for a specific tenant. */
  readonly tenant?: string;
}