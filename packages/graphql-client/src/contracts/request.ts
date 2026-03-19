/**
 * GraphQL request
 */
export interface GraphqlRequest {
  /** GraphQL query string */
  query: string;

  /** Variables for the GraphQL query */
  variables?: Record<string, unknown>;

  /** Operation name */
  operationName?: string;

  /** HTTP headers */
  headers?: Record<string, string>;
}
