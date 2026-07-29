import type { GraphqlRequest } from "./contracts/request.js";
import type { GraphqlResponse } from "./contracts/response.js";
import type { GraphqlTransport } from "./contracts/transport.js";
import { GraphqlClientError } from "./errors/index.js";

/**
 * Options for the GraphqlClient class.
 */
export interface GraphqlClientOptions {
  /** The GraphQL transport to use for executing requests. */
  transport: GraphqlTransport;
}

/**
 * A client for executing GraphQL requests using a specified transport.
 */
export class GraphqlClient {
  /** The GraphQL transport to use for executing requests. */
  #transport: GraphqlTransport;

  /**
   * @param options - The options for configuring the GraphqlClient.
   */
  constructor(options: GraphqlClientOptions) {
    this.#transport = options.transport;
  }

  /**
   * Executes a GraphQL request using the configured transport.
   *
   * @param request - The GraphQL request to execute.
   *
   * @returns A promise that resolves to the GraphQL response.
   */
  execute<T = unknown>(request: GraphqlRequest): Promise<GraphqlResponse<T>> {
    return this.#transport.execute<T>(request);
  }

  /**
   * Executes a GraphQL query request
   *
   * @param request - The GraphQL request object containing the query, variables, and operation name
   *
   * @returns A promise that resolves to the GraphQL response object
   */
  query<T = unknown>(request: GraphqlRequest): Promise<GraphqlResponse<T>> {
    return this.execute<T>(request);
  }

  /**
   * Executes a GraphQL mutation request
   *
   * @param request - The GraphQL request object containing the mutation, variables, and operation name
   *
   * @returns A promise that resolves to the GraphQL response object
   */
  mutation<T = unknown>(request: GraphqlRequest): Promise<GraphqlResponse<T>> {
    return this.execute<T>(request);
  }

  /**
   * Executes a GraphQL subscription request and returns an async iterable that yields GraphQL responses.
   *
   * @param request - The GraphQL subscription request to execute.
   *
   * @returns An async iterable that yields GraphQL responses.
   *
   * @throws {GraphqlClientError} If the transport does not support subscriptions.
   *
   * @yields {GraphqlResponse<T>} GraphQL response objects yielded by the subscription.
   */
  async *subscribe<T = unknown>(request: GraphqlRequest): AsyncIterable<GraphqlResponse<T>> {
    if (!this.#transport.subscribe) {
      throw new GraphqlClientError("subscription_not_supported");
    }

    const iterator = this.#transport.subscribe<T>(request);

    return yield* iterator;
  }
}
