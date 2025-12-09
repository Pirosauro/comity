import { describe, it, expect } from "vitest";
import { ForbiddenError } from "../forbidden.js";

describe("ForbiddenError", () => {
  describe("constructor", () => {
    it("should create error with default message", () => {
      const error = new ForbiddenError();

      expect(error.message).toBe("Forbidden");
      expect(error.name).toBe("ForbiddenError");
    });

    it("should create error with custom message", () => {
      const customMessage = "Access denied to this resource";
      const error = new ForbiddenError(customMessage);

      expect(error.message).toBe(customMessage);
      expect(error.name).toBe("ForbiddenError");
    });

    it("should create error with empty string message", () => {
      const error = new ForbiddenError("");

      expect(error.message).toBe("");
      expect(error.name).toBe("ForbiddenError");
    });

    it("should create error with undefined message", () => {
      const error = new ForbiddenError(undefined);

      expect(error.message).toBe("Forbidden");
      expect(error.name).toBe("ForbiddenError");
    });
  });

  describe("inheritance", () => {
    it("should be instance of ForbiddenError", () => {
      const error = new ForbiddenError();

      expect(error).toBeInstanceOf(ForbiddenError);
    });

    it("should be instance of Error", () => {
      const error = new ForbiddenError();

      expect(error).toBeInstanceOf(Error);
    });

    it("should have Error in prototype chain", () => {
      const error = new ForbiddenError();

      expect(Object.getPrototypeOf(Object.getPrototypeOf(error))).toBe(
        Error.prototype
      );
    });
  });

  describe("error properties", () => {
    it("should have correct name property", () => {
      const error = new ForbiddenError("test message");

      expect(error.name).toBe("ForbiddenError");
    });

    it("should have stack trace", () => {
      const error = new ForbiddenError();

      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe("string");
      expect(error.stack).toContain("ForbiddenError");
    });

    it("should preserve stack trace information", () => {
      const error = new ForbiddenError("test error");

      expect(error.stack).toContain("ForbiddenError: test error");
    });
  });

  describe("throwing and catching", () => {
    it("should be throwable and catchable", () => {
      expect(() => {
        throw new ForbiddenError("Test throw");
      }).toThrow(ForbiddenError);
    });

    it("should be catchable as Error", () => {
      expect(() => {
        throw new ForbiddenError("Test throw");
      }).toThrow(Error);
    });

    it("should be catchable with specific message", () => {
      const message = "Specific forbidden error";

      expect(() => {
        throw new ForbiddenError(message);
      }).toThrow(message);
    });

    it("should be catchable with default message", () => {
      expect(() => {
        throw new ForbiddenError();
      }).toThrow("Forbidden");
    });

    it("should maintain error properties when caught", () => {
      const customMessage = "Custom forbidden message";

      try {
        throw new ForbiddenError(customMessage);
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenError);
        expect(error).toBeInstanceOf(Error);
        expect((error as ForbiddenError).message).toBe(customMessage);
        expect((error as ForbiddenError).name).toBe("ForbiddenError");
      }
    });
  });

  describe("error identification", () => {
    it("should be identifiable by name property", () => {
      const error = new ForbiddenError();

      expect(error.name).toBe("ForbiddenError");
    });

    it("should be distinguishable from other Error types", () => {
      const forbiddenError = new ForbiddenError();
      const genericError = new Error("Generic error");
      const typeError = new TypeError("Type error");

      expect(forbiddenError.name).toBe("ForbiddenError");
      expect(genericError.name).toBe("Error");
      expect(typeError.name).toBe("TypeError");
    });

    it("should be identifiable in error handling", () => {
      const errors = [
        new ForbiddenError("Forbidden"),
        new Error("Generic"),
        new TypeError("Type"),
        new ForbiddenError("Another forbidden"),
      ];

      const forbiddenErrors = errors.filter(
        (error) => error instanceof ForbiddenError
      );

      expect(forbiddenErrors).toHaveLength(2);
      expect(forbiddenErrors[0]).toBeInstanceOf(ForbiddenError);
      expect(forbiddenErrors[1]).toBeInstanceOf(ForbiddenError);
    });
  });

  describe("serialization", () => {
    it("should serialize to string correctly", () => {
      const error = new ForbiddenError("Test message");

      expect(error.toString()).toBe("ForbiddenError: Test message");
    });

    it("should serialize with default message", () => {
      const error = new ForbiddenError();

      expect(error.toString()).toBe("ForbiddenError: Forbidden");
    });

    it("should work with JSON.stringify", () => {
      const error = new ForbiddenError("JSON test");
      const serialized = JSON.stringify(error);
      const parsed = JSON.parse(serialized);

      // Note: JSON.stringify on Error objects includes enumerable properties like 'name' and 'status'
      expect(parsed).toEqual({ name: "ForbiddenError", status: 403 });
    });
  });

  describe("edge cases", () => {
    it("should handle null message", () => {
      const error = new ForbiddenError(null as any);

      expect(error.message).toBe("null");
      expect(error.name).toBe("ForbiddenError");
    });

    it("should handle numeric message", () => {
      const error = new ForbiddenError(404 as any);

      expect(error.message).toBe("404");
      expect(error.name).toBe("ForbiddenError");
    });

    it("should handle object message", () => {
      const objMessage = { code: 403, reason: "forbidden" };
      const error = new ForbiddenError(objMessage as any);

      expect(error.message).toBe("[object Object]");
      expect(error.name).toBe("ForbiddenError");
    });

    it("should handle very long message", () => {
      const longMessage = "a".repeat(10000);
      const error = new ForbiddenError(longMessage);

      expect(error.message).toBe(longMessage);
      expect(error.message).toHaveLength(10000);
      expect(error.name).toBe("ForbiddenError");
    });

    it("should handle message with special characters", () => {
      const specialMessage = "Forbidden: ñáéíóú 中文 🚫 \n\t\r";
      const error = new ForbiddenError(specialMessage);

      expect(error.message).toBe(specialMessage);
      expect(error.name).toBe("ForbiddenError");
    });
  });
});
