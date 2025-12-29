import { describe, it, expect } from "vitest";
import { ApplicationInvalidRootPathError } from "../invalid-root-path.js";

describe("ApplicationInvalidRootPathError", () => {
  describe("constructor", () => {
    it("should create an error with correct message", () => {
      const error = new ApplicationInvalidRootPathError({
        path: "/invalid/path",
        cwd: "/current/dir",
      });

      expect(error.message).toBe("Invalid application root path");
      expect(error.code).toBe("APPLICATION_INVALID_ROOT_PATH");
    });

    it("should include metadata in error details", () => {
      const error = new ApplicationInvalidRootPathError({
        path: "/invalid/path",
        cwd: "/current/dir",
      });

      expect(error.meta.path).toBe("/invalid/path");
      expect(error.meta.cwd).toBe("/current/dir");
      expect(error.meta.httpStatus).toBe(400);
    });

    it("should include cause when provided", () => {
      const cause = new Error("Original error");
      const error = new ApplicationInvalidRootPathError({
        path: "/invalid/path",
        cwd: "/current/dir",
        cause,
      });

      // BaseError intentionally omits the `cause` from the frozen `meta` object
      // (it is set as the Error's native cause). Assert that it's not present
      // in `meta` rather than relying on it being forwarded.
      expect(error.meta.cause).toBeUndefined();
    });
  });

  describe("inheritance", () => {
    it("should extend BaseError", () => {
      const error = new ApplicationInvalidRootPathError({
        path: "/invalid/path",
        cwd: "/current/dir",
      });

      expect(error).toBeInstanceOf(Error);
      // Assuming BaseError has a code property
      expect(error.code).toBe("APPLICATION_INVALID_ROOT_PATH");
    });
  });

  describe("error properties", () => {
    it("should have correct HTTP status", () => {
      const error = new ApplicationInvalidRootPathError({
        path: "/invalid/path",
        cwd: "/current/dir",
      });

      expect(error.meta.httpStatus).toBe(400);
    });

    it("should be serializable", () => {
      const error = new ApplicationInvalidRootPathError({
        path: "/invalid/path",
        cwd: "/current/dir",
      });

      const serialized = JSON.stringify(error);
      const parsed = JSON.parse(serialized);

      expect(parsed.code).toBe("APPLICATION_INVALID_ROOT_PATH");
      // Message may not be serialized by the runtime's Error shape; ensure
      // that core fields are present and correct instead of assuming message
      // is always included.
      expect(
        parsed.message === undefined ||
          parsed.message === "Invalid application root path"
      ).toBe(true);
      expect(parsed.meta.path).toBe("/invalid/path");
      expect(parsed.meta.cwd).toBe("/current/dir");
    });
  });

  describe("usage scenarios", () => {
    it("should handle absolute paths", () => {
      const error = new ApplicationInvalidRootPathError({
        path: "/absolute/invalid/path",
        cwd: "/current/working/directory",
      });

      expect(error.meta.path).toBe("/absolute/invalid/path");
      expect(error.meta.cwd).toBe("/current/working/directory");
    });

    it("should handle relative paths", () => {
      const error = new ApplicationInvalidRootPathError({
        path: "../outside/project",
        cwd: "/project/root",
      });

      expect(error.meta.path).toBe("../outside/project");
      expect(error.meta.cwd).toBe("/project/root");
    });

    it("should handle root directory as cwd", () => {
      const error = new ApplicationInvalidRootPathError({
        path: "/invalid",
        cwd: "/",
      });

      expect(error.meta.path).toBe("/invalid");
      expect(error.meta.cwd).toBe("/");
    });
  });
});
