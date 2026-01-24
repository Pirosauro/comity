import { describe, expect, it } from "vitest";
import { InvalidLifecycleStateError } from "../invalid-lifecycle-state.js";

describe("InvalidLifecycleStateError", () => {
  it("should create error with meta", () => {
    const error = new InvalidLifecycleStateError({
      action: "test action",
      state: "open",
    });

    expect(error.message).toBe("Invalid kernel lifecycle state");
    expect(error.code).toBe("kernel:invalid-lifecycle-state");
    expect(error.name).toBe("InvalidLifecycleStateError");
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
      const error = new InvalidLifecycleStateError({
        action: "test",
        state,
      });

      expect(error.meta.state).toBe(state);
    });
  });

  it("should include additional metadata", () => {
    const error = new InvalidLifecycleStateError({
      action: "seal",
      state: "running",
      details: "Cannot seal when running",
    });

    expect(error.meta.details).toBe("Cannot seal when running");
    expect(error.meta.httpStatus).toBe(409);
  });

  it("should be instanceof Error", () => {
    const error = new InvalidLifecycleStateError({
      action: "test",
      state: "open",
    });

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(InvalidLifecycleStateError);
  });

  it("should have correct stack trace", () => {
    const error = new InvalidLifecycleStateError({
      action: "test",
      state: "open",
    });

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain("InvalidLifecycleStateError");
  });
});
