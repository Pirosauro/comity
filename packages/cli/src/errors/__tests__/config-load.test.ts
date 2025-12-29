import { describe, it, expect } from "vitest";
import { CliConfigLoadError } from "../config-load.js";

describe("CliConfigLoadError", () => {
  it("should create error with correct message and metadata", () => {
    const error = new CliConfigLoadError({
      path: "/config/file.js",
      cause: new Error("Load failed"),
    });

    expect(error).toBeInstanceOf(CliConfigLoadError);
    expect(error.message).toBe("Failed to load CLI configuration file");
    expect(error.code).toBe("CLI_CONFIG_LOAD_ERROR");
    expect(error.meta.httpStatus).toBe(400);
    expect(error.meta.path).toBe("/config/file.js");
    expect(error.cause).toBeInstanceOf(Error);
  });
});
