/**
 *
 */
export interface Translator {
  /**
   *
   */
  t(key: string, params?: Record<string, unknown>): string;

  /**
   *
   */
  locale(): string;
}
