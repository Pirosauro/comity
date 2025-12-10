import type { AuthModuleOptions } from "../../types.js";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { handleLogout } from "../handle-logout.js";

// Mock dependencies
vi.mock("hono/cookie", () => ({
  deleteCookie: vi.fn(),
}));

import { deleteCookie } from "hono/cookie";

describe("handleLogout", () => {
  const mockDeleteCookie = vi.mocked(deleteCookie);

  const mockContext = {
    set: vi.fn(),
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mocks to their default behavior
    mockDeleteCookie.mockReturnValue(undefined);
    mockContext.set.mockImplementation(() => {});
  });

  describe("cookie deletion", () => {
    it("should delete authentication cookie with default name", () => {
      const options: AuthModuleOptions = {
        secret: "test-secret",
      };

      handleLogout(mockContext, options);

      expect(mockDeleteCookie).toHaveBeenCalledWith(mockContext, "auth-token");
      expect(mockContext.set).toHaveBeenCalledWith("user", undefined);
    });

    it("should delete authentication cookie with custom name", () => {
      const options: AuthModuleOptions = {
        secret: "test-secret",
        cookie: {
          name: "custom-session",
        },
      };

      handleLogout(mockContext, options);

      expect(mockDeleteCookie).toHaveBeenCalledWith(
        mockContext,
        "custom-session"
      );
      expect(mockContext.set).toHaveBeenCalledWith("user", undefined);
    });

    it("should handle empty cookie name by using default", () => {
      const options: AuthModuleOptions = {
        secret: "test-secret",
        cookie: {
          name: "",
        },
      };

      handleLogout(mockContext, options);

      expect(mockDeleteCookie).toHaveBeenCalledWith(mockContext, "auth-token");
      expect(mockContext.set).toHaveBeenCalledWith("user", undefined);
    });

    it("should handle undefined cookie name by using default", () => {
      const options: AuthModuleOptions = {
        secret: "test-secret",
        cookie: {
          name: undefined,
        },
      };

      handleLogout(mockContext, options);

      expect(mockDeleteCookie).toHaveBeenCalledWith(mockContext, "auth-token");
      expect(mockContext.set).toHaveBeenCalledWith("user", undefined);
    });
  });

  describe("context clearing", () => {
    it("should clear user from context", () => {
      const options: AuthModuleOptions = {
        secret: "test-secret",
        cookie: {
          name: "session-token",
        },
      };

      handleLogout(mockContext, options);

      expect(mockContext.set).toHaveBeenCalledWith("user", undefined);
      expect(mockDeleteCookie).toHaveBeenCalledWith(
        mockContext,
        "session-token"
      );
    });

    it("should clear user even if no cookie configuration", () => {
      const options: AuthModuleOptions = {
        secret: "test-secret",
      };

      handleLogout(mockContext, options);

      expect(mockContext.set).toHaveBeenCalledWith("user", undefined);
      expect(mockDeleteCookie).toHaveBeenCalledWith(mockContext, "auth-token");
    });

    it("should handle context.set throwing an error", () => {
      const options: AuthModuleOptions = {
        secret: "test-secret",
      };

      mockContext.set.mockImplementation(() => {
        throw new Error("Context set failed");
      });

      expect(() => handleLogout(mockContext, options)).toThrow(
        "Context set failed"
      );

      expect(mockDeleteCookie).toHaveBeenCalledWith(mockContext, "auth-token");
    });
  });

  describe("error handling", () => {
    it("should handle deleteCookie throwing an error", () => {
      const options: AuthModuleOptions = {
        secret: "test-secret",
        cookie: {
          name: "error-cookie",
        },
      };

      mockDeleteCookie.mockImplementation(() => {
        throw new Error("Cookie deletion failed");
      });

      expect(() => handleLogout(mockContext, options)).toThrow(
        "Cookie deletion failed"
      );

      expect(mockDeleteCookie).toHaveBeenCalledWith(
        mockContext,
        "error-cookie"
      );
      expect(mockContext.set).not.toHaveBeenCalled();
    });

    it("should propagate both deleteCookie and context.set errors", () => {
      const options: AuthModuleOptions = {
        secret: "test-secret",
      };

      mockDeleteCookie.mockImplementation(() => {
        throw new Error("Cookie deletion failed");
      });

      expect(() => handleLogout(mockContext, options)).toThrow(
        "Cookie deletion failed"
      );
    });
  });

  describe("edge cases", () => {
    it("should handle complex cookie configuration properly", () => {
      const options: AuthModuleOptions = {
        secret: "test-secret",
        cookie: {
          name: "complex-auth-token",
          domain: "example.com",
          path: "/app",
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 3600,
        },
      };

      handleLogout(mockContext, options);

      // Only the cookie name should be used for deletion
      expect(mockDeleteCookie).toHaveBeenCalledWith(
        mockContext,
        "complex-auth-token"
      );
      expect(mockContext.set).toHaveBeenCalledWith("user", undefined);
    });

    it("should handle null options.cookie", () => {
      const options: AuthModuleOptions = {
        secret: "test-secret",
        cookie: null as any,
      };

      handleLogout(mockContext, options);

      expect(mockDeleteCookie).toHaveBeenCalledWith(mockContext, "auth-token");
      expect(mockContext.set).toHaveBeenCalledWith("user", undefined);
    });

    it("should handle undefined options.cookie", () => {
      const options: AuthModuleOptions = {
        secret: "test-secret",
        cookie: undefined,
      };

      handleLogout(mockContext, options);

      expect(mockDeleteCookie).toHaveBeenCalledWith(mockContext, "auth-token");
      expect(mockContext.set).toHaveBeenCalledWith("user", undefined);
    });
  });

  describe("multiple calls", () => {
    it("should handle multiple logout calls safely", () => {
      const options: AuthModuleOptions = {
        secret: "test-secret",
        cookie: {
          name: "multi-session",
        },
      };

      // First logout
      handleLogout(mockContext, options);

      expect(mockDeleteCookie).toHaveBeenCalledTimes(1);
      expect(mockContext.set).toHaveBeenCalledTimes(1);

      // Second logout
      handleLogout(mockContext, options);

      expect(mockDeleteCookie).toHaveBeenCalledTimes(2);
      expect(mockContext.set).toHaveBeenCalledTimes(2);

      expect(mockDeleteCookie).toHaveBeenCalledWith(
        mockContext,
        "multi-session"
      );
      expect(mockContext.set).toHaveBeenCalledWith("user", undefined);
    });
  });

  describe("function behavior", () => {
    it("should not return a value (void function)", () => {
      const options: AuthModuleOptions = {
        secret: "test-secret",
      };

      const result = handleLogout(mockContext, options);

      expect(result).toBeUndefined();
    });

    it("should be synchronous", () => {
      const options: AuthModuleOptions = {
        secret: "test-secret",
      };

      const start = Date.now();
      handleLogout(mockContext, options);
      const end = Date.now();

      // Should complete almost immediately (synchronous)
      expect(end - start).toBeLessThan(10);
    });
  });
});
