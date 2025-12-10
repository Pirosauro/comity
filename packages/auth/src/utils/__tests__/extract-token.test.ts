import { describe, it, expect, vi, beforeEach } from "vitest";
import { extractToken } from "../extract-token.js";

// Mock Hono's getCookie function
vi.mock("hono/cookie", () => ({
  getCookie: vi.fn(),
}));

describe("extractToken", () => {
  it("should return null if header extraction throws an error", () => {
    const context = {
      req: {
        header: vi.fn(() => {
          throw new Error("Header error");
        }),
      },
      env: {},
      executionCtx: {},
    };
    const token = extractToken(context as any, defaultOptions);
    expect(token).toBeNull();
  });
  let mockGetCookie: any;

  const createMockContext = (headers: Record<string, string> = {}) => ({
    req: {
      header: vi.fn((name: string) => headers[name.toLowerCase()]),
    },
    env: {},
    executionCtx: {},
  });

  const defaultOptions = {
    header: { name: "authorization", prefix: "Bearer " },
    cookie: { name: "auth-token" },
  };

  beforeEach(async () => {
    const { getCookie } = await import("hono/cookie");
    mockGetCookie = vi.mocked(getCookie);
    vi.clearAllMocks();
  });

  describe("Authorization header extraction", () => {
    it("should extract token from Authorization header with Bearer prefix", () => {
      const context = createMockContext({
        authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      });
      const token = extractToken(context as any, defaultOptions);
      expect(token).toBe("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
    });

    it("should return null for Authorization header without Bearer prefix", () => {
      const context = createMockContext({
        authorization: "Basic dXNlcjpwYXNz",
      });
      const token = extractToken(context as any, defaultOptions);
      expect(token).toBeNull();
    });

    it("should return null for empty Authorization header", () => {
      const context = createMockContext({
        authorization: "",
      });
      const token = extractToken(context as any, defaultOptions);
      expect(token).toBeNull();
    });

    it("should return null when Authorization header has only 'Bearer'", () => {
      const context = createMockContext({
        authorization: "Bearer",
      });
      const token = extractToken(context as any, defaultOptions);
      expect(token).toBeNull();
    });

    it("should return null when Authorization header has 'Bearer ' with no token", () => {
      const context = createMockContext({
        authorization: "Bearer ",
      });
      const token = extractToken(context as any, defaultOptions);
      expect(token).toBeNull();
    });

    it("should handle Authorization header with extra spaces", () => {
      const context = createMockContext({
        authorization: "Bearer   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9   ",
      });
      const token = extractToken(context as any, defaultOptions);
      expect(token).toBe("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
    });
  });

  describe("Cookie extraction", () => {
    it("should extract token from cookie when cookieName is provided", () => {
      const context = createMockContext();
      mockGetCookie.mockReturnValue("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
      const options = { ...defaultOptions, cookie: { name: "auth-token" } };
      const token = extractToken(context as any, options);
      expect(token).toBe("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
      expect(mockGetCookie).toHaveBeenCalledWith(context, "auth-token");
    });

    it("should return null when cookie doesn't exist", () => {
      const context = createMockContext();
      mockGetCookie.mockReturnValue(undefined);
      const options = { ...defaultOptions, cookie: { name: "auth-token" } };
      const token = extractToken(context as any, options);
      expect(token).toBeNull();
      expect(mockGetCookie).toHaveBeenCalledWith(context, "auth-token");
    });

    it("should return null when no cookies are available", () => {
      const context = createMockContext();
      mockGetCookie.mockReturnValue(undefined);
      const options = { ...defaultOptions, cookie: { name: "auth-token" } };
      const token = extractToken(context as any, options);
      expect(token).toBeNull();
    });

    it("should prioritize Authorization header over cookie", () => {
      const context = createMockContext({
        authorization: "Bearer header-token",
      });
      mockGetCookie.mockReturnValue("cookie-token");
      const options = { ...defaultOptions, cookie: { name: "auth-token" } };
      const token = extractToken(context as any, options);
      expect(token).toBe("header-token");
      // Cookie should not be checked when Authorization header is valid
      expect(mockGetCookie).not.toHaveBeenCalled();
    });

    it("should fall back to cookie when Authorization header is invalid", () => {
      const context = createMockContext({
        authorization: "Basic dXNlcjpwYXNz", // Not Bearer
      });
      mockGetCookie.mockReturnValue("cookie-token");
      const options = { ...defaultOptions, cookie: { name: "auth-token" } };
      const token = extractToken(context as any, options);
      expect(token).toBe("cookie-token");
      expect(mockGetCookie).toHaveBeenCalledWith(context, "auth-token");
    });
  });

  describe("Edge cases", () => {
    it("should return null when no token sources are available", () => {
      const context = createMockContext();
      mockGetCookie.mockReturnValue(undefined);
      const token = extractToken(context as any, defaultOptions);
      expect(token).toBeNull();
    });

    it("should return null when context is missing required methods", () => {
      const context = {};
      const token = extractToken(context as any, defaultOptions);
      expect(token).toBeNull();
    });

    it("should handle undefined cookieName parameter", () => {
      const context = createMockContext({
        authorization: "Bearer valid-token",
      });
      const options = { ...defaultOptions, cookie: undefined };
      const token = extractToken(context as any, options);
      expect(token).toBe("valid-token");
    });

    it("should handle null cookieName parameter", () => {
      const context = createMockContext({
        authorization: "Bearer valid-token",
      });
      const options = { ...defaultOptions, cookie: null as any };
      const token = extractToken(context as any, options);
      expect(token).toBe("valid-token");
    });

    it("should handle when context.get throws an error", () => {
      const context = {
        req: {
          header: vi.fn(() => "Bearer valid-token"),
        },
        get: vi.fn(() => {
          throw new Error("Context error");
        }),
      };
      const options = { ...defaultOptions, cookie: { name: "auth-token" } };
      const token = extractToken(context as any, options);
      expect(token).toBe("valid-token");
    });

    it("should handle when context.req.header throws an error", () => {
      const context = {
        req: {
          header: vi.fn(() => {
            throw new Error("Header error");
          }),
        },
        env: {},
        executionCtx: {},
      };
      mockGetCookie.mockReturnValue("cookie-token");
      const options = { ...defaultOptions, cookie: { name: "auth-token" } };
      const token = extractToken(context as any, options);
      expect(token).toBeNull(); // Should gracefully handle the error
    });
  });

  describe("Token validation", () => {
    it("should return null for empty string token from Authorization header", () => {
      const context = createMockContext({
        authorization: "Bearer ",
      });
      const token = extractToken(context as any, defaultOptions);
      expect(token).toBeNull();
    });

    it("should return null for whitespace-only token from Authorization header", () => {
      const context = createMockContext({
        authorization: "Bearer    ",
      });
      const token = extractToken(context as any, defaultOptions);
      expect(token).toBeNull();
    });

    it("should return null for empty string token from cookie", () => {
      const context = createMockContext();
      mockGetCookie.mockReturnValue("");
      const options = { ...defaultOptions, cookie: { name: "auth-token" } };
      const token = extractToken(context as any, options);
      expect(token).toBeNull();
    });

    it("should return null for whitespace-only token from cookie", () => {
      const context = createMockContext();
      mockGetCookie.mockReturnValue("   ");
      const options = { ...defaultOptions, cookie: { name: "auth-token" } };
      const token = extractToken(context as any, options);
      expect(token).toBeNull();
    });

    it("should handle valid tokens with special characters", () => {
      const specialToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
      const context = createMockContext({
        authorization: `Bearer ${specialToken}`,
      });
      const token = extractToken(context as any, defaultOptions);
      expect(token).toBe(specialToken);
    });

    it("should return null when no token is present in header or cookie", () => {
      const context = createMockContext({}); // No headers
      mockGetCookie.mockReturnValue(undefined); // No cookie

      const token = extractToken(context as any, defaultOptions);
      expect(token).toBeNull();
    });

    it("should return null when no token sources are configured", () => {
      const context = createMockContext({}); // No headers
      const options = { ...defaultOptions, cookie: undefined }; // No cookie configured

      const token = extractToken(context as any, options);
      expect(token).toBeNull();
    });
  });
});
