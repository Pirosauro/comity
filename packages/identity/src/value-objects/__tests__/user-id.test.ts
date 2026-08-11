import { describe, expect, it } from "vitest";
import { InvalidIdentifierError } from "@comity/primitives/errors";
import { UserId } from "../user-id.js";

describe("UserId", () => {
  it("should create with a value", () => {
    const id = new UserId("usr-123");

    expect(id.value).toBe("usr-123");
    expect(id.toString()).toBe("usr-123");
  });

  it("should preserve the original value when non-empty", () => {
    const id = new UserId("  user-with-spaces  ");

    expect(id.value).toBe("  user-with-spaces  ");
    expect(id.toString()).toBe("  user-with-spaces  ");
  });

  it("should equal same value", () => {
    const a = new UserId("usr-1");
    const b = new UserId("usr-1");

    expect(a.equals(b)).toBe(true);
  });

  it("should not equal different value", () => {
    const a = new UserId("usr-1");
    const b = new UserId("usr-2");

    expect(a.equals(b)).toBe(false);
  });

  it("should reject an empty string with InvalidIdentifierError", () => {
    expect(() => new UserId("")).toThrow(InvalidIdentifierError);
  });

  it("should reject a whitespace-only string with InvalidIdentifierError", () => {
    expect(() => new UserId("   ")).toThrow(InvalidIdentifierError);
  });

  it("should expose the kind in InvalidIdentifierError details", () => {
    try {
      new UserId("");
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidIdentifierError);
      expect((error as InvalidIdentifierError).meta.details.kind).toBe("UserId");
    }
  });
});
