import type { GraphqlRequest } from "../contracts/request.js";
import type { GraphqlTransport } from "../contracts/transport.js";

import { GraphqlClientError } from "../errors/graphql.js";

/**
 * Options for the CombinedGraphqlTransport class.
 */
export interface CombinedGraphqlTransportOptions {
  /** The transport used for executing GraphQL operations. */
  execute: GraphqlTransport["execute"];

  /** The transport used for subscribing to GraphQL operations. */
  subscribe: GraphqlTransport["subscribe"];
}

/**
 * A transport that combines separate execute and subscribe transports.
 */
export class CombinedGraphqlTransport implements GraphqlTransport {
  #execute: GraphqlTransport["execute"];
  #subscribe: GraphqlTransport["subscribe"];

  /**
   * @param options - The options for configuring the CombinedGraphqlTransport.
   */
  constructor(options: CombinedGraphqlTransportOptions) {
    this.#execute = options.execute;
    this.#subscribe = options.subscribe;
  }

  /**
   * @inheritdoc
   */
  execute<T>(request: GraphqlRequest) {
    return this.#execute<T>(request);
  }

  /**
   * @inheritdoc
   */
  subscribe<T>(request: GraphqlRequest) {
    if (!this.#subscribe) {
      throw new GraphqlClientError("subscription_not_supported");
    }

    return this.#subscribe<T>(request);
  }
}
