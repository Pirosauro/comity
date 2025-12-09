import type { AuthModuleOptions, AuthUser } from "../types.js";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createJWTMiddleware } from "../middleware.js";

// Mock dependencies
vi.mock("jose", () => ({
  jwtVerify: vi.fn(),
}));

vi.mock("../utils/extract-token.js", () => ({
  extractToken: vi.fn(),
}));

vi.mock("../utils/failure-reason.js", () => ({
  getFailureReason: vi.fn(),
}));

describe("createJWTMiddleware", () => {
  let mockContext: any;
  let mockNext: any;
  let mockLogger: any;
  let mockEmit: any;
  let mockCoreCtx: any;
  let mockJwtVerify: any;
  let mockExtractToken: any;
  let mockGetFailureReason: any;

  const defaultOptions: AuthModuleOptions = {
    secret: "test-secret",
    lifetime: 3600,
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const { jwtVerify } = await import("jose");
    const { extractToken } = await import("../utils/extract-token.js");
    const { getFailureReason } = await import("../utils/failure-reason.js");

    mockJwtVerify = vi.mocked(jwtVerify);
    mockExtractToken = vi.mocked(extractToken);
    mockGetFailureReason = vi.mocked(getFailureReason);

    mockContext = {
      req: {
        header: vi.fn(),
        path: "/api/test",
        method: "GET",
      },
      set: vi.fn(),
      get: vi.fn(),
    };

    mockNext = vi.fn();

    mockLogger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };

    mockEmit = vi.fn();

    mockCoreCtx = {
      logger: mockLogger,
      emit: mockEmit,
      error: vi.fn(),
    } as any;
  });

  it("should create middleware function", () => {
    const middleware = createJWTMiddleware(defaultOptions, mockCoreCtx);
    expect(typeof middleware).toBe("function");
  });

  it("should emit authentication-failed event when no token is found", async () => {
    mockExtractToken.mockReturnValue(null);

    const middleware = createJWTMiddleware(defaultOptions, mockCoreCtx);
    await middleware(mockContext, mockNext);

    expect(mockEmit).toHaveBeenCalledWith(
      "@comity/auth:authentication-failed",
      {
        reason: "missing",
        context: "middleware",
        ip: undefined,
        userAgent: undefined,
      }
    );
    expect(mockNext).toHaveBeenCalled();
  });

  it("should extract token using utility function", async () => {
    mockExtractToken.mockReturnValue("valid-token");
    mockJwtVerify.mockResolvedValue({
      payload: {
        sub: "user-123",
        roles: { admin: ["read"] },
        exp: Math.floor(Date.now() / 1000) + 3600,
      },
    });

    const middleware = createJWTMiddleware(defaultOptions, mockCoreCtx);
    await middleware(mockContext, mockNext);

    expect(mockExtractToken).toHaveBeenCalledWith(
      mockContext,
      undefined // cookie name
    );
  });

  it("should verify JWT token with correct parameters", async () => {
    const token = "valid-jwt-token";
    mockExtractToken.mockReturnValue(token);
    mockJwtVerify.mockResolvedValue({
      payload: {
        sub: "user-123",
        roles: { admin: ["read"] },
        exp: Math.floor(Date.now() / 1000) + 3600,
      },
    });

    const options = {
      ...defaultOptions,
      issuer: "test-issuer",
      audience: "test-audience",
    };

    const middleware = createJWTMiddleware(options, mockCoreCtx);
    await middleware(mockContext, mockNext);

    expect(mockJwtVerify).toHaveBeenCalledWith(
      token,
      expect.any(Uint8Array), // encoded secret
      {
        issuer: "test-issuer",
        audience: "test-audience",
      }
    );
  });

  it("should set user context when token is valid", async () => {
    const payload = {
      sub: "user-123",
      roles: { admin: ["read", "write"], customer: ["read"] },
      exp: Math.floor(Date.now() / 1000) + 3600,
      verified: 1234567890,
    };

    mockExtractToken.mockReturnValue("valid-token");
    mockJwtVerify.mockResolvedValue({ payload });

    const middleware = createJWTMiddleware(defaultOptions, mockCoreCtx);
    await middleware(mockContext, mockNext);

    const expectedUser: AuthUser<{ [key: string]: any }> = {
      id: "user-123",
      roles: { admin: ["read", "write"], customer: ["read"] },
      verified: 1234567890,
    };

    expect(mockContext.set).toHaveBeenCalledWith("user", expectedUser);
    expect(mockNext).toHaveBeenCalled();
  });

  it("should emit token-verified event when token is valid", async () => {
    const payload = {
      sub: "user-123",
      roles: { admin: ["read"] },
      exp: Math.floor(Date.now() / 1000) + 3600,
    };

    mockExtractToken.mockReturnValue("valid-token");
    mockJwtVerify.mockResolvedValue({ payload });

    const middleware = createJWTMiddleware(defaultOptions, mockCoreCtx);
    await middleware(mockContext, mockNext);

    expect(mockEmit).toHaveBeenCalledWith(
      "@comity/auth:token-verified",
      payload
    );
  });

  it("should handle expired tokens correctly", async () => {
    const expiredTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
    const payload = {
      sub: "user-123",
      roles: { admin: ["read"] },
      exp: expiredTime,
      verified: 1234567890,
    };

    mockExtractToken.mockReturnValue("expired-token");
    mockJwtVerify.mockResolvedValue({ payload });

    const middleware = createJWTMiddleware(defaultOptions, mockCoreCtx);
    await middleware(mockContext, mockNext);

    const expectedUser: AuthUser<{ [key: string]: any }> = {
      id: "user-123",
      roles: { admin: ["read"] },
      verified: 1234567890,
    };

    expect(mockEmit).toHaveBeenCalledWith("@comity/auth:token-expired", {
      user: expectedUser,
      expiredAt: expiredTime,
      token: "expired-token",
    });

    expect(mockEmit).toHaveBeenCalledWith(
      "@comity/auth:authentication-failed",
      {
        reason: "expired",
        context: "middleware",
        userId: "user-123",
        ip: undefined,
        userAgent: undefined,
      }
    );

    expect(mockNext).toHaveBeenCalled();
    expect(mockContext.set).not.toHaveBeenCalled();
  });

  it("should handle tokens without sub claim", async () => {
    const payload = {
      roles: { admin: ["read"] },
      exp: Math.floor(Date.now() / 1000) + 3600,
    };

    mockExtractToken.mockReturnValue("token-without-sub");
    mockJwtVerify.mockResolvedValue({ payload });

    const middleware = createJWTMiddleware(defaultOptions, mockCoreCtx);
    await middleware(mockContext, mockNext);

    expect(mockEmit).toHaveBeenCalledWith(
      "@comity/auth:token-verified",
      payload
    );
    expect(mockContext.set).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
  });

  it("should extract IP address from x-forwarded-for header", async () => {
    mockExtractToken.mockReturnValue(null);
    mockContext.req.header.mockImplementation((name: string) => {
      if (name === "x-forwarded-for") return "192.168.1.100";
      if (name === "x-real-ip") return "10.0.0.1";
      return undefined;
    });

    const middleware = createJWTMiddleware(defaultOptions, mockCoreCtx);
    await middleware(mockContext, mockNext);

    expect(mockEmit).toHaveBeenCalledWith(
      "@comity/auth:authentication-failed",
      {
        reason: "missing",
        context: "middleware",
        ip: "192.168.1.100",
        userAgent: undefined,
      }
    );
  });

  it("should fall back to x-real-ip header when x-forwarded-for is not available", async () => {
    mockExtractToken.mockReturnValue(null);
    mockContext.req.header.mockImplementation((name: string) => {
      if (name === "x-real-ip") return "10.0.0.1";
      return undefined;
    });

    const middleware = createJWTMiddleware(defaultOptions, mockCoreCtx);
    await middleware(mockContext, mockNext);

    expect(mockEmit).toHaveBeenCalledWith(
      "@comity/auth:authentication-failed",
      {
        reason: "missing",
        context: "middleware",
        ip: "10.0.0.1",
        userAgent: undefined,
      }
    );
  });

  it("should extract user agent from header", async () => {
    mockExtractToken.mockReturnValue(null);
    mockContext.req.header.mockImplementation((name: string) => {
      if (name === "user-agent") return "Mozilla/5.0 Test Browser";
      return undefined;
    });

    const middleware = createJWTMiddleware(defaultOptions, mockCoreCtx);
    await middleware(mockContext, mockNext);

    expect(mockEmit).toHaveBeenCalledWith(
      "@comity/auth:authentication-failed",
      {
        reason: "missing",
        context: "middleware",
        ip: undefined,
        userAgent: "Mozilla/5.0 Test Browser",
      }
    );
  });

  describe("error handling", () => {
    it("should handle JWT verification errors using getFailureReason", async () => {
      const jwtError = new Error("Token has expired");
      mockExtractToken.mockReturnValue("invalid-token");
      mockJwtVerify.mockRejectedValue(jwtError);
      mockGetFailureReason.mockReturnValue("expired");

      const middleware = createJWTMiddleware(defaultOptions, mockCoreCtx);
      await middleware(mockContext, mockNext);

      expect(mockGetFailureReason).toHaveBeenCalledWith(jwtError);
      expect(mockEmit).toHaveBeenCalledWith(
        "@comity/auth:authentication-failed",
        {
          reason: "expired",
          context: "middleware",
          ip: undefined,
          userAgent: undefined,
        }
      );
      expect(mockCoreCtx.error).toHaveBeenCalledWith(
        jwtError,
        "JWT verification failed: Token has expired"
      );
    });

    it("should handle malformed JWT errors", async () => {
      const jwtError = new Error("Invalid JWT format");
      mockExtractToken.mockReturnValue("malformed-token");
      mockJwtVerify.mockRejectedValue(jwtError);
      mockGetFailureReason.mockReturnValue("malformed");

      const middleware = createJWTMiddleware(defaultOptions, mockCoreCtx);
      await middleware(mockContext, mockNext);

      expect(mockGetFailureReason).toHaveBeenCalledWith(jwtError);
      expect(mockEmit).toHaveBeenCalledWith(
        "@comity/auth:authentication-failed",
        {
          reason: "malformed",
          context: "middleware",
          ip: undefined,
          userAgent: undefined,
        }
      );
    });

    it("should handle signature verification errors", async () => {
      const jwtError = new Error("Signature verification failed");
      mockExtractToken.mockReturnValue("invalid-signature-token");
      mockJwtVerify.mockRejectedValue(jwtError);
      mockGetFailureReason.mockReturnValue("invalid-token");

      const middleware = createJWTMiddleware(defaultOptions, mockCoreCtx);
      await middleware(mockContext, mockNext);

      expect(mockGetFailureReason).toHaveBeenCalledWith(jwtError);
      expect(mockEmit).toHaveBeenCalledWith(
        "@comity/auth:authentication-failed",
        {
          reason: "invalid-token",
          context: "middleware",
          ip: undefined,
          userAgent: undefined,
        }
      );
    });

    it("should handle unknown errors gracefully", async () => {
      const unknownError = new Error("Database connection failed");
      mockExtractToken.mockReturnValue("valid-token");
      mockJwtVerify.mockRejectedValue(unknownError);
      mockGetFailureReason.mockReturnValue("invalid-token");

      const middleware = createJWTMiddleware(defaultOptions, mockCoreCtx);
      await middleware(mockContext, mockNext);

      expect(mockGetFailureReason).toHaveBeenCalledWith(unknownError);
      expect(mockCoreCtx.error).toHaveBeenCalledWith(
        unknownError,
        "JWT verification failed: Database connection failed"
      );
    });
  });

  describe("cookie configuration", () => {
    it("should pass cookie name to extractToken when configured", async () => {
      const options = {
        ...defaultOptions,
        cookie: { name: "custom-auth-token" },
      };

      mockExtractToken.mockReturnValue(null);

      const middleware = createJWTMiddleware(options, mockCoreCtx);
      await middleware(mockContext, mockNext);

      expect(mockExtractToken).toHaveBeenCalledWith(
        mockContext,
        "custom-auth-token"
      );
    });
  });

  describe("payload processing", () => {
    it("should handle payload with all optional fields", async () => {
      const payload = {
        sub: "user-123",
        roles: { admin: ["read"], customer: ["read"] },
        exp: Math.floor(Date.now() / 1000) + 3600,
        verified: 1234567890,
        customField: "custom-value",
        permissions: ["read:users", "write:posts"],
      };

      mockExtractToken.mockReturnValue("complete-token");
      mockJwtVerify.mockResolvedValue({ payload });

      const middleware = createJWTMiddleware(defaultOptions, mockCoreCtx);
      await middleware(mockContext, mockNext);

      const expectedUser: AuthUser<{ [key: string]: any }> = {
        id: "user-123",
        roles: { admin: ["read"], customer: ["read"] },
        verified: 1234567890,
        customField: "custom-value",
        permissions: ["read:users", "write:posts"],
      };

      expect(mockContext.set).toHaveBeenCalledWith("user", expectedUser);
    });

    it("should handle payload with minimal fields", async () => {
      const payload = {
        sub: "user-minimal",
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      mockExtractToken.mockReturnValue("minimal-token");
      mockJwtVerify.mockResolvedValue({ payload });

      const middleware = createJWTMiddleware(defaultOptions, mockCoreCtx);
      await middleware(mockContext, mockNext);

      const expectedUser: AuthUser<{ [key: string]: any }> = {
        id: "user-minimal",
        roles: {},
        verified: undefined,
      };

      expect(mockContext.set).toHaveBeenCalledWith("user", expectedUser);
    });

    it("should handle missing or invalid roles in payload", async () => {
      const payload = {
        sub: "user-no-roles",
        exp: Math.floor(Date.now() / 1000) + 3600,
        roles: null, // Invalid roles
      };

      mockExtractToken.mockReturnValue("no-roles-token");
      mockJwtVerify.mockResolvedValue({ payload });

      const middleware = createJWTMiddleware(defaultOptions, mockCoreCtx);
      await middleware(mockContext, mockNext);

      const expectedUser: AuthUser<{ [key: string]: any }> = {
        id: "user-no-roles",
        roles: {},
        verified: undefined,
        // null roles should be converted to empty object
      };

      expect(mockContext.set).toHaveBeenCalledWith("user", expectedUser);
    });
  });
});
