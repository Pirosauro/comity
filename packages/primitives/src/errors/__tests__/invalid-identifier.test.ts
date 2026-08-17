import { describe, expect, it } from "vitest";
import { BaseError } from "../base.js";
import { InvalidIdentifierError } from "../invalid-identifier.js";

describe("InvalidIdentifierError", () => {
  describe("constructor", () => {
    it("should create an error with the empty reason", () => {
      const error = new InvalidIdentifierError("empty", {
        details: { kind: "UserId" },
      });

      expect(error.message).toBe("Empty identifier is not allowed");
      expect(error.code).toBe("value-object:empty");
      expect(error.name).toBe("InvalidIdentifierError");
    });

    it("should expose the kind in details", () => {
      const error = new InvalidIdentifierError("empty", {
        details: { kind: "AuthSessionId" },
      });

      expect(error.meta.details).toEqual({ kind: "AuthSessionId" });
      expect(error.meta.reason).toBe("empty");
    });

    it("should default the http status to 500", () => {
      const error = new InvalidIdentifierError("empty", {
        details: { kind: "CustomerId" },
      });

      expect(error.meta.httpStatus).toBe(500);
    });

    it("should extend BaseError", () => {
      const error = new InvalidIdentifierError("empty", {
        details: { kind: "UserId" },
      });

      expect(error).toBeInstanceOf(BaseError);
      expect(error).toBeInstanceOf(Error);
    });

    it("should preserve extra metadata", () => {
      const error = new InvalidIdentifierError("empty", {
        details: { kind: "UserId" },
        context: { origin: "test" },
      });

      expect(error.meta.context).toEqual({ origin: "test" });
    });
  });
});