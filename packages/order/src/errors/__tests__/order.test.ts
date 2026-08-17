import { describe, expect, it } from "vitest";
import { OrderError } from "../order.js";

describe("OrderError", () => {
  it("creates an error with the not_found reason", () => {
    const error = new OrderError("not_found");

    expect(error.code).toBe("order:not_found");
    expect(error.message).toBe("Order not found");
    expect(error.meta.reason).toBe("not_found");
    expect(error.meta.httpStatus).toBe(404);
  });

  it("creates an error with the validation_failed reason", () => {
    const error = new OrderError("validation_failed");

    expect(error.code).toBe("order:validation_failed");
    expect(error.message).toBe("Order validation failed");
    expect(error.meta.reason).toBe("validation_failed");
    expect(error.meta.httpStatus).toBe(400);
  });

  it("creates an error with the access_denied reason", () => {
    const error = new OrderError("access_denied");

    expect(error.code).toBe("order:access_denied");
    expect(error.message).toBe("Access to order denied");
    expect(error.meta.httpStatus).toBe(403);
  });

  it("creates an error with the repository_error reason", () => {
    const error = new OrderError("repository_error");

    expect(error.code).toBe("order:repository_error");
    expect(error.message).toBe("Order repository error");
    expect(error.meta.httpStatus).toBe(500);
  });

  it("creates an error with the invalid_status_transition reason", () => {
    const error = new OrderError("invalid_status_transition");

    expect(error.code).toBe("order:invalid_status_transition");
    expect(error.message).toBe("Invalid order status transition");
    expect(error.meta.httpStatus).toBe(409);
  });

  it("creates an error with the unknown reason", () => {
    const error = new OrderError("unknown");

    expect(error.code).toBe("order:unknown");
    expect(error.message).toBe("Unknown error");
    expect(error.meta.httpStatus).toBe(500);
  });

  it("merges a domain violation", () => {
    const error = new OrderError("validation_failed", {
      violation: "insufficient_stock",
    });

    expect(error.meta.violation).toBe("insufficient_stock");
  });

  it("merges contextual details", () => {
    const error = new OrderError("not_found", {
      details: { orderId: "order-1", itemId: "item-1", sku: "SKU-1" },
    });

    expect(error.meta.details).toEqual({
      orderId: "order-1",
      itemId: "item-1",
      sku: "SKU-1",
    });
  });

  it("overrides httpStatus with custom metadata", () => {
    const error = new OrderError("not_found", { httpStatus: 503 });

    expect(error.meta.httpStatus).toBe(503);
  });

  it("is an instance of Error", () => {
    const error = new OrderError("unknown");

    expect(error).toBeInstanceOf(Error);
  });
});