/**
 * Search filtering criterion.
 */
export interface SearchCriteriaFilter {
  /** Field name to filter by. */
  readonly field: string;

  /** Exact match value. */
  readonly eq?: string | number | boolean;

  /** Set of values to match any. */
  readonly in?: ReadonlyArray<string | number | boolean>;

  /** Range minimum value. */
  readonly min?: number;

  /** Range maximum value. */
  readonly max?: number;
}
