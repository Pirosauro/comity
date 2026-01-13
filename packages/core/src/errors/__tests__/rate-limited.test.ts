import { describe, expect, it } from "vitest";
import { RateLimitedError } from "../rate-limited.js";

describe("RateLimitedError", () => {
  it("should create error with default message", () => {
    const error = new RateLimitedError("Rate limit exceeded");

    expect(error.message).toBe("Rate limit exceeded");
    expect(error.code).toBe("core:rate_limited");
    expect(error.name).toBe("RateLimitedError");
    expect(error.meta.httpStatus).toBe(429);
  });

  it("should create error with custom message", () => {
    const error = new RateLimitedError("Custom rate limit message");

    expect(error.message).toBe("Custom rate limit message");
    expect(error.code).toBe("core:rate_limited");
    expect(error.meta.httpStatus).toBe(429);
  });

  it("should include additional metadata", () => {
    const error = new RateLimitedError("API quota exceeded", {
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
    const error = new RateLimitedError("Test");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(RateLimitedError);
  });

  it("should have correct stack trace", () => {
    const error = new RateLimitedError("Test");

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain("RateLimitedError");
  });
});
