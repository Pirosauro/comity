/**
 * HTML Contract
 */
export interface HtmlContract<
  Data extends Record<string, unknown> = Record<string, unknown>,
> {
  /** Operation success */
  readonly success: boolean;

  /** View model data produced by a presenter. Domain-safe, serializable */
  readonly data: Data;

  /**
   * Localization context
   */
  readonly locale: {
    /** Locale identifier */
    readonly locale: string;

    /** Text direction */
    readonly direction: "ltr" | "rtl";
  };

  /** HTTP-level hints (optional, adapters may override) */
  readonly http?: {
    /** HTTP status code */
    readonly status?: number;

    /** HTTP headers */
    readonly headers?: Record<string, string>;
  };
}
