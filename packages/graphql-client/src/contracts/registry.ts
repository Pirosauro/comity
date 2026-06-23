import type { GraphqlClient } from "../client.js";

/**
 * GraphQL client registry contract
 */
export interface GraphqlRegistry {
  /** Retrieves a GraphQL client by name */
  get(name: string): GraphqlClient | undefined;

  /** Checks if a GraphQL client exists by name */
  has(name: string): boolean;

  /** Returns an iterable of all registered GraphQL client names */
  keys(): Iterable<string>;
}
