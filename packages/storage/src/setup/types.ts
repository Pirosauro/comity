import type { ModuleSetupContext } from "@comity/composition";
import type { Storage } from "../contracts/storage.js";
import type { StorageStore } from "../contracts/store.js";
import type { STORAGE_TOKEN } from "./constants.js";

/** Hooks exposed by the module */
export type StorageModuleHooks = {
  /** Executed during module setup, allows modifying initial configuration */
  "@comity/storage:configuring": StorageModuleOptions;

  /** Executed when the storage module is initialized. */
  "@comity/storage:initialized": undefined;
};

/** Events emitted by the module */
export type StorageModuleEvents = {};

/**
 * Services exposed by the module
 */
export type StorageModuleServices = {
  /** Storage facade token */
  [STORAGE_TOKEN]: Storage;
};

/**
 * Context provided to the storage module setup function.
 */
export interface StorageModuleContext extends ModuleSetupContext<
  StorageModuleServices,
  StorageModuleEvents,
  StorageModuleHooks
> {}

/** Storage module setup options */
export type StorageModuleOptions = {
  /** Storage store implementation */
  store?: StorageStore;
};
