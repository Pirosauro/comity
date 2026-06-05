/**
 * Search aggregation option (for faceted search).
 */
export interface AggregationOptionModel {
  /** Option value. */
  readonly value: string;

  /** Display label. */
  readonly label?: string;

  /** Result count for this option. */
  readonly count: number;
}

/**
 * Search aggregation (facet).
 */
export interface AggregationModel {
  /** Aggregation name/field. */
  readonly name: string;

  /** Display label. */
  readonly label?: string;

  /** Aggregation options. */
  readonly options: AggregationOptionModel[];

  /** Range for numeric aggregations. */
  readonly range?: Readonly<{
    /** Minimum value. */
    min: number;

    /** Maximum value. */
    max: number;
  }>;
}
