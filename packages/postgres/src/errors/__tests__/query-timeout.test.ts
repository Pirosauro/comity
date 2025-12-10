import { describe, it, expect } from "vitest";
import { QueryTimeoutError } from "../query-timeout.js";

describe("QueryTimeoutError", () => {
  it("should create an error with default message", () => {
    const error = new QueryTimeoutError();

    expect(error).toBeInstanceOf(QueryTimeoutError);
    expect(error.message).toBe("Query execution timeout");
    expect(error.name).toBe("PostgresQueryTimeoutError");
  });

  it("should create an error with custom message", () => {
    const customMessage = "Custom query timeout message";
    const error = new QueryTimeoutError(customMessage);

    expect(error.message).toBe(customMessage);
    expect(error.name).toBe("PostgresQueryTimeoutError");
  });

  it("should extend ServiceUnavailableError", () => {
    const error = new QueryTimeoutError();

    // Check that it has the properties of ServiceUnavailableError
    expect(error).toHaveProperty("status");
    expect(error.status).toBe(503); // Service Unavailable status code
  });

  it("should be instanceof Error", () => {
    const error = new QueryTimeoutError();

    expect(error).toBeInstanceOf(Error);
  });

  it("should have correct stack trace", () => {
    const error = new QueryTimeoutError();

    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe("string");
    expect(error.stack).toContain("QueryTimeoutError");
  });
});
