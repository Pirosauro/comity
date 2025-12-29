import { describe, it, expect } from "vitest";
import { CliConfigNotFoundError } from "../config-not-found.js";

describe("CliConfigNotFoundError", () => {
  it("should create error with correct message and metadata", () => {
    const searchedPaths = ["/path1", "/path2"];
    const error = new CliConfigNotFoundError({
      searchedPaths,
      cause: new Error("Not found"),
    });

    expect(error).toBeInstanceOf(CliConfigNotFoundError);
    expect(error.message).toBe("CLI configuration file not found");
    expect(error.code).toBe("CLI_CONFIG_NOT_FOUND");
    expect(error.meta.httpStatus).toBe(400);
    expect(error.meta.searchedPaths).toEqual(searchedPaths);
    expect(error.cause).toBeInstanceOf(Error);
  });

  it("should create error without cause", () => {
    const searchedPaths = ["/path1"];
    const error = new CliConfigNotFoundError({
      searchedPaths,
    });

    expect(error.message).toBe("CLI configuration file not found");
    expect(error.meta.searchedPaths).toEqual(searchedPaths);
    expect(error.meta.cause).toBeUndefined();
  });
});
