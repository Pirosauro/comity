import { describe, it, expect } from "vitest";
import { ServiceUnavailableError } from "../service-unavailable.js";

describe("ServiceUnavailableError", () => {
  it("should use default message", () => {
    const err = new ServiceUnavailableError();
    expect(err.message).toBe("Service Unavailable");
    expect(err.name).toBe("ServiceUnavailableError");
    expect(err.status).toBe(503);
  });
  it("should use custom message", () => {
    const err = new ServiceUnavailableError("Custom");
    expect(err.message).toBe("Custom");
  });
});
