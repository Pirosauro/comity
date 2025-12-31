import { InternalError } from "@comity/core/errors";

export class TransactionFailedError extends InternalError {
  constructor(message = "Transaction failed") {
    super(message, { code: "TRANSACTION_FAILED" });
  }
}
