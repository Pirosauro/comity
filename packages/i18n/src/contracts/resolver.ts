import type { Locale } from "./locale.js";

/**
 * Options for configuring the I18nFacade, including the loader, factory, default locale, and optional resolvers and RTL function.
 */
export interface I18nResolveContext {
  /** The input string to resolve the locale from. */
  input?: string;
}

/**
 * A function that resolves a locale from a given context.
 */
export type I18nLocaleResolver = (
  ctx: I18nResolveContext
) => Locale | null | Promise<Locale | null>;
