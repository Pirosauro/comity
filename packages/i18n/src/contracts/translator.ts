/**
 *
 */
export interface Translator {
  /** The current locale of the translator */
  readonly locale: string;

  /**
   * Translates a message key into the corresponding message in the current locale, optionally replacing parameters.
   *
   * @param key The message key to translate
   * @param params Optional parameters to replace in the translated message
   *
   * @returns The translated message with parameters replaced
   */
  t(key: string, params?: Record<string, unknown>): string;
}
