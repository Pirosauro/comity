import type { Locale } from "./locale.js";
import type { Translator } from "./translator.js";

/**
 * Options for configuring the translator.
 */
export type TranslatorOptions = {
  /** Optional namespaces to be used for translations */
  namespaces?: string[];
};

/**
 * Facade for i18n operations, providing methods to resolve locales and retrieve translators.
 */
export interface I18nFacade {
  /**
   * Resolves the locale to be used for translations.
   *
   * @param input Optional locale input. If not provided, the default locale will be used.
   *
   * @returns A promise that resolves to the resolved locale.
   */
  resolveLocale(input?: string): Promise<Locale>;

  /**
   * Retrieves a translator for the specified locale.
   *
   * @param locale The locale for which to retrieve the translator.
   * @param options Optional translator options, such as namespaces to be used for translations.
   *
   * @returns A promise that resolves to the translator for the specified locale.
   */
  getTranslator(locale: string, options?: TranslatorOptions): Promise<Translator>;
}
