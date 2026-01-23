import { BadRequestError } from "@comity/core/errors";
import { describe, expect, it } from "vitest";
import { errorToHttp } from "../error-to-http.js";

describe("errorToHttp", () => {
  it("should convert error with httpStatus in meta", () => {
    const error = new BadRequestError("Test error message", {
      extra: "data",
    });

    const result = errorToHttp(error);

    expect(result).toEqual({
      intent: "json",
      status: 400,
      body: {
        error: {
          code: "core:bad_request",
          message: "Test error message",
          meta: {
            httpStatus: 400,
            extra: "data",
          },
        },
      },
    });
  });

  it("should use default status 500 when httpStatus not provided", () => {
    const error = new BadRequestError("Test error message", {
      httpStatus: undefined,
      extra: "data",
    });

    const result = errorToHttp(error);

    expect(result).toEqual({
      intent: "json",
      status: 500,
      body: {
        error: {
          code: "core:bad_request",
          message: "Test error message",
          meta: {
            httpStatus: undefined,
            extra: "data",
          },
        },
      },
    });
  });

  it("should handle error with empty meta", () => {
    const error = new BadRequestError("Test error message");

    const result = errorToHttp(error);

    expect(result).toEqual({
      intent: "json",
      status: 400,
      body: {
        error: {
          code: "core:bad_request",
          message: "Test error message",
          meta: {
            httpStatus: 400,
          },
        },
      },
    });
  });

  it.skip("should handle error with undefined meta", () => {
    const error = new BadRequestError("Test error message");
    // Simulate undefined meta
    Object.defineProperty(error, "meta", { value: undefined });

    const result = errorToHttp(error);

    expect(result).toEqual({
      intent: "json",
      status: 500,
      body: {
        error: {
          code: "core:bad_request",
          message: "Test error message",
          meta: undefined,
        },
      },
    });
  });
});
