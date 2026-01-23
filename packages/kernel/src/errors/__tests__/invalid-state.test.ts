import { describe, expect, it } from "vitest";
import { KernelInvalidStateError } from "../kernel-invalid-state.js";

describe("KernelInvalidStateError", () => {
  it("should create error with meta", () => {
    const error = new KernelInvalidStateError({
      action: "test action",
      state: "open",
    });

    expect(error.message).toBe("Invalid kernel state");
    expect(error.code).toBe("kernel:invalid-state");
    expect(error.name).toBe("KernelInvalidStateError");
    expect(error.meta.httpStatus).toBe(409);
    expect(error.meta.action).toBe("test action");
    expect(error.meta.state).toBe("open");
  });

  it("should create error with different states", () => {
    const states: ("open" | "sealed" | "running" | "stopped")[] = [
      "open",
      "sealed",
      "running",
      "stopped",
    ];

    states.forEach((state) => {
      const error = new KernelInvalidStateError({
        action: "test",
        state,
      });

      expect(error.meta.state).toBe(state);
    });
  });

  it("should include additional metadata", () => {
    const error = new KernelInvalidStateError({
      action: "seal",
      state: "running",
      details: "Cannot seal when running",
    });

    expect(error.meta.details).toBe("Cannot seal when running");
    expect(error.meta.httpStatus).toBe(409);
  });

  it("should be instanceof Error", () => {
    const error = new KernelInvalidStateError({
      action: "test",
      state: "open",
    });

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(KernelInvalidStateError);
  });

  it("should have correct stack trace", () => {
    const error = new KernelInvalidStateError({
      action: "test",
      state: "open",
    });

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain("KernelInvalidStateError");
  });
});
