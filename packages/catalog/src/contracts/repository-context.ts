/**
 * Options for catalog repository requests, including scope, fields selection, locale, and currency.
 */
export interface CatalogRepositoryContext<T = unknown> {
  /** Fields to include in the response. */
  readonly fields?: T;

  /** Locale for the request. */
  readonly locale?: string;

  /** Currency for the request. */
  readonly currency?: string;

  /** Optional tenant ID to fetch catalog data for a specific tenant. */
  readonly tenant?: string;
}
