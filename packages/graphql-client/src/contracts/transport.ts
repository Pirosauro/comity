import type { GraphqlRequest } from "./request.js";
import type { GraphqlResponse } from "./response.js";

/**
 * GraphQL transport interface
 */
export interface GraphqlTransport {
  /**
   * Executes a GraphQL request and returns a promise that resolves to the GraphQL response.
   *
   * @param request - The GraphQL request to execute.
   *
   * @returns A promise that resolves to the GraphQL response.
   */
  execute<T = unknown>(request: GraphqlRequest): Promise<GraphqlResponse<T>>;

  /**
   * Executes a GraphQL subscription request and returns an async iterable that yields GraphQL responses.
   *
   * @param request - The GraphQL subscription request to execute.
   *
   * @returns An async iterable that yields GraphQL responses.
   */
  subscribe?<T>(request: GraphqlRequest): AsyncIterable<GraphqlResponse<T>>;
}
