import type { ErrorMeta } from "@comity/primitives/error";

import { BaseError } from "@comity/primitives/error";

/**
 * HTTP error reasons.
 */
export type HttpErrorReason =
  | "pipeline_contract_violation"
  | "middleware_contract_violation"
  | "invalid_lifecycle_state"
  | "internal_error";

/**
 * HTTP Error metadata.
 */
export interface HttpErrorMeta extends ErrorMeta {
  /** The reason for the HTTP error */
  readonly reason: HttpErrorReason;
}

/** Error messages for HTTP errors */
const REASON_MESSAGES: Record<HttpErrorReason, string> = {
  pipeline_contract_violation: "HTTP pipeline contract violation",
  middleware_contract_violation: "HTTP middleware contract violation",
  invalid_lifecycle_state: "Invalid lifecycle state for HTTP action",
  internal_error: "Internal HTTP error",
};
/** HTTP status codes for HTTP errors */
const REASON_HTTP_STATUS: Record<HttpErrorReason, number> = {
  pipeline_contract_violation: 500,
  middleware_contract_violation: 500,
  invalid_lifecycle_state: 409, // Conflict
  internal_error: 500,
};

/**
 * HTTP Error.
 */
export class HttpError extends BaseError<HttpErrorMeta> {
  /** Error code */
  readonly code: `http:${HttpErrorReason}`;

  /**
   * @param reason - The reason for the HTTP error.
   * @param meta - Additional metadata for the error.
   */
  constructor(reason: HttpErrorReason, meta?: Omit<HttpErrorMeta, "reason">) {
    super(REASON_MESSAGES[reason], {
      httpStatus: REASON_HTTP_STATUS[reason],
      ...meta,
      reason,
    });

    this.code = `http:${reason}`;
  }
}
