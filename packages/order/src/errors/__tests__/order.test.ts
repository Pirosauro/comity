import { describe, expect, it } from "vitest";
import { OrderError } from "../order.js";

describe("OrderError", () => {
  it("creates an error with the invalid_quantity reason", () => {
    const error = new OrderError("invalid_quantity");

    expect(error.code).toBe("order:invalid_quantity");
    expect(error.message).toBe("Invalid order item quantity");
    expect(error.meta.reason).toBe("invalid_quantity");
    expect(error.meta.httpStatus).toBe(400);
  });

  it("creates an error with the invalid_item reason", () => {
    const error = new OrderError("invalid_item");

    expect(error.code).toBe("order:invalid_item");
    expect(error.message).toBe("Order item not found");
    expect(error.meta.reason).toBe("invalid_item");
    expect(error.meta.httpStatus).toBe(400);
  });

  it("creates an error with the invalid_status_transition reason", () => {
    const error = new OrderError("invalid_status_transition");

    expect(error.code).toBe("order:invalid_status_transition");
    expect(error.message).toBe("Invalid order status transition");
    expect(error.meta.httpStatus).toBe(409);
  });

  it("creates an error with the shipping_destination_immutable reason", () => {
    const error = new OrderError("shipping_destination_immutable");

    expect(error.code).toBe("order:shipping_destination_immutable");
    expect(error.message).toBe("Shipping destination cannot be changed in the current order status");
    expect(error.meta.reason).toBe("shipping_destination_immutable");
    expect(error.meta.httpStatus).toBe(409);
  });

  it("creates an error with the ambiguous_shipping_destination reason", () => {
    const error = new OrderError("ambiguous_shipping_destination");

    expect(error.code).toBe("order:ambiguous_shipping_destination");
    expect(error.message).toBe("Order must contain exactly one shipping destination");
    expect(error.meta.reason).toBe("ambiguous_shipping_destination");
    expect(error.meta.httpStatus).toBe(409);
  });

  it("merges contextual details", () => {
    const error = new OrderError("invalid_item", {
      details: { orderId: "order-1", itemId: "item-1" },
    });

    expect(error.meta.details).toEqual({
      orderId: "order-1",
      itemId: "item-1",
    });
  });

  it("merges transition details", () => {
    const error = new OrderError("invalid_status_transition", {
      details: { from: "fulfilled", to: "pending" },
    });

    expect(error.meta.details).toEqual({ from: "fulfilled", to: "pending" });
  });

  it("overrides httpStatus with custom metadata", () => {
    const error = new OrderError("invalid_quantity", { httpStatus: 503 });

    expect(error.meta.httpStatus).toBe(503);
  });

  it("is an instance of Error", () => {
    const error = new OrderError("invalid_quantity");

    expect(error).toBeInstanceOf(Error);
  });
});