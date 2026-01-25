import { describe, expect, it } from "vitest";
import { InvalidLifecycleStateError } from "../invalid-lifecycle-state.js";

describe("InvalidLifecycleStateError", () => {
  it("should create error with metadata", () => {
    const error = new InvalidLifecycleStateError({
      action: "use",
      state: "running",
    });

    expect(error.message).toBe("Invalid HTTP lifecycle state");
    expect(error.code).toBe("http:invalid-lifecycle-state");
    expect(error.name).toBe("InvalidLifecycleStateError");
    expect(error.meta.httpStatus).toBe(409);
    expect(error.meta.action).toBe("use");
    expect(error.meta.state).toBe("running");
  });

  it("should be instanceof Error", () => {
    const error = new InvalidLifecycleStateError({
      action: "handle",
      state: "open",
    });

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(InvalidLifecycleStateError);
  });

  it("should have correct stack trace", () => {
    const error = new InvalidLifecycleStateError({
      action: "seal",
      state: "sealed",
    });

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain("InvalidLifecycleStateError");
  });

  it("should handle different lifecycle states", () => {
    const states = ["open", "sealed", "running", "stopped"] as const;

    for (const state of states) {
      const error = new InvalidLifecycleStateError({
        action: "test",
        state,
      });

      expect(error.meta.state).toBe(state);
    }
  });

  it("should handle various actions", () => {
    const actions = ["use", "handle", "seal", "start"];

    for (const action of actions) {
      const error = new InvalidLifecycleStateError({
        action,
        state: "open",
      });

      expect(error.meta.action).toBe(action);
    }
  });

  it("should preserve all metadata properties", () => {
    const error = new InvalidLifecycleStateError({
      action: "test",
      state: "running",
    });

    expect(error.meta).toHaveProperty("action");
    expect(error.meta).toHaveProperty("state");
    expect(error.meta).toHaveProperty("httpStatus");
  });
});
