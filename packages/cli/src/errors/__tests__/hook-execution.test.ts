import { describe, it, expect } from "vitest";
import { CliHookExecutionError } from "../hook-execution.js";

describe("CliHookExecutionError", () => {
  it("should create error with correct message and metadata", () => {
    const cause = new Error("Hook failed");
    const error = new CliHookExecutionError({
      hook: "beforeCommand",
      cause,
    });

    expect(error).toBeInstanceOf(CliHookExecutionError);
    expect(error.message).toBe("CLI hook execution failed");
    expect(error.code).toBe("CLI_HOOK_EXECUTION_ERROR");
    expect(error.meta.httpStatus).toBe(500);
    expect(error.meta.hook).toBe("beforeCommand");
    expect(error.cause).toBe(cause);
  });
});
