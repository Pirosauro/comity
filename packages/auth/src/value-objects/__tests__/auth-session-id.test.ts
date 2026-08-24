import { describe, expect, it } from "vitest";
import { isFailure } from "@comity/primitives/result";
import { InvalidIdentifierError } from "@comity/primitives/errors";
import { AuthSessionId } from "../auth-session-id.js";

function id(value: string): AuthSessionId {
  const result = AuthSessionId.create(value);

  if (isFailure(result)) {
    throw new Error("Unexpected failure");
  }

  return result.value;
}

describe("AuthSessionId", () => {
  it("should expose its underlying string via value and toString", () => {
    const sessionId = id("session-1");

    expect(sessionId.value).toBe("session-1");
    expect(sessionId.toString()).toBe("session-1");
  });

  it("should preserve the original value when non-empty", () => {
    const opaque = id("01HXYZ...opaque-token");

    expect(opaque.value).toBe("01HXYZ...opaque-token");
    expect(opaque.toString()).toBe("01HXYZ...opaque-token");
  });

  it("should treat two ids with the same value as equal", () => {
    const a = id("session-1");
    const b = id("session-1");

    expect(a.equals(b)).toBe(true);
    expect(b.equals(a)).toBe(true);
  });

  it("should treat two ids with different values as not equal", () => {
    const a = id("session-1");
    const b = id("session-2");

    expect(a.equals(b)).toBe(false);
    expect(b.equals(a)).toBe(false);
  });

  it("should reject an empty string with an InvalidIdentifierError", () => {
    const result = AuthSessionId.create("");

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(InvalidIdentifierError);
    }
  });

  it("should reject a whitespace-only string with an InvalidIdentifierError", () => {
    const result = AuthSessionId.create("   ");

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(InvalidIdentifierError);
    }
  });

  it("should expose the kind in InvalidIdentifierError details", () => {
    const result = AuthSessionId.create("");

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error.meta.details.kind).toBe("AuthSessionId");
    }
  });

  it("should not allow bypassing validation through the constructor", () => {
    // @ts-expect-error the constructor is private; creation goes through create()
    new AuthSessionId("anything");
  });
});