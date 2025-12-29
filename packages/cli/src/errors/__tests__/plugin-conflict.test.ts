import { describe, it, expect } from "vitest";
import { CliPluginConflictError } from "../plugin-conflict.js";

describe("CliPluginConflictError", () => {
  it("should create error with correct message and metadata", () => {
    const error = new CliPluginConflictError({
      plugin: "test-plugin",
      cause: new Error("Original error"),
    });

    expect(error).toBeInstanceOf(CliPluginConflictError);
    expect(error.message).toBe("CLI plugin already registered");
    expect(error.code).toBe("CLI_PLUGIN_CONFLICT");
    expect(error.meta.httpStatus).toBe(409);
    expect(error.meta.plugin).toBe("test-plugin");
    expect(error.cause).toBeInstanceOf(Error);
  });

  it("should create error without cause", () => {
    const error = new CliPluginConflictError({
      plugin: "test-plugin",
    });

    expect(error.message).toBe("CLI plugin already registered");
    expect(error.meta.plugin).toBe("test-plugin");
    expect(error.meta.cause).toBeUndefined();
  });
});
