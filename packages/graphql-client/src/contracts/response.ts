import type { GraphqlError } from "./error.js";

/**
 * GraphQL response
 */
export interface GraphqlResponse<T = unknown> {
  /** GraphQL response data */
  readonly data?: T;

  /** GraphQL errors */
  readonly errors?: GraphqlError[];

  /** GraphQL metadata */
  readonly meta?: Readonly<{
    /** Response headers */
    headers?: Headers;

    /** HTTP status code (if available) */
    httpStatus?: number;

    /** GraphQL response extensions */
    extensions?: Record<string, unknown>;
  }>;
}
