import { describe, it, expect } from "vitest";
import { ConnectionError } from "../connection.js";

describe("ConnectionError", () => {
  it("should create error with default message", () => {
    const error = new ConnectionError();

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("PostgresConnectionError");
    expect(error.message).toBe("Database connection failed");
  });

  it("should create error with custom message", () => {
    const customMessage = "Connection timeout after 5000ms";
    const error = new ConnectionError(customMessage);

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("PostgresConnectionError");
    expect(error.message).toBe(customMessage);
  });

  it("should be throwable and catchable", () => {
    const customMessage = "Database server unreachable";

    expect(() => {
      throw new ConnectionError(customMessage);
    }).toThrow(ConnectionError);

    expect(() => {
      throw new ConnectionError(customMessage);
    }).toThrow(customMessage);
  });

  it("should maintain error stack", () => {
    const error = new ConnectionError("Test error");

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain("ConnectionError");
  });
});
