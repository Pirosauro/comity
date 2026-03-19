import type { ModuleSetupContext } from "@comity/composition";
import type { GraphqlClient } from "../client.js";
import type { GraphqlTransport } from "../index.js";
import type { GRAPHQL_CLIENT_TOKEN } from "./constants.js";

/** Hooks exposed by the module */
export type GraphqlClientModuleHooks = {
  /** Executed during module setup, allows modifying initial configuration */
  "@comity/graphql-client:configuring": GraphqlClientModuleOptions;

  /** Executed when the GraphQL client module is initialized. */
  "@comity/graphql-client:initialized": undefined;
};

/** Events emitted by the module */
export type GraphqlClientModuleEvents = {};

/**
 * Services exposed by the module
 */
export type GraphqlClientModuleServices = {
  /** GraphQL client facade token */
  [GRAPHQL_CLIENT_TOKEN]: GraphqlClient;
};

/**
 * Context provided to the GraphQL client module setup function.
 */
export interface GraphqlClientModuleContext extends ModuleSetupContext<
  GraphqlClientModuleServices,
  GraphqlClientModuleEvents,
  GraphqlClientModuleHooks
> {}

/** GraphQL client module setup options */
export type GraphqlClientModuleOptions = {
  /** GraphQL client implementation */
  transport?: GraphqlTransport;
};
