import { describe, expect, it } from "vitest";
import { InvalidIdentifierError } from "@comity/primitives/errors";
import { AuthSessionId } from "../auth-session-id.js";

describe("AuthSessionId", () => {
  it("should expose its underlying string via value and toString", () => {
    const id = new AuthSessionId("session-1");

    expect(id.value).toBe("session-1");
    expect(id.toString()).toBe("session-1");
  });

  it("should preserve the original value when non-empty", () => {
    const opaque = new AuthSessionId("01HXYZ...opaque-token");

    expect(opaque.value).toBe("01HXYZ...opaque-token");
    expect(opaque.toString()).toBe("01HXYZ...opaque-token");
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

  it("should reject an empty string with an InvalidIdentifierError", () => {
    expect(() => new AuthSessionId("")).toThrow(InvalidIdentifierError);
  });

  it("should reject a whitespace-only string with an InvalidIdentifierError", () => {
    expect(() => new AuthSessionId("   ")).toThrow(InvalidIdentifierError);
  });

  it("should expose the kind in InvalidIdentifierError details", () => {
    try {
      new AuthSessionId("");
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidIdentifierError);
      expect((error as InvalidIdentifierError).meta.details.kind).toBe("AuthSessionId");
    }
  });
});
