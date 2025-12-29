import { describe, it, expect } from "vitest";
import { CliCommandConflictError } from "../command-conflict.js";

describe("CliCommandConflictError", () => {
  it("should create error with correct message and metadata", () => {
    const error = new CliCommandConflictError({
      command: "test-command",
      cause: new Error("Original error"),
    });

    expect(error).toBeInstanceOf(CliCommandConflictError);
    expect(error.message).toBe("CLI command already registered");
    expect(error.code).toBe("CLI_COMMAND_CONFLICT");
    expect(error.meta.httpStatus).toBe(409);
    expect(error.meta.command).toBe("test-command");
    expect(error.cause).toBeInstanceOf(Error);
  });

  it("should create error without cause", () => {
    const error = new CliCommandConflictError({
      command: "test-command",
    });

    expect(error.message).toBe("CLI command already registered");
    expect(error.meta.command).toBe("test-command");
    expect(error.meta.cause).toBeUndefined();
  });
});
