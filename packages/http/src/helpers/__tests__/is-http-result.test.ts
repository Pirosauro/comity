import { BaseError } from "@comity/core/errors";
import { failure, success } from "@comity/core/result";
import { describe, expect, it } from "vitest";
import { isHttpResult } from "../is-http-result.js";

describe("isHttpResult", () => {
  it("should return true for successful Result with HttpResponse", () => {
    const httpResponse = {
      intent: "json",
      status: 200,
      body: { data: "test" },
    };
    const result = success(httpResponse);

    const isValid = isHttpResult(result);

    expect(isValid).toBe(true);
  });

  it("should return true for failed Result", () => {
    const error = new BaseError("TEST_ERROR", "Test error");
    const result = failure(error);

    const isValid = isHttpResult(result);

    expect(isValid).toBe(true);
  });

  it("should return false for successful Result with non-HttpResponse", () => {
    const result = success("not an http response");

    const isValid = isHttpResult(result);

    expect(isValid).toBe(false);
  });

  it("should return false for successful Result with invalid HttpResponse", () => {
    const invalidResponse = {
      status: 200,
      body: "test",
      // missing intent
    };
    const result = success(invalidResponse);

    const isValid = isHttpResult(result);

    expect(isValid).toBe(false);
  });

  it("should return false for null", () => {
    const result = isHttpResult(null);

    expect(result).toBe(false);
  });

  it("should return false for undefined", () => {
    const result = isHttpResult(undefined);

    expect(result).toBe(false);
  });

  it("should return false for non-object", () => {
    const result = isHttpResult("string");

    expect(result).toBe(false);
  });

  it("should return false for object without success property", () => {
    const obj = { value: "test" };

    const result = isHttpResult(obj);

    expect(result).toBe(false);
  });

  it("should return false for object with non-boolean success", () => {
    const obj = { success: "true", value: "test" };

    const result = isHttpResult(obj);

    expect(result).toBe(false);
  });

  it("should return false for successful result without value", () => {
    const obj = { success: true };

    const result = isHttpResult(obj);

    expect(result).toBe(false);
  });

  it("should return false for failed result without error", () => {
    const obj = { success: false };

    const result = isHttpResult(obj);

    expect(result).toBe(false);
  });

  it("should return false for failed result with non-error error", () => {
    const obj = { success: false, error: "string error" };

    const result = isHttpResult(obj);

    expect(result).toBe(false);
  });
});
