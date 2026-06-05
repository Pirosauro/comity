import type { AggregationModel } from "./aggregation.js";

/**
 * Generic search result wrapper.
 */
export interface SearchResultModel<T> {
  /** Result items. */
  readonly items: ReadonlyArray<T>;

  /** Total number of matching items. */
  readonly total: number;

  /** Current page. */
  readonly page: number;

  /** Items per page. */
  readonly pageSize: number;

  /** Available aggregations (facets). */
  readonly aggregations?: AggregationModel[];
}
