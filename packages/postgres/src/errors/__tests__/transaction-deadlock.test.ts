import { describe, it, expect } from "vitest";
import { TransactionDeadlockError } from "../transaction-deadlock.js";

describe("TransactionDeadlockError", () => {
  it("should create an error with default message", () => {
    const error = new TransactionDeadlockError();

    expect(error).toBeInstanceOf(TransactionDeadlockError);
    expect(error.message).toBe("Transaction deadlock detected");
    expect(error.name).toBe("PostgresTransactionDeadlockError");
  });

  it("should create an error with custom message", () => {
    const customMessage = "Custom transaction deadlock message";
    const error = new TransactionDeadlockError(customMessage);

    expect(error.message).toBe(customMessage);
    expect(error.name).toBe("PostgresTransactionDeadlockError");
  });

  it("should extend BadRequestError", () => {
    const error = new TransactionDeadlockError();

    // Check that it has the properties of BadRequestError
    expect(error).toHaveProperty("status");
    expect(error.status).toBe(400); // Bad Request status code
  });

  it("should be instanceof Error", () => {
    const error = new TransactionDeadlockError();

    expect(error).toBeInstanceOf(Error);
  });

  it("should have correct stack trace", () => {
    const error = new TransactionDeadlockError();

    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe("string");
    expect(error.stack).toContain("TransactionDeadlockError");
  });
});
