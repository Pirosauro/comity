import { describe, it, expect } from "vitest";
import { TooManyRequestsError } from "../too-many-requests.js";

describe("TooManyRequestsError", () => {
  it("should use default message", () => {
    const err = new TooManyRequestsError();
    expect(err.message).toBe("Too Many Requests");
    expect(err.name).toBe("TooManyRequestsError");
    expect(err.status).toBe(429);
  });

  it("should use custom message", () => {
    const err = new TooManyRequestsError("Custom");
    expect(err.message).toBe("Custom");
  });
});
