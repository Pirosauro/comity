/**
 * Options for catalog repository requests, including scope, fields selection, and locale.
 */
export interface ContentRepositoryContext<T = unknown> {
  /** Fields to include in the response. */
  readonly fields?: T;

  /** Locale for the request. */
  readonly locale?: string;

  /** Optional tenant ID to fetch catalog data for a specific tenant. */
  readonly tenant?: string;
}
