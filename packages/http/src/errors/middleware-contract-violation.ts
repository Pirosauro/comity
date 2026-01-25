import { BaseError } from "@comity/primitives/errors";

/**
 * HTTP middleware contract violation error.
 *
 * @comity ai-jsdoc-skip
 */
export class HttpMiddlewareContractViolationError extends BaseError {
  readonly code = "http:middleware-contract-violation";

  /**
   * @param message - Error message.
   * @param meta - Additional error metadata.
   */
  constructor(message: string, meta?: Record<string, unknown>) {
    super(message, {
      httpStatus: 500,
      ...meta,
    });
  }
}
