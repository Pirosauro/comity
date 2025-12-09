import { UnauthorizedError } from "@comity/core/errors";

export class TokenInvalidError extends UnauthorizedError {
  constructor(message = "Token is invalid or malformed") {
    super(message);

    this.name = "TokenInvalidError";
  }
}
