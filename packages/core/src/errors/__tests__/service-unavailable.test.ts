import { describe, it, expect } from "vitest";
import { ServiceUnavailableError } from "../service-unavailable.js";

describe("ServiceUnavailableError", () => {
  it("should create error with default message", () => {
    const error = new ServiceUnavailableError(
      "Service temporarily unavailable"
    );

    expect(error.message).toBe("Service temporarily unavailable");
    expect(error.code).toBe("SERVICE_UNAVAILABLE");
    expect(error.name).toBe("ServiceUnavailableError");
    expect(error.meta.httpStatus).toBe(503);
  });

  it("should create error with custom message", () => {
    const error = new ServiceUnavailableError(
      "Custom service unavailable message"
    );

    expect(error.message).toBe("Custom service unavailable message");
    expect(error.code).toBe("SERVICE_UNAVAILABLE");
    expect(error.meta.httpStatus).toBe(503);
  });

  it("should include additional metadata", () => {
    const error = new ServiceUnavailableError("Database maintenance", {
      service: "database",
      maintenance: true,
      retryAfter: 3600,
    });

    expect(error.meta.service).toBe("database");
    expect(error.meta.maintenance).toBe(true);
    expect(error.meta.retryAfter).toBe(3600);
    expect(error.meta.httpStatus).toBe(503);
  });

  it("should be instanceof Error", () => {
    const error = new ServiceUnavailableError("Test");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ServiceUnavailableError);
  });

  it("should have correct stack trace", () => {
    const error = new ServiceUnavailableError("Test");

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain("ServiceUnavailableError");
  });
});
