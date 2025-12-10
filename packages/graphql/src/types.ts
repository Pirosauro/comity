import type { Hono } from "hono";
import type { HonoOptions } from "hono/hono-base";
import type { BlankEnv, BlankSchema, Env, Schema } from "hono/types";
import type { Maybe, Optional, Plugin } from "@envelop/core";
import type {
  GraphQLOutputType,
  GraphQLFieldConfigArgumentMap,
  GraphQLFieldResolver,
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLUnionType,
  GraphQLEnumType,
  GraphQLInputObjectType,
} from "graphql";

// Enhanced context type for better type safety
export interface GraphQLContext {
  readonly request: Request;
  readonly user?: {
    readonly id: string;
    readonly roles?: readonly string[];
    readonly permissions?: readonly string[];
  };
  readonly logger?: {
    readonly info: (message: string, meta?: Record<string, unknown>) => void;
    readonly error: (
      message: string,
      error?: unknown,
      meta?: Record<string, unknown>
    ) => void;
    readonly warn: (message: string, meta?: Record<string, unknown>) => void;
    readonly debug: (message: string, meta?: Record<string, unknown>) => void;
  };
  readonly [key: string]: unknown;
}

// Strict typing for GraphQL types
export type GraphQLType =
  | GraphQLScalarType
  | GraphQLObjectType
  | GraphQLInterfaceType
  | GraphQLUnionType
  | GraphQLEnumType
  | GraphQLInputObjectType;

// Enhanced field config with better type safety
export type FieldConfig<
  TSource = unknown,
  TContext extends GraphQLContext = GraphQLContext,
  TArgs = Record<string, unknown>
> = {
  readonly type: GraphQLOutputType;
  readonly args?: GraphQLFieldConfigArgumentMap;
  readonly resolve?: GraphQLFieldResolver<TSource, TContext, TArgs>;
  readonly description?: string;
  readonly deprecationReason?: string;
  readonly extensions?: Readonly<Record<string, unknown>>;
};

// Enhanced subscription field config
export type SubscriptionFieldConfig<
  TSource = unknown,
  TContext extends GraphQLContext = GraphQLContext,
  TArgs = Record<string, unknown>
> = {
  readonly type: GraphQLOutputType;
  readonly resolve: GraphQLFieldResolver<TSource, TContext, TArgs>;
  readonly subscribe: GraphQLFieldResolver<TSource, TContext, TArgs>;
  readonly args?: GraphQLFieldConfigArgumentMap;
  readonly description?: string;
  readonly deprecationReason?: string;
  readonly extensions?: Readonly<Record<string, unknown>>;
};

// Strict GraphQL module interface
export interface GraphQLModule<
  TContext extends GraphQLContext = GraphQLContext
> {
  readonly queries?: Readonly<Record<string, FieldConfig<unknown, TContext>>>;
  readonly mutations?: Readonly<Record<string, FieldConfig<unknown, TContext>>>;
  readonly subscriptions?: Readonly<
    Record<string, SubscriptionFieldConfig<unknown, TContext>>
  >;
}

// Validation result type
export interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly ValidationError[];
}

export interface ValidationError {
  readonly field: string;
  readonly message: string;
  readonly code: string;
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
