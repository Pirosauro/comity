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
        if (!field.resolve) {
          field.resolve = (payload: unknown) => payload;
        }

        this.#subscriptions[name] = field;
      }
    }
  }

  /**
   * Build the GraphQL schema from the registered modules
   * @returns The constructed GraphQL schema
   */
  buildSchema(): GraphQLSchema {
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

    return new GraphQLSchema(schemaConfig);
  }

  /**
   * Clear all registered modules and fields
   */
  clear() {
    this.#queries = {};
    this.#mutations = {};
    this.#subscriptions = {};
  }
}
