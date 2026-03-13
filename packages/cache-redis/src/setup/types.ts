import type { ModuleSetupContext } from "@comity/composition";
import type { RedisClient } from "../types.js";

/** Hooks exposed by the module */
export type RedisCacheModuleHooks = {};

/** Events emitted by the module */
export type RedisCacheModuleEvents = {};

/**
 * Services exposed by the module
 */
export type RedisCacheModuleServices = {};

/**
 * Context provided to the cache module setup function.
 */
export interface RedisCacheModuleContext extends ModuleSetupContext<
  RedisCacheModuleServices,
  RedisCacheModuleEvents,
  RedisCacheModuleHooks
> {}

/** Cache module setup options */
export type RedisCacheModuleOptions = {
  /** Redis client to use for cache operations. */
  client: RedisClient;
};
