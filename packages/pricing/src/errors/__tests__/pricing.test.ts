import { describe, expect, it } from "vitest";
import { PricingError } from "../pricing.js";

describe("PricingError", () => {
  it("should build a code from the reason", () => {
    const error = new PricingError("invalid_currency");

    expect(error.code).toBe("pricing:invalid_currency");
  });

  it("should carry the default message for the reason", () => {
    const error = new PricingError("currency_mismatch");

    expect(error.message).toBe("Currency mismatch in money operation");
  });

  it("should expose the reason in meta", () => {
    const error = new PricingError("invalid_modifier");

    expect(error.meta.reason).toBe("invalid_modifier");
  });

  it("should carry contextual details", () => {
    const error = new PricingError("invalid_currency", {
      details: { field: "currency", currency: "FOO" },
    });

    expect(error.meta.details).toEqual({
      field: "currency",
      currency: "FOO",
    });
  });

  it("should map reasons to http status hints", () => {
    expect(new PricingError("invalid_currency").meta.httpStatus).toBe(400);
    expect(new PricingError("invalid_precision").meta.httpStatus).toBe(400);
    expect(new PricingError("invalid_percentage").meta.httpStatus).toBe(400);
    expect(new PricingError("calculation_failed").meta.httpStatus).toBe(422);
  });

  it("should be an instance of BaseError", () => {
    const error = new PricingError("invalid_amount");

    expect(error.name).toBe("PricingError");
    expect(error).toBeInstanceOf(Error);
  });
});
