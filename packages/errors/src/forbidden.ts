import type { ApplicationErrorOptions } from "./application.js";
import { ApplicationError } from "./application.js";

export class ForbiddenError extends ApplicationError {
  constructor(message?: string, options?: ApplicationErrorOptions) {
    super(message || "Access to this resource is not allowed.", {
      code: 403,
      ...options,
    });
  }
}
