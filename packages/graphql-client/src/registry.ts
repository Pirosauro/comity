import type { GraphqlClient } from "./client.js";
import type { GraphqlRegistry } from "./contracts/registry.js";

/**
 * Default implementation of the GraphQL client registry contract.
 */
export class DefaultGraphqlRegistry implements GraphqlRegistry {
  readonly #clients: ReadonlyMap<string, GraphqlClient>;

  /**
   * @param clients - A record of GraphQL clients keyed by their names.
   */
  constructor(clients: Record<string, GraphqlClient>) {
    this.#clients = new Map(Object.entries(clients));
  }

  /**
   * @inheritdoc
   */
  get(name: string) {
    return this.#clients.get(name);
  }

  /**
   * @inheritdoc
   */
  has(name: string) {
    return this.#clients.has(name);
  }

  /**
   * @inheritdoc
   */
  keys() {
    return this.#clients.keys();
  }
}
