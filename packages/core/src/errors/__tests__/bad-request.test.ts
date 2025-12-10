import { describe, it, expect } from "vitest";
import { BadRequestError } from "../bad-request.js";

describe("BadRequestError", () => {
  it("should use default message", () => {
    const err = new BadRequestError();
    expect(err.message).toBe("Bad Request");
    expect(err.name).toBe("BadRequest");
    expect(err.status).toBe(400);
  });

  it("should use custom message", () => {
    const err = new BadRequestError("Custom");
    expect(err.message).toBe("Custom");
  });
});
