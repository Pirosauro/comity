import { describe, it, expect } from "vitest";
import { NotFoundError } from "../not-found.js";

describe("NotFoundError", () => {
  describe("constructor", () => {
    it("should create error with default message", () => {
      const error = new NotFoundError();

      expect(error.message).toBe("Not Found");
      expect(error.name).toBe("NotFoundError");
    });

    it("should create error with custom message", () => {
      const customMessage = "Resource not found";
      const error = new NotFoundError(customMessage);

      expect(error.message).toBe(customMessage);
      expect(error.name).toBe("NotFoundError");
    });

    it("should create error with empty string message", () => {
      const error = new NotFoundError("");

      expect(error.message).toBe("");
      expect(error.name).toBe("NotFoundError");
    });

    it("should create error with undefined message", () => {
      const error = new NotFoundError(undefined);

      expect(error.message).toBe("Not Found");
      expect(error.name).toBe("NotFoundError");
    });
  });

  describe("inheritance", () => {
    it("should be instance of NotFoundError", () => {
      const error = new NotFoundError();

      expect(error).toBeInstanceOf(NotFoundError);
    });

    it("should be instance of Error", () => {
      const error = new NotFoundError();

      expect(error).toBeInstanceOf(Error);
    });

    it("should have Error in prototype chain", () => {
      const error = new NotFoundError();

      expect(Object.getPrototypeOf(Object.getPrototypeOf(error))).toBe(
        Error.prototype
      );
    });
  });

  describe("error properties", () => {
    it("should have correct name property", () => {
      const error = new NotFoundError("test message");

      expect(error.name).toBe("NotFoundError");
    });

    it("should have stack trace", () => {
      const error = new NotFoundError();

      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe("string");
      expect(error.stack).toContain("NotFoundError");
    });

    it("should preserve stack trace information", () => {
      const error = new NotFoundError("test error");

      expect(error.stack).toContain("NotFoundError: test error");
    });
  });

  describe("throwing and catching", () => {
    it("should be throwable and catchable", () => {
      expect(() => {
        throw new NotFoundError("Test throw");
      }).toThrow(NotFoundError);
    });

    it("should be catchable as Error", () => {
      expect(() => {
        throw new NotFoundError("Test throw");
      }).toThrow(Error);
    });

    it("should be catchable with specific message", () => {
      const message = "User not found";

      expect(() => {
        throw new NotFoundError(message);
      }).toThrow(message);
    });

    it("should be catchable with default message", () => {
      expect(() => {
        throw new NotFoundError();
      }).toThrow("Not Found");
    });

    it("should maintain error properties when caught", () => {
      const customMessage = "Custom not found message";

      try {
        throw new NotFoundError(customMessage);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError);
        expect(error).toBeInstanceOf(Error);
        expect((error as NotFoundError).message).toBe(customMessage);
        expect((error as NotFoundError).name).toBe("NotFoundError");
      }
    });
  });

  describe("error identification", () => {
    it("should be identifiable by name property", () => {
      const error = new NotFoundError();

      expect(error.name).toBe("NotFoundError");
    });

    it("should be distinguishable from other Error types", () => {
      const notFoundError = new NotFoundError();
      const genericError = new Error("Generic error");
      const typeError = new TypeError("Type error");

      expect(notFoundError.name).toBe("NotFoundError");
      expect(genericError.name).toBe("Error");
      expect(typeError.name).toBe("TypeError");
    });

    it("should be identifiable in error handling", () => {
      const errors = [
        new NotFoundError("Not found"),
        new Error("Generic"),
        new TypeError("Type"),
        new NotFoundError("Another not found"),
      ];

      const notFoundErrors = errors.filter(
        (error) => error instanceof NotFoundError
      );

      expect(notFoundErrors).toHaveLength(2);
      expect(notFoundErrors[0]).toBeInstanceOf(NotFoundError);
      expect(notFoundErrors[1]).toBeInstanceOf(NotFoundError);
    });
  });

  describe("serialization", () => {
    it("should serialize to string correctly", () => {
      const error = new NotFoundError("Test message");

      expect(error.toString()).toBe("NotFoundError: Test message");
    });

    it("should serialize with default message", () => {
      const error = new NotFoundError();

      expect(error.toString()).toBe("NotFoundError: Not Found");
    });

    it("should work with JSON.stringify", () => {
      const error = new NotFoundError("JSON test");
      const serialized = JSON.stringify(error);
      const parsed = JSON.parse(serialized);

      // Note: JSON.stringify on Error objects includes enumerable properties like 'name' and 'status'
      expect(parsed).toEqual({ name: "NotFoundError", status: 404 });
    });
  });

  describe("edge cases", () => {
    it("should handle null message", () => {
      const error = new NotFoundError(null as any);

      expect(error.message).toBe("null");
      expect(error.name).toBe("NotFoundError");
    });

    it("should handle numeric message", () => {
      const error = new NotFoundError(404 as any);

      expect(error.message).toBe("404");
      expect(error.name).toBe("NotFoundError");
    });

    it("should handle object message", () => {
      const objMessage = { id: 123, type: "user" };
      const error = new NotFoundError(objMessage as any);

      expect(error.message).toBe("[object Object]");
      expect(error.name).toBe("NotFoundError");
    });

    it("should handle very long message", () => {
      const longMessage = "a".repeat(10000);
      const error = new NotFoundError(longMessage);

      expect(error.message).toBe(longMessage);
      expect(error.message).toHaveLength(10000);
      expect(error.name).toBe("NotFoundError");
    });

    it("should handle message with special characters", () => {
      const specialMessage = "NotFound: ñáéíóú 中文 🔍 \n\t\r";
      const error = new NotFoundError(specialMessage);

      expect(error.message).toBe(specialMessage);
      expect(error.name).toBe("NotFoundError");
    });
  });

  describe("use cases", () => {
    it("should be suitable for API resource not found scenarios", () => {
      const error = new NotFoundError("User with ID 123 not found");

      expect(error.message).toBe("User with ID 123 not found");
      expect(error.name).toBe("NotFoundError");
      expect(error).toBeInstanceOf(NotFoundError);
    });

    it("should be suitable for file not found scenarios", () => {
      const error = new NotFoundError("File '/path/to/file.txt' not found");

      expect(error.message).toBe("File '/path/to/file.txt' not found");
      expect(error.name).toBe("NotFoundError");
    });

    it("should be suitable for service not found scenarios", () => {
      const serviceName = "userService";
      const error = new NotFoundError(
        `Service "${serviceName}" is not registered`
      );

      expect(error.message).toBe('Service "userService" is not registered');
      expect(error.name).toBe("NotFoundError");
    });

    it("should work in async/await error handling", async () => {
      const asyncFunction = async () => {
        throw new NotFoundError("Async resource not found");
      };

      await expect(asyncFunction()).rejects.toThrow(NotFoundError);
      await expect(asyncFunction()).rejects.toThrow("Async resource not found");
    });

    it("should work in Promise rejection handling", () => {
      const promise = Promise.reject(new NotFoundError("Promise rejection"));

      return expect(promise).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
