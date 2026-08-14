import type { ModuleSetupContext } from "@comity/composition/setup";
import type { GraphqlClient, GraphqlTransport } from "@comity/graphql-client";
import type { StorefrontContextResolver } from "@comity/storefront";
import type { GRAPHQL_CLIENT_MAGENTO_TOKEN } from "./constants.js";

/** Hooks exposed by the module */
export type StorefrontMagentoModuleHooks = {
  /** Executed during module setup, allows modifying initial configuration */
  "@comity/storefront-magento:configuring": StorefrontMagentoModuleOptions;

  /** Executed when the module is initialized. */
  "@comity/storefront-magento:initialized": undefined;
};

/** Events emitted by the module */
export type StorefrontMagentoModuleEvents = {};

/**
 * Services exposed by the module
 */
export type StorefrontMagentoModuleServices = {
  /** GraphQL client token */
  [GRAPHQL_CLIENT_MAGENTO_TOKEN]: GraphqlClient;
};

/**
 * Context provided to the Magento catalog module setup function.
 */
export interface StorefrontMagentoModuleContext extends ModuleSetupContext<
  StorefrontMagentoModuleServices,
  StorefrontMagentoModuleEvents,
  StorefrontMagentoModuleHooks
> {}

/**
 * Options for enabling/disabling specific features of the Magento storefront module.
 */
type FeatureOptions = {
  /** Enable route resolver */
  routes?: boolean;

  /** Enable repository */
  repository?: boolean;
};

/**
 * GraphQL client options required by the Magento integration.
 */
interface GraphqlClientOptions {
  /** Transport used for executing Magento GraphQL operations. */
  readonly transport: GraphqlTransport;
}

/**
 * Options for setting up the Magento catalog module.
 */
export interface StorefrontMagentoModuleOptions extends Record<string, unknown> {
  /** GraphQL endpoint for the Magento storefront */
  readonly graphql: GraphqlClientOptions;

  /** Features to enable */
  readonly features?: Readonly<{
    /** Enable category service */
    category?: FeatureOptions;

    /** Enable page service */
    content?: FeatureOptions;

    /** Enable product service */
    product?: FeatureOptions;

    /** Enable search service */
    search?: FeatureOptions;
  }>;

  /** Context resolver for the storefront */
  readonly contextResolver?: StorefrontContextResolver;
}
