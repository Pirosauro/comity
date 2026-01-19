import { describe, expect, it } from "vitest";
import { InvalidSessionError } from "../invalid-session.js";

describe("InvalidSessionError", () => {
  it("should create error with default message", () => {
    const error = new InvalidSessionError();

    expect(error.message).toBe("Invalid session");
    expect(error.code).toBe("auth:session_invalid");
    expect(error.meta.httpStatus).toBe(401);
  });

  it("should create error with reason metadata", () => {
    const error = new InvalidSessionError({ reason: "expired" });

    expect(error.meta["reason"]).toBe("expired");
  });

  it("should create error with custom reason type", () => {
    const error = new InvalidSessionError<"custom_reason">({ reason: "custom_reason" });

    expect(error.meta["reason"]).toBe("custom_reason");
  });

  it("should create error without reason", () => {
    const error = new InvalidSessionError({});

    expect(error.meta["reason"]).toBeUndefined();
  });
});
