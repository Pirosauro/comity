import type { Hono } from "hono";
import type { HonoOptions } from "hono/hono-base";
import type { BlankEnv, BlankSchema, Env, Schema } from "hono/types";
import type { Maybe, Optional, Plugin } from "@envelop/core";
import type {
  GraphQLOutputType,
  GraphQLFieldConfigArgumentMap,
  GraphQLFieldResolver,
} from "graphql";

export type FieldConfig<S = any, C = any, A = any> = {
  type: GraphQLOutputType;
  args?: GraphQLFieldConfigArgumentMap;
  resolve?: GraphQLFieldResolver<S, C, A>;
  description?: Maybe<string>;
  deprecationReason?: Maybe<string>;
};

export type SubscriptionFieldConfig<S = any, C = any, A = any> = {
  type: GraphQLOutputType;
  resolve: GraphQLFieldResolver<S, C, A>;
  subscribe: GraphQLFieldResolver<S, C, A>;
  args?: GraphQLFieldConfigArgumentMap;
  description?: Maybe<string>;
  deprecationReason?: Maybe<string>;
};

export interface GraphQLModule {
  queries?: Record<string, FieldConfig>;
  mutations?: Record<string, FieldConfig>;
  subscriptions?: Record<string, SubscriptionFieldConfig>;
}

export interface GraphQLParams {
  query: string | null;
  variables: { readonly [name: string]: unknown } | null;
  operationName: string | null;
  raw: boolean;
}

export type GraphQLModuleOptions<E extends Env = BlankEnv> = HonoOptions<E> & {
  path?: string;
  plugins?: Optional<Plugin>[];
  enableInternalTracing?: boolean;
};

export type ErrorContext = "auth" | "query" | "input" | "system" | "http";

export type GraphQLModuleEvents = {
  "@comity/graphql:error": {
    error: unknown;
    context: ErrorContext;
    ip?: string;
    userAgent?: string;
  };
};

/**
 * Hooks triggered by the GraphQL module.
 *
 * These events allow other modules to react to GraphQL-related
 * actions and access the GraphQL service.
 */
export type GraphQLModuleHooks<
  E extends Env = BlankEnv,
  S extends Schema = BlankSchema
> = {
  /**
   * Emitted when the GraphQL module is fully initialized and ready.
   * Provides the Hono instance for other modules to use.
   */
  "@comity/graphql:initialized": Pick<
    Hono<E, S, "/">,
    | "get"
    | "post"
    | "put"
    | "delete"
    | "options"
    | "patch"
    | "all"
    | "use"
    | "on"
    | "route"
    | "mount"
    | "fetch"
    | "request"
    | "notFound"
    | "onError"
  > & {
    register: (module: GraphQLModule) => void;
  };
};
