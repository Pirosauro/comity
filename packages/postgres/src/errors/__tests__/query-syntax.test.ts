import { describe, it, expect } from "vitest";
import { QuerySyntaxError } from "../query-syntax.js";

describe("QuerySyntaxError", () => {
  it("should create an error with default message", () => {
    const error = new QuerySyntaxError();

    expect(error).toBeInstanceOf(QuerySyntaxError);
    expect(error.message).toBe("Invalid SQL query syntax");
    expect(error.name).toBe("PostgresQuerySyntaxError");
  });

  it("should create an error with custom message", () => {
    const customMessage = "Custom query syntax error message";
    const error = new QuerySyntaxError(customMessage);

    expect(error.message).toBe(customMessage);
    expect(error.name).toBe("PostgresQuerySyntaxError");
  });

  it("should extend BadRequestError", () => {
    const error = new QuerySyntaxError();

    // Check that it has the properties of BadRequestError
    expect(error).toHaveProperty("status");
    expect(error.status).toBe(400); // Bad Request status code
  });

  it("should be instanceof Error", () => {
    const error = new QuerySyntaxError();

    expect(error).toBeInstanceOf(Error);
  });

  it("should have correct stack trace", () => {
    const error = new QuerySyntaxError();

    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe("string");
    expect(error.stack).toContain("QuerySyntaxError");
  });
});
