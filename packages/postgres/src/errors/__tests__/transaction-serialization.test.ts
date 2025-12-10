import { describe, it, expect } from "vitest";
import { TransactionSerializationError } from "../transaction-serialization.js";

describe("TransactionSerializationError", () => {
  it("should create an error with default message", () => {
    const error = new TransactionSerializationError();

    expect(error).toBeInstanceOf(TransactionSerializationError);
    expect(error.message).toBe("Transaction serialization conflict");
    expect(error.name).toBe("PostgresTransactionSerializationError");
  });

  it("should create an error with custom message", () => {
    const customMessage = "Custom transaction serialization message";
    const error = new TransactionSerializationError(customMessage);

    expect(error.message).toBe(customMessage);
    expect(error.name).toBe("PostgresTransactionSerializationError");
  });

  it("should extend BadRequestError", () => {
    const error = new TransactionSerializationError();

    // Check that it has the properties of BadRequestError
    expect(error).toHaveProperty("status");
    expect(error.status).toBe(400); // Bad Request status code
  });

  it("should be instanceof Error", () => {
    const error = new TransactionSerializationError();

    expect(error).toBeInstanceOf(Error);
  });

  it("should have correct stack trace", () => {
    const error = new TransactionSerializationError();

    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe("string");
    expect(error.stack).toContain("TransactionSerializationError");
  });
});
