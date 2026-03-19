import type { GraphqlRequest } from "../contracts/request.js";
import type { GraphqlResponse } from "../contracts/response.js";
import type { GraphqlTransport } from "../contracts/transport.js";

import { GraphqlClientError } from "../error/graphql.js";

/**
 * Options for the FetchGraphqlTransport class.
 */
export interface FetchTransportOptions {
  /** The URL of the GraphQL endpoint. */
  url: string;

  /** The fetch function to use for making HTTP requests. Defaults to the global fetch function. */
  fetch?: typeof fetch;

  /** Additional headers to include in the HTTP requests. */
  headers?: Record<string, string>;
}

/**
 * A GraphQL transport implementation that uses the fetch API to execute GraphQL requests.
 */
export class FetchGraphqlTransport implements GraphqlTransport {
  /** The URL of the GraphQL endpoint. */
  #url: string;

  /** The fetch function to use for making HTTP requests. */
  #fetchFn: typeof fetch;

  /** Additional headers to include in the HTTP requests. */
  #headers: Record<string, string>;

  /**
   * @param options - The options for configuring the FetchGraphqlTransport.
   */
  constructor(options: FetchTransportOptions) {
    this.#url = options.url;
    this.#fetchFn = options.fetch ?? globalThis.fetch;
    this.#headers = options.headers ?? {};
  }

  /**
   * @inheritdoc
   */
  async execute<T>(request: GraphqlRequest): Promise<GraphqlResponse<T>> {
    const response = await this.#fetchFn(this.#url, {
      method: "POST",

      headers: {
        "content-type": "application/json",
        ...this.#headers,
        ...(request.headers ?? {}),
      },

      body: JSON.stringify({
        query: request.query,
        variables: request.variables,
        operationName: request.operationName,
      }),
    });

    if (!response.ok) {
      const details = request.operationName ? { operationName: request.operationName } : undefined;

      throw new GraphqlClientError("transport_error", {
        httpStatus: response.status,
        ...(details ? { details } : {}),
      });
    }

    const json = await response.json();

    return json as GraphqlResponse<T>;
  }
}
