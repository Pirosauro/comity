import { describe, expect, it } from "vitest";
import { BaseError } from "@comity/primitives/errors";
import { HttpError } from "../http.js";

describe("HttpError", () => {
  it("should map pipeline_contract_violation to its message, code and status", () => {
    const error = new HttpError("pipeline_contract_violation");

    expect(error.message).toBe("HTTP pipeline contract violation");
    expect(error.code).toBe("http:pipeline_contract_violation");
    expect(error.meta.reason).toBe("pipeline_contract_violation");
    expect(error.meta.httpStatus).toBe(500);
  });

  it("should map middleware_contract_violation to its message, code and status", () => {
    const error = new HttpError("middleware_contract_violation");

    expect(error.message).toBe("HTTP middleware contract violation");
    expect(error.code).toBe("http:middleware_contract_violation");
    expect(error.meta.httpStatus).toBe(500);
  });

  it("should map invalid_lifecycle_state to 409", () => {
    const error = new HttpError("invalid_lifecycle_state");

    expect(error.message).toBe("Invalid lifecycle state for HTTP action");
    expect(error.code).toBe("http:invalid_lifecycle_state");
    expect(error.meta.httpStatus).toBe(409);
  });

  it("should map internal_error to its message, code and status", () => {
    const error = new HttpError("internal_error");

    expect(error.message).toBe("Internal HTTP error");
    expect(error.code).toBe("http:internal_error");
    expect(error.meta.httpStatus).toBe(500);
  });

  it("should preserve details metadata", () => {
    const error = new HttpError("pipeline_contract_violation", {
      details: { route: "/products", method: "GET" },
    });

    expect(error.meta.details).toEqual({ route: "/products", method: "GET" });
  });

  it("should extend BaseError", () => {
    const error = new HttpError("internal_error");

    expect(error).toBeInstanceOf(BaseError);
    expect(error).toBeInstanceOf(Error);
  });
});