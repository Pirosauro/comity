import type { ApplicationErrorOptions } from "./application.js";
import { ApplicationError } from "./application.js";

export class UnauthorizedError extends ApplicationError {
  constructor(message?: string, options?: ApplicationErrorOptions) {
    super(
      message ||
        "You do not have the necessary permissions to perform this action.",
      {
        code: 401,
        ...options,
      }
    );
  }
}
