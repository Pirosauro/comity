import type { GraphqlRequest, GraphqlResponse, GraphqlTransport } from "@comity/graphql-client";
import type { Client } from "graphql-ws";

import { GraphqlClientError } from "@comity/graphql-client/error";
import { createClient } from "graphql-ws";

/**
 * Options for the WsGraphqlTransport class.
 */
export type WsGraphqlTransportOptions =
  | {
      /** The URL of the GraphQL WebSocket server. */
      url: string;

      /** Optional connection parameters for the GraphQL WebSocket client. */
      connectionParams?: Record<string, unknown>;
    }
  | {
      /** The GraphQL WebSocket client instance to use for the transport. */
      client: Client;
    };

/**
 * GraphQL WebSocket transport implementation.
 */
export class WsGraphqlTransport implements GraphqlTransport {
  /** The GraphQL WebSocket client instance. */
  #client: Client;

  /**
   * @param options - The options for configuring the WsGraphqlTransport.
   */
  constructor(options: WsGraphqlTransportOptions) {
    this.#client =
      "client" in options
        ? options.client
        : createClient({
            url: options.url,
            connectionParams: options.connectionParams ?? {},
          });
  }

  /**
   * @inheritdoc
   */
  async execute<T>(request: GraphqlRequest): Promise<GraphqlResponse<T>> {
    const iterator = this.subscribe<T>(request)[Symbol.asyncIterator]();
    const result = await iterator.next();

    if (result.done) {
      throw new GraphqlClientError("protocol_error");
    }

    return result.value;
  }

  /**
   * @inheritdoc
   */
  subscribe<T>(request: GraphqlRequest): AsyncIterable<GraphqlResponse<T>> {
    const client = this.#client;

    return {
      /**
       * Implements the async iterator protocol to allow consuming GraphQL subscription responses as an async iterable.
       *
       * @returns An async iterator that yields GraphQL responses for the subscription request.
       */
      [Symbol.asyncIterator]() {
        let done = false;
        let resolve: ((v: IteratorResult<GraphqlResponse<T>>) => void) | null = null;

        const queue: GraphqlResponse<T>[] = [];

        const dispose = client.subscribe(
          {
            query: request.query,
            variables: request.variables,
            operationName: request.operationName,
          },
          {
            /**
             * Handles the next value in the GraphQL subscription.
             *
             * @param data The data received from the subscription.
             */
            next: (data: GraphqlResponse<T>) => {
              if (resolve) {
                resolve({
                  value: data,
                  done: false,
                });

                resolve = null;
              } else {
                queue.push(data);
              }
            },

            /**
             * Handles errors that occur during the GraphQL subscription.
             *
             * @param cause - The error received from the subscription.
             */
            error: (cause: unknown) => {
              throw new GraphqlClientError("transport_error", { cause });
            },

            /**
             * Handles the completion of the GraphQL subscription.
             */
            complete: () => {
              done = true;

              if (resolve) {
                resolve({
                  value: undefined,
                  done: true,
                });
              }
            },
          }
        );

        return {
          /**
           * Retrieves the next value from the async iterator.
           *
           * @returns A promise that resolves to the next value in the iterator.
           */
          next() {
            if (queue.length > 0) {
              return Promise.resolve({
                value: queue.shift()!,
                done: false,
              });
            }

            if (done) {
              return Promise.resolve({
                value: undefined,
                done: true,
              });
            }

            return new Promise((r) => {
              resolve = r;
            });
          },

          /**
           * Handles the return of the async iterator.
           *
           * @returns A promise that resolves when the iterator is returned.
           */
          return() {
            dispose();

            return Promise.resolve({
              value: undefined,
              done: true,
            });
          },

          /**
           * Handles errors thrown within the async iterator.
           *
           * @param e The error to be thrown.
           */
          throw(e) {
            dispose();

            throw e;
          },
        };
      },
    };
  }
}
