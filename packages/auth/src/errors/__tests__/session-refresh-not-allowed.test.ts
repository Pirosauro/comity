import { describe, expect, it } from "vitest";
import { SessionRefreshNotAllowedError } from "../session-refresh-not-allowed.js";

describe("SessionRefreshNotAllowedError", () => {
  it("should create error with default message", () => {
    const error = new SessionRefreshNotAllowedError();

    expect(error.message).toBe("Session refresh not allowed");
    expect(error.code).toBe("auth:refresh_not_allowed");
    expect(error.meta.httpStatus).toBe(401);
  });

  it("should create error with reason metadata", () => {
    const error = new SessionRefreshNotAllowedError({ reason: "session_refresh_disabled" });

    expect(error.meta["reason"]).toBe("session_refresh_disabled");
  });

  it("should create error with undefined reason", () => {
    const error = new SessionRefreshNotAllowedError({ reason: undefined });

    expect(error.meta["reason"]).toBeUndefined();
  });
});
