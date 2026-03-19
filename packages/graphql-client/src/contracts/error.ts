/**
 * GraphQL error location
 */
export interface GraphqlErrorLocation {
  /** Line number */
  line: number;

  /** Column number */
  column: number;
}

/**
 * GraphQL error
 */
export interface GraphqlError {
  /** Error message */
  message: string;

  /** Path to the field that caused the error */
  path?: (string | number)[];

  /** Locations in the query where the error occurred */
  locations?: GraphqlErrorLocation[];

  /** Error extensions */
  extensions?: Record<string, unknown>;
}
