import type { ErrorMeta } from "./base.js";

import { BaseError } from "./base.js";

export class UnprocessableEntityError extends BaseError {
  readonly code = "UNPROCESSABLE_ENTITY";

  constructor(message = "Unprocessable Entity", meta?: ErrorMeta) {
    super(message, {
      httpStatus: 422,
      ...meta,
    });
  }
}
