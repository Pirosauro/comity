import { describe, it, expect } from "vitest";
import { UnauthorizedError } from "../unauthorized.js";

describe("UnauthorizedError", () => {
  describe("constructor", () => {
    it("should create error with default message", () => {
      const error = new UnauthorizedError();

      expect(error.message).toBe("Unauthorized");
      expect(error.name).toBe("UnauthorizedError");
    });

    it("should create error with custom message", () => {
      const customMessage = "Access token is invalid";
      const error = new UnauthorizedError(customMessage);

      expect(error.message).toBe(customMessage);
      expect(error.name).toBe("UnauthorizedError");
    });

    it("should create error with empty string message", () => {
      const error = new UnauthorizedError("");

      expect(error.message).toBe("");
      expect(error.name).toBe("UnauthorizedError");
    });

    it("should create error with undefined message", () => {
      const error = new UnauthorizedError(undefined);

      expect(error.message).toBe("Unauthorized");
      expect(error.name).toBe("UnauthorizedError");
    });
  });

  describe("inheritance", () => {
    it("should be instance of UnauthorizedError", () => {
      const error = new UnauthorizedError();

      expect(error).toBeInstanceOf(UnauthorizedError);
    });

    it("should be instance of Error", () => {
      const error = new UnauthorizedError();

      expect(error).toBeInstanceOf(Error);
    });

    it("should have Error in prototype chain", () => {
      const error = new UnauthorizedError();

      expect(Object.getPrototypeOf(Object.getPrototypeOf(error))).toBe(
        Error.prototype
      );
    });
  });

  describe("error properties", () => {
    it("should have correct name property", () => {
      const error = new UnauthorizedError("test message");

      expect(error.name).toBe("UnauthorizedError");
    });

    it("should have stack trace", () => {
      const error = new UnauthorizedError();

      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe("string");
      expect(error.stack).toContain("UnauthorizedError");
    });

    it("should preserve stack trace information", () => {
      const error = new UnauthorizedError("test error");

      expect(error.stack).toContain("UnauthorizedError: test error");
    });
  });

  describe("throwing and catching", () => {
    it("should be throwable and catchable", () => {
      expect(() => {
        throw new UnauthorizedError("Test throw");
      }).toThrow(UnauthorizedError);
    });

    it("should be catchable as Error", () => {
      expect(() => {
        throw new UnauthorizedError("Test throw");
      }).toThrow(Error);
    });

    it("should be catchable with specific message", () => {
      const message = "Invalid authentication credentials";

      expect(() => {
        throw new UnauthorizedError(message);
      }).toThrow(message);
    });

    it("should be catchable with default message", () => {
      expect(() => {
        throw new UnauthorizedError();
      }).toThrow("Unauthorized");
    });

    it("should maintain error properties when caught", () => {
      const customMessage = "Token expired";

      try {
        throw new UnauthorizedError(customMessage);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedError);
        expect(error).toBeInstanceOf(Error);
        expect((error as UnauthorizedError).message).toBe(customMessage);
        expect((error as UnauthorizedError).name).toBe("UnauthorizedError");
      }
    });
  });

  describe("error identification", () => {
    it("should be identifiable by name property", () => {
      const error = new UnauthorizedError();

      expect(error.name).toBe("UnauthorizedError");
    });

    it("should be distinguishable from other Error types", () => {
      const unauthorizedError = new UnauthorizedError();
      const genericError = new Error("Generic error");
      const typeError = new TypeError("Type error");

      expect(unauthorizedError.name).toBe("UnauthorizedError");
      expect(genericError.name).toBe("Error");
      expect(typeError.name).toBe("TypeError");
    });

    it("should be identifiable in error handling", () => {
      const errors = [
        new UnauthorizedError("Unauthorized"),
        new Error("Generic"),
        new TypeError("Type"),
        new UnauthorizedError("Another unauthorized"),
      ];

      const unauthorizedErrors = errors.filter(
        (error) => error instanceof UnauthorizedError
      );

      expect(unauthorizedErrors).toHaveLength(2);
      expect(unauthorizedErrors[0]).toBeInstanceOf(UnauthorizedError);
      expect(unauthorizedErrors[1]).toBeInstanceOf(UnauthorizedError);
    });
  });

  describe("serialization", () => {
    it("should serialize to string correctly", () => {
      const error = new UnauthorizedError("Test message");

      expect(error.toString()).toBe("UnauthorizedError: Test message");
    });

    it("should serialize with default message", () => {
      const error = new UnauthorizedError();

      expect(error.toString()).toBe("UnauthorizedError: Unauthorized");
    });

    it("should work with JSON.stringify", () => {
      const error = new UnauthorizedError("JSON test");
      const serialized = JSON.stringify(error);
      const parsed = JSON.parse(serialized);

      // Note: JSON.stringify on Error objects includes enumerable properties like 'name' and 'status'
      expect(parsed).toEqual({ name: "UnauthorizedError", status: 401 });
    });
  });

  describe("edge cases", () => {
    it("should handle null message", () => {
      const error = new UnauthorizedError(null as any);

      expect(error.message).toBe("null");
      expect(error.name).toBe("UnauthorizedError");
    });

    it("should handle numeric message", () => {
      const error = new UnauthorizedError(401 as any);

      expect(error.message).toBe("401");
      expect(error.name).toBe("UnauthorizedError");
    });

    it("should handle object message", () => {
      const objMessage = { code: 401, reason: "unauthorized" };
      const error = new UnauthorizedError(objMessage as any);

      expect(error.message).toBe("[object Object]");
      expect(error.name).toBe("UnauthorizedError");
    });

    it("should handle boolean message", () => {
      const error = new UnauthorizedError(false as any);

      expect(error.message).toBe("false");
      expect(error.name).toBe("UnauthorizedError");
    });

    it("should handle very long message", () => {
      const longMessage = "a".repeat(10000);
      const error = new UnauthorizedError(longMessage);

      expect(error.message).toBe(longMessage);
      expect(error.message).toHaveLength(10000);
      expect(error.name).toBe("UnauthorizedError");
    });

    it("should handle message with special characters", () => {
      const specialMessage = "Unauthorized: ñáéíóú 中文 🔒 \n\t\r";
      const error = new UnauthorizedError(specialMessage);

      expect(error.message).toBe(specialMessage);
      expect(error.name).toBe("UnauthorizedError");
    });
  });

  describe("use cases", () => {
    it("should be suitable for authentication failure scenarios", () => {
      const error = new UnauthorizedError("Invalid username or password");

      expect(error.message).toBe("Invalid username or password");
      expect(error.name).toBe("UnauthorizedError");
      expect(error).toBeInstanceOf(UnauthorizedError);
    });

    it("should be suitable for token expiration scenarios", () => {
      const error = new UnauthorizedError("Access token has expired");

      expect(error.message).toBe("Access token has expired");
      expect(error.name).toBe("UnauthorizedError");
    });

    it("should be suitable for missing credentials scenarios", () => {
      const error = new UnauthorizedError("Authorization header is required");

      expect(error.message).toBe("Authorization header is required");
      expect(error.name).toBe("UnauthorizedError");
    });

    it("should work in async/await error handling", async () => {
      const asyncFunction = async () => {
        throw new UnauthorizedError("Async authentication failure");
      };

      await expect(asyncFunction()).rejects.toThrow(UnauthorizedError);
      await expect(asyncFunction()).rejects.toThrow(
        "Async authentication failure"
      );
    });

    it("should work in Promise rejection handling", () => {
      const promise = Promise.reject(
        new UnauthorizedError("Promise authentication rejection")
      );

      return expect(promise).rejects.toBeInstanceOf(UnauthorizedError);
    });
  });
});
