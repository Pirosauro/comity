import { InternalError } from "@comity/core/errors";

export class DatabaseUnavailableError extends InternalError {
  constructor(message = "Database service unavailable") {
    super(message, { code: "DATABASE_UNAVAILABLE" });
  }
}
