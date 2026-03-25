import type { Translator } from "@comity/i18n";

/**
 *
 * @param createI18n
 */
export function createTypesafeFactory(
  createI18n: (
    locale: string,
    messages: unknown
  ) => {
    /**   */
    t(key: string, params?: Record<string, unknown>): string;
  }
) {
  return (locale: string, messages: unknown): Translator => {
    const instance = createI18n(locale, messages);

    return {
      /**
       * @inheritdoc
       */
      locale() {
        return locale;
      },

      /**
       * @inheritdoc
       */
      t(key, params) {
        return instance.t(key, params);
      },
    };
  };
}
