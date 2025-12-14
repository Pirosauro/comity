import { describe, it, expect } from "vitest";
import * as errorsModule from "../index.js";

describe("errors/index.ts exports", () => {
  it("should export ConnectionPoolExhaustedError", () => {
    expect(errorsModule).toHaveProperty("ConnectionPoolExhaustedError");
  });

  it("should export ConnectionError", () => {
    expect(errorsModule).toHaveProperty("ConnectionError");
  });

  it("should export ConstraintViolationError", () => {
    expect(errorsModule).toHaveProperty("ConstraintViolationError");
  });

  it("should export InsufficientPermissionsError", () => {
    expect(errorsModule).toHaveProperty("InsufficientPermissionsError");
  });

  it("should export QuerySyntaxError", () => {
    expect(errorsModule).toHaveProperty("QuerySyntaxError");
  });

  it("should export QueryTimeoutError", () => {
    expect(errorsModule).toHaveProperty("QueryTimeoutError");
  });

  it("should export TransactionDeadlockError", () => {
    expect(errorsModule).toHaveProperty("TransactionDeadlockError");
  });

  it("should export TransactionSerializationError", () => {
    expect(errorsModule).toHaveProperty("TransactionSerializationError");
  });
});

