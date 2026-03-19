import type { GraphqlError } from "./error.js";

/**
 * GraphQL response
 */
export interface GraphqlResponse<T = unknown> {
  /** GraphQL response data */
  data?: T;

  /** GraphQL errors */
  errors?: GraphqlError[];

  /** GraphQL response extensions */
  extensions?: Record<string, unknown>;
}
