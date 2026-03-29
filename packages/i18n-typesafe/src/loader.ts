import type { I18nLoader } from "@comity/i18n";

/**
 * A loader class that implements the I18nLoader interface, allowing for the loading of locale messages using a provided asynchronous function.
 */
export class TypesafeI18nLoader<T = unknown> implements I18nLoader<T> {
  /**  */
  #load: (locale: string, namespaces?: string[]) => Promise<T>;

  /**
   * @param load - A function that takes a locale string and an optional array of namespaces, and returns a promise that resolves to the messages for that locale.
   */
  constructor(load: (locale: string, namespaces?: string[]) => Promise<T>) {
    this.#load = load;
  }

  /**
   * @inheritdoc
   */
  load(locale: string, namespaces?: string[]): Promise<T | null> {
    return this.#load(locale, namespaces);
  }
}
