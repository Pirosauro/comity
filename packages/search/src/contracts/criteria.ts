import type { SearchCriteriaFilter } from "./filter.js";
import type { SearchCriteriaPagination } from "./pagination.js";
import type { SearchCriteriaSort } from "./sort.js";

/**
 * Generic search criteria.
 */
export interface SearchCriteriaModel {
  /** Search query string. */
  readonly query?: string;

  /** Filters to apply. */
  readonly filters?: SearchCriteriaFilter[];

  /** Sort specifications. */
  readonly sort?: SearchCriteriaSort[];

  /** Pagination settings. */
  readonly pagination?: SearchCriteriaPagination;
}
