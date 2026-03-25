import type { I18nLoader } from "@comity/i18n";

/**
 * A loader class that implements the I18nLoader interface, allowing for the loading of locale messages using a provided asynchronous function.
 */
export class TypesafeI18nLoader<T = unknown> implements I18nLoader<T> {
  /**  */
  #load: (locale: string) => Promise<T>;

  /**
   * @param load - A function that takes a locale string and returns a promise that resolves to the messages for that locale.
   */
  constructor(load: (locale: string) => Promise<T>) {
    this.#load = load;
  }

  /**
   * Loads the messages for a given locale by invoking the provided load function.
   *
   * @param locale - The locale for which to load the messages.
   *
   * @returns A promise that resolves to the messages for the specified locale, or null if loading fails.
   */
  load(locale: string): Promise<T | null> {
    return this.#load(locale);
  }
}
