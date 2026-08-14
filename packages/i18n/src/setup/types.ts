import type { ModuleSetupContext } from "@comity/composition/setup";
import type { I18nFacade } from "../contracts/facade.js";
import type { I18nOptions } from "../facade.js";
import type { I18N_TOKEN } from "./constants.js";

/** Hooks exposed by the module */
export type I18nModuleHooks = {
  /** Executed during module setup, allows modifying initial configuration */
  "@comity/i18n:configuring": I18nModuleOptions;

  /** Executed when the i18n module is initialized. */
  "@comity/i18n:initialized": undefined;
};

/** Events emitted by the module */
export type I18nModuleEvents = {};

/**
 * Services exposed by the module
 */
export type I18nModuleServices = {
  /** i18n facade token */
  [I18N_TOKEN]: I18nFacade;
};

/**
 * Context provided to the i18n module setup function.
 */
export interface I18nModuleContext extends ModuleSetupContext<
  I18nModuleServices,
  I18nModuleEvents,
  I18nModuleHooks
> {}

/** i18n module setup options */
export type I18nModuleOptions = Partial<I18nOptions>;
