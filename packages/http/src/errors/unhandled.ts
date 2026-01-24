import { BaseError } from "@comity/primitives/errors";

/**
 * Unhandled HTTP error
 */
export class HttpUnhandledError extends BaseError {
  /** Error code */
  readonly code = "http:unhandled-error";

  /**
   * Constructor
   *
   * @param message
   * @param meta - Error metadata
   */
  constructor(
    message = "An unhandled error occurred during HTTP processing",
    meta: Record<string, unknown> = {}
  ) {
    super(message, meta);
  }
}
