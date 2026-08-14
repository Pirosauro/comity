import type { ModuleSetupContext } from "@comity/composition/setup";

/** Hooks exposed by the module */
export type I18nTypesafeModuleHooks = {};

/** Events emitted by the module */
export type I18nTypesafeModuleEvents = {};

/**
 * Services exposed by the module
 */
export type I18nTypesafeModuleServices = {};

/**
 * Context provided to the i18n module setup function.
 */
export interface I18nTypesafeModuleContext extends ModuleSetupContext<
  I18nTypesafeModuleServices,
  I18nTypesafeModuleEvents,
  I18nTypesafeModuleHooks
> {}

/** i18n module setup options */
export type I18nTypesafeModuleOptions = {
  /** Async loader for locale messages */
  loadLocaleAsync(locale: string, namespaces?: string[]): Promise<unknown>;

  /** Factory that creates the typesafe-i18n instance */
  createI18n(
    locale: string,
    messages: unknown
  ): {
    /**
     * Translates a key using the provided parameters.
     */
    t(key: string, params?: Record<string, unknown>): string;
  };
};
