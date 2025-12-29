import { describe, it, expect } from "vitest";
import { CliInvalidConfigPathError } from "../config-invalid-path.js";

describe("CliInvalidConfigPathError", () => {
  it("should create error with correct message and metadata", () => {
    const error = new CliInvalidConfigPathError({
      path: "/invalid/path",
      cwd: "/current/dir",
      cause: new Error("Original error"),
    });

    expect(error).toBeInstanceOf(CliInvalidConfigPathError);
    expect(error.message).toBe("Invalid CLI configuration file path");
    expect(error.code).toBe("CLI_INVALID_CONFIG_PATH");
    expect(error.meta.httpStatus).toBe(400);
    expect(error.meta.path).toBe("/invalid/path");
    expect(error.meta.cwd).toBe("/current/dir");
    expect(error.cause).toBeInstanceOf(Error);
  });

  it("should create error without cause", () => {
    const error = new CliInvalidConfigPathError({
      path: "/invalid/path",
      cwd: "/current/dir",
    });

    expect(error.message).toBe("Invalid CLI configuration file path");
    expect(error.meta.path).toBe("/invalid/path");
    expect(error.meta.cwd).toBe("/current/dir");
    expect(error.meta.cause).toBeUndefined();
  });
});
