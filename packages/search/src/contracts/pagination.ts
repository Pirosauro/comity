/**
 * Search pagination specification.
 */
export interface SearchCriteriaPagination {
  /** Page number (1-indexed). */
  readonly page: number;

  /** Results per page. */
  readonly pageSize: number;
}
