import type { ApplicationErrorOptions } from "./application.js";
import { ApplicationError } from "./application.js";

export class BadRequestError extends ApplicationError {
  constructor(message?: string, options?: ApplicationErrorOptions) {
    super(
      message ||
        "The request could not be understood or was missing required parameters.",
      { code: 400, ...options }
    );
  }
}
