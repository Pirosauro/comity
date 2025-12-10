import { describe, it, expect } from "vitest";
import { ConnectionPoolExhaustedError } from "../connection-pool-exhausted.js";

describe("ConnectionPoolExhaustedError", () => {
  it("should create an error with default message", () => {
    const error = new ConnectionPoolExhaustedError();

    expect(error).toBeInstanceOf(ConnectionPoolExhaustedError);
    expect(error.message).toBe("Database connection pool exhausted");
    expect(error.name).toBe("PostgresConnectionPoolExhaustedError");
  });

  it("should create an error with custom message", () => {
    const customMessage = "Custom pool exhausted message";
    const error = new ConnectionPoolExhaustedError(customMessage);

    expect(error.message).toBe(customMessage);
    expect(error.name).toBe("PostgresConnectionPoolExhaustedError");
  });

  it("should extend ServiceUnavailableError", () => {
    const error = new ConnectionPoolExhaustedError();

    // Check that it has the properties of ServiceUnavailableError
    expect(error).toHaveProperty("status");
    expect(error.status).toBe(503); // Service Unavailable status code
  });

  it("should be instanceof Error", () => {
    const error = new ConnectionPoolExhaustedError();

    expect(error).toBeInstanceOf(Error);
  });

  it("should have correct stack trace", () => {
    const error = new ConnectionPoolExhaustedError();

    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe("string");
    expect(error.stack).toContain("ConnectionPoolExhaustedError");
  });
});
