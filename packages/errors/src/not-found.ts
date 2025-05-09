import type { ApplicationErrorOptions } from "./application.js";
import { ApplicationError } from "./application.js";

export class NotFoundError extends ApplicationError {
  constructor(message?: string, options?: ApplicationErrorOptions) {
    super(
      message || "The requested resource could not be located on the server.",
      {
        code: 404,
        ...options,
      }
    );
  }
}
