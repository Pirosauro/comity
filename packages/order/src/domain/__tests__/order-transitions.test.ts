import { isFailure, isSuccess } from "@comity/primitives/result";
import { describe, expect, it } from "vitest";
import { canTransition, transitionOrderStatus } from "../order-transitions.js";

describe("order transitions", () => {
  it("should allow draft → pending", () => {
    expect(canTransition("draft", "pending")).toBe(true);
  });

  it("should allow draft → cancelled", () => {
    expect(canTransition("draft", "cancelled")).toBe(true);
  });

  it("should allow pending → confirmed", () => {
    expect(canTransition("pending", "confirmed")).toBe(true);
  });

  it("should allow pending → cancelled", () => {
    expect(canTransition("pending", "cancelled")).toBe(true);
  });

  it("should allow confirmed → fulfilled", () => {
    expect(canTransition("confirmed", "fulfilled")).toBe(true);
  });

  it("should allow confirmed → cancelled", () => {
    expect(canTransition("confirmed", "cancelled")).toBe(true);
  });

  it("should forbid backwards transitions", () => {
    expect(canTransition("confirmed", "pending")).toBe(false);
    expect(canTransition("pending", "draft")).toBe(false);
    expect(canTransition("fulfilled", "confirmed")).toBe(false);
  });

  it("should forbid transitions from terminal states", () => {
    expect(canTransition("fulfilled", "cancelled")).toBe(false);
    expect(canTransition("cancelled", "draft")).toBe(false);
    expect(canTransition("cancelled", "pending")).toBe(false);
  });

  it("should return the target status on success", () => {
    const result = transitionOrderStatus("draft", "pending");

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value).toBe("pending");
    }
  });

  it("should return an invalid_status_transition error", () => {
    const result = transitionOrderStatus("fulfilled", "pending");

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error.code).toBe("order:invalid_status_transition");
    }
  });
});
