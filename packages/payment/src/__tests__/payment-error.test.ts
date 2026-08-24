import { describe, expect, it } from "vitest";
import { PaymentError } from "../errors/payment.js";

describe("PaymentError", () => {
  it("creates an error with the invalid_request reason", () => {
    const error = new PaymentError("invalid_request");

    expect(error.code).toBe("payment:invalid_request");
    expect(error.message).toBe("Invalid payment request");
    expect(error.meta.reason).toBe("invalid_request");
    expect(error.meta.httpStatus).toBe(400);
  });

  it("creates an error with the internal_error reason", () => {
    const error = new PaymentError("internal_error");

    expect(error.code).toBe("payment:internal_error");
    expect(error.message).toBe("Payment infrastructure error");
    expect(error.meta.reason).toBe("internal_error");
    expect(error.meta.httpStatus).toBe(500);
  });

  it("merges contextual details", () => {
    const error = new PaymentError("invalid_request", {
      details: { reference: "order-123" },
    });

    expect(error.meta.details).toEqual({ reference: "order-123" });
  });

  it("overrides httpStatus with custom metadata", () => {
    const error = new PaymentError("invalid_request", { httpStatus: 503 });

    expect(error.meta.httpStatus).toBe(503);
  });

  it("is an instance of Error", () => {
    const error = new PaymentError("invalid_request");

    expect(error).toBeInstanceOf(Error);
  });
});