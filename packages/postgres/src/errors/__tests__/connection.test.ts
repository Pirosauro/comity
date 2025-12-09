import { describe, it, expect } from "vitest";
import { DatabaseConnectionError } from "../connection.js";

describe("DatabaseConnectionError", () => {
  it("should create error with default message", () => {
    const error = new DatabaseConnectionError();

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("DatabaseConnectionError");
    expect(error.message).toBe("Database connection failed");
  });

  it("should create error with custom message", () => {
    const customMessage = "Connection timeout after 5000ms";
    const error = new DatabaseConnectionError(customMessage);

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("DatabaseConnectionError");
    expect(error.message).toBe(customMessage);
  });

  it("should be throwable and catchable", () => {
    const customMessage = "Database server unreachable";

    expect(() => {
      throw new DatabaseConnectionError(customMessage);
    }).toThrow(DatabaseConnectionError);

    expect(() => {
      throw new DatabaseConnectionError(customMessage);
    }).toThrow(customMessage);
  });

  it("should maintain error stack", () => {
    const error = new DatabaseConnectionError("Test error");

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain("DatabaseConnectionError");
  });
});
