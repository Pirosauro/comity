import type { ModuleSetupContext } from "@comity/composition/setup";
import type { KvNamespace } from "../types.js";

/** Hooks exposed by the module */
export type KvCacheModuleHooks = {};

/** Events emitted by the module */
export type KvCacheModuleEvents = {};

/**
 * Services exposed by the module
 */
export type KvCacheModuleServices = {};

/**
 * Context provided to the cache module setup function.
 */
export interface KvCacheModuleContext extends ModuleSetupContext<
  KvCacheModuleServices,
  KvCacheModuleEvents,
  KvCacheModuleHooks
> {}

/** Cache module setup options */
export type KvCacheModuleOptions = {
  /** Namespace to use for cache storage. */
  ns: KvNamespace;
};
