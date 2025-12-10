import { describe, it, expect, vi, beforeEach } from "vitest";
import { handleLogin } from "../handle-login.js";
import type { AuthUser, AuthModuleOptions } from "../../types.js";

// Mock dependencies
vi.mock("../sign-token.js", () => ({
  signToken: vi.fn(),
}));

vi.mock("hono/cookie", () => ({
  setCookie: vi.fn(),
}));

import { signToken } from "../sign-token.js";
import { setCookie } from "hono/cookie";

describe("handleLogin", () => {
  const mockSignToken = vi.mocked(signToken);
  const mockSetCookie = vi.mocked(setCookie);

  const mockUser: AuthUser = {
    id: "user-123",
    roles: { default: ["user"] },
    email: "test@example.com",
  };

  const mockContext = {
    set: vi.fn(),
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("token creation and context", () => {
    it("should create JWT token and set user in context", async () => {
      const options: AuthModuleOptions = {
        secret: "test-secret",
      };

      mockSignToken.mockResolvedValue("jwt-token-123");

      const result = await handleLogin(mockUser, mockContext, options);

      expect(mockSignToken).toHaveBeenCalledWith(mockUser, options);
      expect(mockContext.set).toHaveBeenCalledWith("user", mockUser);
      expect(result).toBe("jwt-token-123");
    });

    it("should handle complex user data", async () => {
      const complexUser: AuthUser = {
        id: "admin-456",
        roles: { admin: ["admin", "moderator"], general: ["user"] },
        email: "admin@company.com",
        name: "Admin User",
        permissions: ["read", "write", "delete"],
        metadata: {
          department: "IT",
          lastLogin: "2023-01-01T00:00:00Z",
        },
      };

      const options: AuthModuleOptions = {
        secret: "test-secret",
        algorithm: "HS512",
      };

      mockSignToken.mockResolvedValue("complex-jwt-token");

      const result = await handleLogin(complexUser, mockContext, options);

      expect(mockSignToken).toHaveBeenCalledWith(complexUser, options);
      expect(mockContext.set).toHaveBeenCalledWith("user", complexUser);
      expect(result).toBe("complex-jwt-token");
    });
  });

  describe("cookie configuration", () => {
    it("should set cookie when cookie options are provided", async () => {
      const options: AuthModuleOptions = {
        secret: "test-secret",
        cookie: {
          name: "auth-token",
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          domain: "example.com",
          path: "/app",
          maxAge: 3600,
        },
      };

      mockSignToken.mockResolvedValue("jwt-with-cookie");

      await handleLogin(mockUser, mockContext, options);

      expect(mockSetCookie).toHaveBeenCalledWith(
        mockContext,
        "auth-token",
        "jwt-with-cookie",
        {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          domain: "example.com",
          path: "/app",
          maxAge: 3600,
        }
      );
    });

    it("should apply default cookie values when not specified", async () => {
      const options: AuthModuleOptions = {
        secret: "test-secret",
        cookie: {
          name: "custom-auth",
        },
      };

      mockSignToken.mockResolvedValue("jwt-default-cookie");

      await handleLogin(mockUser, mockContext, options);

      expect(mockSetCookie).toHaveBeenCalledWith(
        mockContext,
        "custom-auth",
        "jwt-default-cookie",
        {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          domain: undefined,
          path: "/",
          maxAge: undefined,
        }
      );
    });

    it("should not set cookie when cookie options are not provided", async () => {
      const options: AuthModuleOptions = {
        secret: "test-secret",
      };

      mockSignToken.mockResolvedValue("jwt-no-cookie");

      await handleLogin(mockUser, mockContext, options);

      expect(mockSetCookie).not.toHaveBeenCalled();
    });

    it("should handle partial cookie configuration", async () => {
      const options: AuthModuleOptions = {
        secret: "test-secret",
        cookie: {
          name: "session",
          secure: false,
          maxAge: 7200,
        },
      };

      mockSignToken.mockResolvedValue("jwt-partial-cookie");

      await handleLogin(mockUser, mockContext, options);

      expect(mockSetCookie).toHaveBeenCalledWith(
        mockContext,
        "session",
        "jwt-partial-cookie",
        {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          domain: undefined,
          path: "/",
          maxAge: 7200,
        }
      );
    });
  });

  describe("cookie sameSite configurations", () => {
    it.each([
      ["strict", "strict"],
      ["lax", "lax"],
      ["none", "none"],
    ])("should handle sameSite: %s", async (sameSiteValue, expected) => {
      const options: AuthModuleOptions = {
        secret: "test-secret",
        cookie: {
          name: "auth-token",
          sameSite: sameSiteValue as "strict" | "lax" | "none",
        },
      };

      mockSignToken.mockResolvedValue("jwt-samesite");

      await handleLogin(mockUser, mockContext, options);

      expect(mockSetCookie).toHaveBeenCalledWith(
        mockContext,
        "auth-token",
        "jwt-samesite",
        expect.objectContaining({
          sameSite: expected,
        })
      );
    });
  });

  describe("error handling", () => {
    it("should propagate signToken errors", async () => {
      const options: AuthModuleOptions = {
        secret: "test-secret",
      };

      const tokenError = new Error("Token signing failed");
      mockSignToken.mockRejectedValue(tokenError);

      await expect(handleLogin(mockUser, mockContext, options)).rejects.toThrow(
        "Token signing failed"
      );

      expect(mockContext.set).not.toHaveBeenCalled();
      expect(mockSetCookie).not.toHaveBeenCalled();
    });

    it("should handle setCookie errors gracefully", async () => {
      const options: AuthModuleOptions = {
        secret: "test-secret",
        cookie: {
          name: "auth-token",
        },
      };

      mockSignToken.mockResolvedValue("jwt-token");
      mockSetCookie.mockImplementation(() => {
        throw new Error("Cookie setting failed");
      });

      await expect(handleLogin(mockUser, mockContext, options)).rejects.toThrow(
        "Cookie setting failed"
      );

      expect(mockSignToken).toHaveBeenCalled();
      // When setCookie throws, context.set never gets called because it comes after
      expect(mockContext.set).not.toHaveBeenCalled();
    });
  });

  describe("edge cases", () => {
    it("should handle user with minimal data", async () => {
      const minimalUser: AuthUser = {
        id: "min-user",
        roles: { default: ["guest"] },
        email: "min@test.com",
      };

      const options: AuthModuleOptions = {
        secret: "test-secret",
      };

      mockSignToken.mockResolvedValue("minimal-jwt");

      const result = await handleLogin(minimalUser, mockContext, options);

      expect(mockSignToken).toHaveBeenCalledWith(minimalUser, options);
      expect(mockContext.set).toHaveBeenCalledWith("user", minimalUser);
      expect(result).toBe("minimal-jwt");
    });

    it("should handle empty cookie domain and path", async () => {
      const options: AuthModuleOptions = {
        secret: "test-secret",
        cookie: {
          name: "auth",
          domain: "",
          path: "",
        },
      };

      // Clear the mock from previous test
      mockSetCookie.mockReset();
      mockSignToken.mockResolvedValue("jwt-empty-values");

      await handleLogin(mockUser, mockContext, options);

      expect(mockSetCookie).toHaveBeenCalledWith(
        mockContext,
        "auth",
        "jwt-empty-values",
        {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          domain: "",
          path: "/", // Empty path gets defaulted to "/"
          maxAge: undefined,
        }
      );
    });

    it("should handle cookie maxAge of 0", async () => {
      const options: AuthModuleOptions = {
        secret: "test-secret",
        cookie: {
          name: "auth",
          maxAge: 0,
        },
      };

      // Clear the mock from previous test
      mockSetCookie.mockReset();
      mockSignToken.mockResolvedValue("jwt-zero-maxage");

      await handleLogin(mockUser, mockContext, options);

      expect(mockSetCookie).toHaveBeenCalledWith(
        mockContext,
        "auth",
        "jwt-zero-maxage",
        expect.objectContaining({
          maxAge: 0,
        })
      );
    });
  });

  describe("context mutations", () => {
    it("should not mutate the original user object", async () => {
      const originalUser = {
        id: "test-user",
        roles: { default: ["user"] },
        email: "test@example.com",
        metadata: { loginCount: 5 },
      };

      const options: AuthModuleOptions = {
        secret: "test-secret",
      };

      mockSignToken.mockResolvedValue("jwt-immutable");

      await handleLogin(originalUser, mockContext, options);

      // User object should remain unchanged
      expect(originalUser).toEqual({
        id: "test-user",
        roles: { default: ["user"] },
        email: "test@example.com",
        metadata: { loginCount: 5 },
      });

      expect(mockContext.set).toHaveBeenCalledWith("user", originalUser);
    });

    it("should handle context.set throwing an error", async () => {
      const options: AuthModuleOptions = {
        secret: "test-secret",
      };

      mockSignToken.mockResolvedValue("jwt-context-error");
      mockContext.set.mockImplementation(() => {
        throw new Error("Context set failed");
      });

      await expect(handleLogin(mockUser, mockContext, options)).rejects.toThrow(
        "Context set failed"
      );

      expect(mockSignToken).toHaveBeenCalled();
    });
  });
});
