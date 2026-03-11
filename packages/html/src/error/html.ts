import type { HttpStatus } from "@comity/http";
import type { ErrorMeta } from "@comity/primitives/error";

import { BaseError } from "@comity/primitives/error";

/**
 * Reasons for HTML rendering errors.
 */
export type HtmlErrorReason = "no_renderer" | "render_error" | "timeout";

/**
 * Metadata for HTML rendering errors.
 */
export interface HtmlErrorMeta extends ErrorMeta {
  /** Reason for the HTML rendering error */
  readonly reason: HtmlErrorReason;
}

const REASON_MESSAGES: Record<HtmlErrorReason, string> = {
  no_renderer: "No renderer available for the requested view",
  render_error: "An error occurred while rendering the view",
  timeout: "The rendering process timed out",
};

const REASON_HTTP_STATUS: Record<HtmlErrorReason, HttpStatus> = {
  no_renderer: 500,
  render_error: 500,
  timeout: 504,
};

/**
 * HTML rendering error
 */
export class HtmlError extends BaseError<HtmlErrorMeta> {
  /** Error code */
  readonly code: `html:${HtmlErrorReason}`;

  /**
   * @param reason - The reason for the HTML rendering error
   * @param meta - Additional metadata for the error
   */
  constructor(reason: HtmlErrorReason, meta?: Omit<HtmlErrorMeta, "reason">) {
    super(REASON_MESSAGES[reason], {
      httpStatus: REASON_HTTP_STATUS[reason],
      ...meta,
      reason,
    });

    this.code = `html:${reason}`;
  }
}
