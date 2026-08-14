import type { ModuleSetupContext } from "@comity/composition/setup";
import type { Cache } from "../contracts/cache.js";
import type { CacheStore } from "../contracts/store.js";
import type { CACHE_TOKEN } from "./constants.js";

/** Hooks exposed by the module */
export type CacheModuleHooks = {
  /** Executed during module setup, allows modifying initial configuration */
  "@comity/cache:configuring": CacheModuleOptions;

  /** Executed when the cache module is initialized. */
  "@comity/cache:initialized": undefined;
};

/** Events emitted by the module */
export type CacheModuleEvents = {};

/**
 * Services exposed by the module
 */
export type CacheModuleServices = {
  /** Cache facade token */
  [CACHE_TOKEN]: Cache;
};

/**
 * Context provided to the cache module setup function.
 */
export interface CacheModuleContext extends ModuleSetupContext<
  CacheModuleServices,
  CacheModuleEvents,
  CacheModuleHooks
> {}

/** Cache module setup options */
export type CacheModuleOptions = {
  /** Cache store implementation */
  store?: CacheStore;
};
