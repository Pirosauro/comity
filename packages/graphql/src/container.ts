import { GraphQLSchema, GraphQLObjectType } from "graphql";
import {
  FieldConfig,
  GraphQLModule,
  SubscriptionFieldConfig,
} from "./types.js";

export class GraphQLContainer {
  #queries: Record<string, FieldConfig> = {};
  #mutations: Record<string, FieldConfig> = {};
  #subscriptions: Record<string, SubscriptionFieldConfig> = {};
  #schema: GraphQLSchema | null = null;

  get queries() {
    return { ...this.#queries };
  }

  get mutations() {
    return { ...this.#mutations };
  }

  get subscriptions() {
    return { ...this.#subscriptions };
  }

  /**
   * Register a GraphQL module
   * @param module The GraphQL module to register
   */
  register(module: GraphQLModule) {
    // Register queries
    if (module.queries) {
      for (const [name, field] of Object.entries(module.queries)) {
        this.#queries[name] = field;
      }
    }

    // Register mutations
    if (module.mutations) {
      for (const [name, field] of Object.entries(module.mutations)) {
        this.#mutations[name] = field;
      }
    }

    // Register subscriptions
    if (module.subscriptions) {
      for (const [name, field] of Object.entries(module.subscriptions)) {
        this.#subscriptions[name] = field;
      }
    }

    // Invalidate cached schema when new modules are registered
    this.#schema = null;
  }

  /**
   * Build the GraphQL schema from the registered modules
   * @returns The constructed GraphQL schema
   */
  buildSchema(): GraphQLSchema {
    // Return cached schema if available
    if (this.#schema) {
      return this.#schema;
    }

    const schemaConfig: any = {
      query: new GraphQLObjectType({
        name: "Query",
        fields: () => this.queries,
      }),
    };

    if (Object.keys(this.#mutations).length > 0) {
      schemaConfig.mutation = new GraphQLObjectType({
        name: "Mutation",
        fields: () => this.#mutations,
      });
    }

    if (Object.keys(this.#subscriptions).length > 0) {
      schemaConfig.subscription = new GraphQLObjectType({
        name: "Subscription",
        fields: () => this.#subscriptions,
      });
    }

    // Cache the built schema
    this.#schema = new GraphQLSchema(schemaConfig);

    return this.#schema;
  }

  /**
   * Clear all registered modules and fields
   */
  clear() {
    this.#queries = {};
    this.#mutations = {};
    this.#subscriptions = {};
    this.#schema = null;
  }
}
