import { describe, it, expect } from "vitest";
import { normalizePath } from "../normalize-path.js";

describe("normalizePath", () => {
  describe("basic functionality", () => {
    it("should remove file extensions", () => {
      expect(normalizePath("api/users.ts")).toBe("/api/users.all");
      expect(normalizePath("api/users.js")).toBe("/api/users.all");
      expect(normalizePath("api/users.tsx")).toBe("/api/users.all");
    });

    it("should preserve HTTP method extensions", () => {
      expect(normalizePath("api/users.get.ts")).toBe("/api/users.get");
      expect(normalizePath("api/users.post.ts")).toBe("/api/users.post");
      expect(normalizePath("api/users.put.ts")).toBe("/api/users.put");
      expect(normalizePath("api/users.delete.ts")).toBe("/api/users.delete");
      expect(normalizePath("api/users.patch.ts")).toBe("/api/users.patch");
      expect(normalizePath("api/users.all.ts")).toBe("/api/users.all");
    });

    it("should handle middleware extension", () => {
      expect(normalizePath("middleware/auth.middleware.ts")).toBe(
        "/middleware/auth.middleware"
      );
    });

    it("should convert to lowercase", () => {
      expect(normalizePath("API/USERS.GET.ts")).toBe("/api/users.get");
      expect(normalizePath("Api/Users.Post.TS")).toBe("/api/users.post");
    });
  });

  describe("default method handling", () => {
    it("should default to 'all' when no method specified", () => {
      expect(normalizePath("api/users.ts")).toBe("/api/users.all");
      expect(normalizePath("users.ts")).toBe("/users.all");
      expect(normalizePath("index.ts")).toBe("/index.all");
    });

    it("should handle files without method in name", () => {
      expect(normalizePath("api/v1/users.ts")).toBe("/api/v1/users.all");
      expect(normalizePath("health.ts")).toBe("/health.all");
    });
  });

  describe("path handling", () => {
    it("should handle root paths", () => {
      expect(normalizePath("index.get.ts")).toBe("/index.get");
      expect(normalizePath("root.ts")).toBe("/root.all");
    });

    it("should handle nested paths", () => {
      expect(normalizePath("api/v1/users.get.ts")).toBe("/api/v1/users.get");
      expect(normalizePath("api/v1/users/posts.put.ts")).toBe(
        "/api/v1/users/posts.put"
      );
    });

    it("should handle paths with special characters", () => {
      expect(normalizePath("api/users-123.get.ts")).toBe("/api/users-123.get");
      expect(normalizePath("api/users_123.post.ts")).toBe(
        "/api/users_123.post"
      );
    });

    it("should handle paths starting with underscore or dash", () => {
      expect(normalizePath("_private/route.get.ts")).toBe(
        "/_private/route.get"
      );
      expect(normalizePath("-special/route.post.ts")).toBe(
        "/-special/route.post"
      );
    });
  });

  describe("edge cases", () => {
    it("should handle files with multiple dots", () => {
      expect(normalizePath("api.users.get.ts")).toBe("/api.users.get");
      expect(normalizePath("v1.api.users.ts")).toBe("/v1.api.users.all");
    });

    it("should handle files with no extension", () => {
      // This shouldn't happen in practice, but test robustness
      expect(normalizePath("api/users")).toBe("/index.all");
    });

    it("should handle empty string", () => {
      expect(normalizePath("")).toBe("/index.all");
    });

    it("should handle single dot", () => {
      expect(normalizePath(".")).toBe("/index.all");
    });
  });

  describe("case sensitivity", () => {
    it("should be case insensitive for methods", () => {
      expect(normalizePath("api/users.GET.ts")).toBe("/api/users.get");
      expect(normalizePath("api/users.Post.ts")).toBe("/api/users.post");
      expect(normalizePath("api/users.ALL.ts")).toBe("/api/users.all");
    });

    it("should preserve case in paths", () => {
      expect(normalizePath("API/Users.get.ts")).toBe("/api/users.get");
      expect(normalizePath("Api/Users.get.ts")).toBe("/api/users.get");
    });
  });

  describe("return value", () => {
    it("should always return a string", () => {
      expect(typeof normalizePath("test.ts")).toBe("string");
      expect(typeof normalizePath("")).toBe("string");
    });

    it("should not return the original string", () => {
      const input = "api/users.get.ts";
      const result = normalizePath(input);

      expect(result).not.toBe(input);
      expect(result).toBe("/api/users.get");
    });
  });
});
