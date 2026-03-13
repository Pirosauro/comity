import type { ModuleSetupContext } from "@comity/composition";
import type { Cache } from "../contracts/cache.js";
import type { CacheStore } from "../contracts/store.js";
import type { CacheObserver } from "../hooks/cache.js";
import type { CACHE_TOKEN } from "./constants.js";

/** Hooks exposed by the module */
export type CacheModuleHooks = {
  /** Executed during module setup, allows modifying initial configuration */
  "@comity/cache:configuring": CacheModuleOptions;

  /** Executed when the cache module is initialized. */
  "@comity/cache:initialized": undefined;
};

/** Events emitted by the module */
export type CacheModuleEvents = {
  /** Emitted when a cache entry is created or updated */
  "@comity/cache:set": Parameters<CacheObserver["onCacheSet"]>[0];

  /** Emitted when a cache entry is deleted */
  "@comity/cache:delete": Parameters<CacheObserver["onCacheDelete"]>[0];

  /** Emitted when the cache is cleared */
  "@comity/cache:clear": void;

  /** Emitted when a cache entry is hit */
  "@comity/cache:hit": Parameters<CacheObserver["onCacheHit"]>[0];

  /** Emitted when a cache entry is missed */
  "@comity/cache:miss": Parameters<CacheObserver["onCacheMiss"]>[0];
};

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
