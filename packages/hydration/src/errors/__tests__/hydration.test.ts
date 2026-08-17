import { describe, expect, it } from "vitest";
import { HydrationError } from "../hydration.js";

describe("HydrationError", () => {
  it("creates an error with the not_registered reason", () => {
    const error = new HydrationError("not_registered");

    expect(error.code).toBe("hydration:not_registered");
    expect(error.message).toBe("The island component is not registered");
    expect(error.meta.reason).toBe("not_registered");
  });

  it("creates an error with the invalid_component reason", () => {
    const error = new HydrationError("invalid_component");

    expect(error.code).toBe("hydration:invalid_component");
    expect(error.message).toBe("The island component is invalid");
    expect(error.meta.reason).toBe("invalid_component");
  });

  it("creates an error with the timeout reason", () => {
    const error = new HydrationError("timeout");

    expect(error.code).toBe("hydration:timeout");
    expect(error.message).toBe("Hydration timed out");
    expect(error.meta.reason).toBe("timeout");
  });

  it("merges component details", () => {
    const error = new HydrationError("not_registered", {
      details: { component: "Hero" },
    });

    expect(error.meta.details).toEqual({ component: "Hero" });
  });

  it("merges timeout details", () => {
    const error = new HydrationError("timeout", {
      details: { limit: 5000 },
    });

    expect(error.meta.details).toEqual({ limit: 5000 });
  });

  it("is an instance of Error", () => {
    const error = new HydrationError("invalid_component");

    expect(error).toBeInstanceOf(Error);
  });
});