import { describe, it, expect } from "vitest";
import { TooManyRequestsError } from "../too-many-requests.js";

describe("TooManyRequestsError", () => {
  it("should create error with default message", () => {
    const error = new TooManyRequestsError("Rate limit exceeded");

    expect(error.message).toBe("Rate limit exceeded");
    expect(error.code).toBe("TOO_MANY_REQUESTS");
    expect(error.name).toBe("TooManyRequestsError");
    expect(error.meta.httpStatus).toBe(429);
  });

  it("should create error with custom message", () => {
    const error = new TooManyRequestsError("Custom rate limit message");

    expect(error.message).toBe("Custom rate limit message");
    expect(error.code).toBe("TOO_MANY_REQUESTS");
    expect(error.meta.httpStatus).toBe(429);
  });

  it("should include additional metadata", () => {
    const error = new TooManyRequestsError("API quota exceeded", {
      limit: 1000,
      remaining: 0,
      resetTime: "2024-01-01T00:00:00Z",
      retryAfter: 60,
    });

    expect(error.meta.limit).toBe(1000);
    expect(error.meta.remaining).toBe(0);
    expect(error.meta.resetTime).toBe("2024-01-01T00:00:00Z");
    expect(error.meta.retryAfter).toBe(60);
    expect(error.meta.httpStatus).toBe(429);
  });

  it("should be instanceof Error", () => {
    const error = new TooManyRequestsError("Test");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(TooManyRequestsError);
  });

  it("should have correct stack trace", () => {
    const error = new TooManyRequestsError("Test");

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain("TooManyRequestsError");
  });
});
