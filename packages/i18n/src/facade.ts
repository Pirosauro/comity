import type { I18nFacade } from "./contracts/facade.js";
import type { I18nLoader } from "./contracts/loader.js";
import type { Locale } from "./contracts/locale.js";
import type { I18nLocaleResolver } from "./contracts/resolver.js";
import type { Translator } from "./contracts/translator.js";

/**
 *
 */
export interface I18nOptions {
  /** The loader responsible for loading locale messages. */
  loader: I18nLoader;

  /** Factory function to create a translator for a given locale and messages. */
  factory(locale: string, messages: unknown): Translator;

  /** The default locale to be used if no locale is specified. */
  defaultLocale?: Locale;

  /** Functions to resolve a locale from a given input. */
  resolvers?: I18nLocaleResolver[];
}

/**
 * Default implementation of the I18nFacade interface, providing methods to resolve locales and retrieve translators.
 */
export class DefaultI18n implements I18nFacade {
  /** The loader responsible for loading locale messages. */
  #loader: I18nLoader;

  /** Factory function to create a translator for a given locale and messages. */
  #factory: (locale: string, messages: unknown) => Translator;

  /** The default locale to be used if no locale is specified. */
  #defaultLocale: Locale;

  /** Functions to resolve a locale from a given input. */
  #resolvers: I18nLocaleResolver[];

  /**
   * @param options - The options for configuring the I18nFacade.
   */
  constructor(options: I18nOptions) {
    this.#loader = options.loader;
    this.#factory = options.factory;
    this.#defaultLocale = options.defaultLocale ?? { locale: "en", direction: "ltr" };
    this.#resolvers = options.resolvers ?? [];
  }

  /**
   * @inheritdoc
   */
  async resolveLocale(input: string): Promise<Locale> {
    const ctx = { input };

    for (const resolver of this.#resolvers) {
      const result = await resolver(ctx);

      if (result) {
        return result;
      }
    }

    return this.#defaultLocale;
  }

  /**
   * @inheritdoc
   */
  async getTranslator(locale: string): Promise<Translator> {
    try {
      const messages = await this.#loader.load(locale);

      return this.#factory(locale, messages);
    } catch {}

    const fallback = this.#defaultLocale.locale;
    const messages = await this.#loader.load(fallback);

    return this.#factory(fallback, messages);
  }
}
