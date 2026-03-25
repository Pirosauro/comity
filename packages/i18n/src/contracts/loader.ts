/**
 *
 */
export interface I18nLoader<T = Record<string, unknown>> {
  /** Loads the messages for a given locale. */
  load(locale: string): Promise<T | null>;
}
