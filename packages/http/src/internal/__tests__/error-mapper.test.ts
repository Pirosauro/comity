import { describe, expect, it } from "vitest";
import { defaultHttpErrorMapper } from "../error-mapper.js";

describe("defaultHttpErrorMapper", () => {
  describe("map", () => {
    it("should map HttpError to response", () => {
      const error = {
        code: "USER_NOT_FOUND",
        status: 404,
        message: "User not found",
      };

      const response = defaultHttpErrorMapper.map(error, {} as any);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        code: "USER_NOT_FOUND",
        message: "User not found",
      });
    });

    it("should map HttpError with details", () => {
      const error = {
        code: "VALIDATION_ERROR",
        status: 422,
        message: "Validation failed",
        details: { field: "email", reason: "invalid" },
      };

      const response = defaultHttpErrorMapper.map(error, {} as any);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: { field: "email", reason: "invalid" },
      });
    });

    it("should include message only if present", () => {
      const errorWithoutMessage = {
        code: "INTERNAL_ERROR",
        status: 500,
      };

      const response = defaultHttpErrorMapper.map(errorWithoutMessage, {} as any);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        code: "INTERNAL_ERROR",
      });
      expect("message" in (response.body as any)).toBe(false);
    });

    it("should include details only if present", () => {
      const errorWithoutDetails = {
        code: "BAD_REQUEST",
        status: 400,
        message: "Bad request",
      };

      const response = defaultHttpErrorMapper.map(errorWithoutDetails, {} as any);

      expect(response.status).toBe(400);
      expect("details" in (response.body as any)).toBe(false);
    });

    it("should map AbortError from DOMException", () => {
      const error = new DOMException("Request aborted", "AbortError");

      const response = defaultHttpErrorMapper.map(error, {} as any);

      expect(response.status).toBe(499);
      expect(response.body).toBeUndefined();
    });

    it("should map other DOMExceptions to 500", () => {
      const error = new DOMException("Some DOM error", "SyntaxError");

      const response = defaultHttpErrorMapper.map(error, {} as any);

      expect(response.status).toBe(500);
    });

    it("should map unknown error to 500", () => {
      const error = new Error("Unknown error");

      const response = defaultHttpErrorMapper.map(error, {} as any);

      expect(response.status).toBe(500);
      expect(response.body).toBeUndefined();
    });

    it("should map null to 500", () => {
      const response = defaultHttpErrorMapper.map(null, {} as any);

      expect(response.status).toBe(500);
    });

    it("should map plain object to 500 if not HttpError", () => {
      const error = { message: "Some error" };

      const response = defaultHttpErrorMapper.map(error, {} as any);

      expect(response.status).toBe(500);
    });

    it("should handle HttpError with numeric code as string", () => {
      const error = {
        code: "404",
        status: 404,
      };

      const response = defaultHttpErrorMapper.map(error, {} as any);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ code: "404" });
    });

    it("should validate HttpError interface strictly", () => {
      const invalidError = {
        code: "ERROR",
        status: "500", // Should be number
      };

      const response = defaultHttpErrorMapper.map(invalidError, {} as any);

      // Should not be treated as HttpError because status is not a number
      expect(response.status).toBe(500);
    });

    it("should ignore cause field in mapping", () => {
      const error = {
        code: "ERROR",
        status: 500,
        cause: new Error("Original cause"),
      };

      const response = defaultHttpErrorMapper.map(error, {} as any);

      // cause should not be included in response body
      expect(response.body).toEqual({ code: "ERROR" });
    });

    it("should handle empty error details object", () => {
      const error = {
        code: "ERROR",
        status: 500,
        details: {},
      };

      const response = defaultHttpErrorMapper.map(error, {} as any);

      expect(response.body).toEqual({ code: "ERROR", details: {} });
    });

    it("should handle nested error details", () => {
      const error = {
        code: "COMPLEX_ERROR",
        status: 400,
        details: {
          fields: {
            email: ["Invalid format"],
            password: ["Too short"],
          },
        },
      };

      const response = defaultHttpErrorMapper.map(error, {} as any);

      expect(response.body).toEqual({
        code: "COMPLEX_ERROR",
        details: {
          fields: {
            email: ["Invalid format"],
            password: ["Too short"],
          },
        },
      });
    });
  });
});
