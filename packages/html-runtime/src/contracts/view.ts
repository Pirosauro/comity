/**
 * HTML view contract
 *
 * @typeParam Data - Type of the view model data
 */
export interface HtmlView<Data extends Record<string, unknown> = Record<string, unknown>> {
  /** View model data produced by a presenter. Domain-safe, serializable */
  readonly data: Data;

  /** HTTP-level hints (optional, adapters may override) */
  readonly http?: {
    /** HTTP status code */
    readonly status?: number;

    /** HTTP headers */
    readonly headers?: Record<string, string>;
  };

  /** Optional metadata */
  readonly meta?: {
    /** Localization context */
    locale?: {
      /** Locale identifier */
      id: string;

      /** Text direction */
      direction: "ltr" | "rtl";
    };

    /**  */
    [key: string]: unknown;
  };
}
