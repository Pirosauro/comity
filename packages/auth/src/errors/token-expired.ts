import { UnauthorizedError } from "@comity/core/errors";

export class TokenExpiredError extends UnauthorizedError {
  constructor(message = "Token is expired") {
    super(message);

    this.name = "TokenExpiredError";
  }
}
