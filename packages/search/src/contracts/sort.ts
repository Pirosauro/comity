/**
 * Search sorting specification.
 */
export interface SearchCriteriaSort {
  /** Field name to sort by. */
  readonly field: string;

  /** Sort direction. */
  readonly direction: "asc" | "desc";
}
