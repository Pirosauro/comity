import { BaseError } from "@comity/primitives/errors";

/**
 *
 */
export class HttpMiddlewareContractViolationError extends BaseError {
  readonly code = "http:middleware-contract-violation";

  /**
   *
   * @param message
   * @param meta
   */
  constructor(message: string, meta?: Record<string, unknown>) {
    super(message, {
      httpStatus: 500,
      ...meta,
    });
  }
}
