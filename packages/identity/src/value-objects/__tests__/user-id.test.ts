import { describe, expect, it } from "vitest";
import { isFailure } from "@comity/primitives/result";
import { InvalidIdentifierError } from "@comity/primitives/errors";
import { UserId } from "../user-id.js";

function id(value: string): UserId {
  const result = UserId.create(value);

  if (isFailure(result)) {
    throw new Error("Unexpected failure");
  }

  return result.value;
}

describe("UserId", () => {
  it("should create with a value", () => {
    const userId = id("usr-123");

    expect(userId.value).toBe("usr-123");
    expect(userId.toString()).toBe("usr-123");
  });

  it("should preserve the original value when non-empty", () => {
    const userId = id("  user-with-spaces  ");

    expect(userId.value).toBe("  user-with-spaces  ");
    expect(userId.toString()).toBe("  user-with-spaces  ");
  });

  it("should equal same value", () => {
    const a = id("usr-1");
    const b = id("usr-1");

    expect(a.equals(b)).toBe(true);
  });

  it("should not equal different value", () => {
    const a = id("usr-1");
    const b = id("usr-2");

    expect(a.equals(b)).toBe(false);
  });

  it("should reject an empty string with InvalidIdentifierError", () => {
    const result = UserId.create("");

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(InvalidIdentifierError);
    }
  });

  it("should reject a whitespace-only string with InvalidIdentifierError", () => {
    const result = UserId.create("   ");

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(InvalidIdentifierError);
    }
  });

  it("should expose the kind in InvalidIdentifierError details", () => {
    const result = UserId.create("");

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error.meta.details.kind).toBe("UserId");
    }
  });

  it("should not allow bypassing validation through the constructor", () => {
    // @ts-expect-error the constructor is private; creation goes through create()
    new UserId("anything");
  });
});