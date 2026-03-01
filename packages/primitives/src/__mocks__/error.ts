import { BaseError } from "../error/base.js";

/**
 * A simple error class used for testing purposes.
 */
export class TestError extends BaseError {
  readonly code = "test:error";

  /**
   * @param message - The error message.
   * @param meta - Additional metadata for the error.
   */
  constructor(message: string, meta: Record<string, unknown> = {}) {
    super(message, meta);
  }
}
