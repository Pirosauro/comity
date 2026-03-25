import type { HttpStatus } from "@comity/http";

/**
 *
 */
export interface ApplicationContract<
  Data = unknown,
  Ctx extends Record<string, unknown> = Record<string, unknown>,
> {
  /** Data for the view */
  readonly data?: Data;

  /** HTTP info */
  readonly http?: {
    /** HTTP status code */
    readonly status?: HttpStatus;

    /** HTTP headers */
    readonly headers?: Record<string, string>;
  };

  /** View override (optional) */
  readonly view?: unknown;

  /** Context data */
  readonly context?: Ctx;
}
