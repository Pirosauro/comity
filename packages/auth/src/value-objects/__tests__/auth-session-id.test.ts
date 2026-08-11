import { describe, expect, it } from "vitest";
import { AuthSessionId } from "../auth-session-id.js";

describe("AuthSessionId", () => {
  it("should expose its underlying string via toString", () => {
    const id = new AuthSessionId("session-1");

    expect(id.toString()).toBe("session-1");
  });

  it("should treat two ids with the same value as equal", () => {
    const a = new AuthSessionId("session-1");
    const b = new AuthSessionId("session-1");

    expect(a.equals(b)).toBe(true);
    expect(b.equals(a)).toBe(true);
  });

  it("should treat two ids with different values as not equal", () => {
    const a = new AuthSessionId("session-1");
    const b = new AuthSessionId("session-2");

    expect(a.equals(b)).toBe(false);
    expect(b.equals(a)).toBe(false);
  });

  it("should accept any non-empty string value", () => {
    const opaque = new AuthSessionId("01HXYZ...opaque-token");

    expect(opaque.toString()).toBe("01HXYZ...opaque-token");
  });
});
