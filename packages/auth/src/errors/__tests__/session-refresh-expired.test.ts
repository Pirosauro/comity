import { describe, expect, it } from "vitest";
import { SessionRefreshExpiredError } from "../session-refresh-expired.js";

describe("SessionRefreshExpiredError", () => {
  it("should create error with default message", () => {
    const error = new SessionRefreshExpiredError();

    expect(error.message).toBe("Session refresh has expired");
    expect(error.code).toBe("auth:refresh_expired");
    expect(error.meta.httpStatus).toBe(401);
  });

  it("should create error with metadata", () => {
    const error = new SessionRefreshExpiredError({ expiresAt: 1000 });

    expect(error.meta["expiresAt"]).toBe(1000);
  });
});
