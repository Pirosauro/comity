import { describe, expect, it } from "vitest";
import { SessionRevokedError } from "../session-revoked.js";

describe("SessionRevokedError", () => {
  it("should create error with default message", () => {
    const error = new SessionRevokedError();

    expect(error.message).toBe("Session revoked");
    expect(error.code).toBe("auth:session_revoked");
    expect(error.meta.httpStatus).toBe(401);
  });

  it("should create error with reason metadata", () => {
    const error = new SessionRevokedError({ reason: "expired" });

    expect(error.meta["reason"]).toBe("expired");
  });

  it("should create error with undefined reason", () => {
    const error = new SessionRevokedError({ reason: undefined });

    expect(error.meta["reason"]).toBeUndefined();
  });

  it("should preserve additional metadata fields", () => {
    const error = new SessionRevokedError({
      reason: "version_mismatch",
      expectedVersion: 2,
      actualVersion: 1,
    });

    expect(error.meta["expectedVersion"]).toBe(2);
    expect(error.meta["actualVersion"]).toBe(1);
  });
});
