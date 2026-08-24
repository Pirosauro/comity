import { isFailure, isSuccess } from "@comity/primitives/result";

import { describe, expect, it } from "vitest";
import { transitionProductStatus } from "../product-status.js";

describe("transitionProductStatus", () => {
  it("should allow draft to active", () => {
    const result = transitionProductStatus("draft", "active");

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value).toBe("active");
    }
  });

  it("should allow active to inactive", () => {
    expect(isSuccess(transitionProductStatus("active", "inactive"))).toBe(true);
  });

  it("should allow inactive back to active", () => {
    expect(isSuccess(transitionProductStatus("inactive", "active"))).toBe(true);
  });

  it("should allow active to archived", () => {
    expect(isSuccess(transitionProductStatus("active", "archived"))).toBe(true);
  });

  it("should reject non-linear transitions", () => {
    const result = transitionProductStatus("draft", "archived");

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error.code).toBe("catalog:invalid_status_transition");
      expect(result.error.meta.details).toMatchObject({ from: "draft", to: "archived" });
    }
  });

  it("should reject self-transitions", () => {
    expect(isFailure(transitionProductStatus("active", "active"))).toBe(true);
  });

  it("should reject transitions from the terminal archived state", () => {
    expect(isFailure(transitionProductStatus("archived", "active"))).toBe(true);
  });
});