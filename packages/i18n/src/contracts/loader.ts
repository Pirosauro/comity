/**
 *
 */
export interface I18nLoader<T = Record<string, unknown>> {
  /**
   * Loads the messages for a given locale.
   *
   * @param locale The locale to load messages for
   * @param namespaces Optional array of namespaces to load
   *
   * @returns A promise that resolves to the messages or null if not found
   */
  load(locale: string, namespaces?: string[]): Promise<T | null>;
}
