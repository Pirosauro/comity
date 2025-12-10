import { describe, it, expect, vi, beforeEach } from "vitest";
import { handleRefresh } from "../handle-refresh.js";
import type { AuthUser, AuthModuleOptions, JWTPayload } from "../../types.js";

// Mock dependencies
vi.mock("jose", () => ({
  jwtVerify: vi.fn(),
}));

vi.mock("../extract-token.js", () => ({
  extractToken: vi.fn(),
}));

vi.mock("../sign-token.js", () => ({
  signToken: vi.fn(),
}));

vi.mock("@comity/core/errors", () => ({
  TooManyRequestsError: class extends Error {
    constructor(message: string) {
      super(message);
      this.name = "TooManyRequestsError";
    }
  },
  UnauthorizedError: class extends Error {
    constructor(message: string) {
      super(message);
      this.name = "UnauthorizedError";
    }
  },
}));

vi.mock("../../errors/index.js", () => ({
  TokenExpiredError: class extends Error {
    constructor() {
      super("Token expired");
      this.name = "TokenExpiredError";
    }
  },
  TokenInvalidError: class extends Error {
    constructor() {
      super("Token invalid");
      this.name = "TokenInvalidError";
    }
  },
}));

import { jwtVerify } from "jose";
import { extractToken } from "../extract-token.js";
import { signToken } from "../sign-token.js";
import { TooManyRequestsError, UnauthorizedError } from "@comity/core/errors";
import { TokenExpiredError, TokenInvalidError } from "../../errors/index.js";

const createMockJwtResult = (payload: JWTPayload) => ({
  payload,
  protectedHeader: { alg: "HS256" }
});

describe("handleRefresh", () => {
  const mockJwtVerify = vi.mocked(jwtVerify);
  const mockExtractToken = vi.mocked(extractToken);
  const mockSignToken = vi.mocked(signToken);

  const mockUser: AuthUser<{ roles: Record<string, string[]>; email: string }> = {
    id: "user-123",
    roles: { default: ["user"] },
    email: "test@example.com",
  };

  const mockContext = {
    req: {
      header: vi.fn(),
    },
  } as any;

  const defaultOptions: AuthModuleOptions = {
    secret: "test-secret",
    maxRefreshWindow: 7 * 24 * 60 * 60, // 7 days
    minRefreshWindow: 15 * 60, // 15 minutes
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("token extraction", () => {
    it("should throw UnauthorizedError when no token is found", async () => {
      mockExtractToken.mockReturnValue(null);

      await expect(handleRefresh(mockContext, defaultOptions)).rejects.toThrow(
        UnauthorizedError
      );
      await expect(handleRefresh(mockContext, defaultOptions)).rejects.toThrow(
        "No token found to refresh"
      );

      expect(mockExtractToken).toHaveBeenCalledWith(
        mockContext,
        defaultOptions
      );
    });

    it("should extract token using extractToken utility", async () => {
      const mockPayload: JWTPayload = {
        sub: "user-123",
        user: mockUser,
        exp: Math.floor(Date.now() / 1000) + 10 * 60, // expires in 10 minutes
        iat: Math.floor(Date.now() / 1000) - 60, // issued 1 minute ago
      };

      mockExtractToken.mockReturnValue("old-token");
      mockJwtVerify.mockResolvedValue(createMockJwtResult(mockPayload));
      mockSignToken.mockResolvedValue("new-token");

      await handleRefresh(mockContext, defaultOptions);

      expect(mockExtractToken).toHaveBeenCalledWith(
        mockContext,
        defaultOptions
      );
      expect(mockJwtVerify).toHaveBeenCalledWith(
        "old-token",
        new TextEncoder().encode(defaultOptions.secret),
        {
          issuer: defaultOptions.issuer,
          audience: defaultOptions.audience,
        }
      );
    });
  });

  describe("token validation", () => {
    it("should throw TokenInvalidError when payload missing exp", async () => {
      const mockPayload: Partial<JWTPayload> = {
        sub: "user-123",
        user: mockUser,
        iat: Math.floor(Date.now() / 1000) - 60,
        // missing exp
      };

      mockExtractToken.mockReturnValue("token");
      mockJwtVerify.mockResolvedValue(createMockJwtResult(mockPayload));

      await expect(handleRefresh(mockContext, defaultOptions)).rejects.toThrow(
        TokenInvalidError
      );
    });

    it("should throw TokenInvalidError when payload missing iat", async () => {
      const mockPayload: Partial<JWTPayload> = {
        sub: "user-123",
        user: mockUser,
        exp: Math.floor(Date.now() / 1000) + 10 * 60,
        // missing iat
      };

      mockExtractToken.mockReturnValue("token");
      mockJwtVerify.mockResolvedValue(createMockJwtResult(mockPayload));

      await expect(handleRefresh(mockContext, defaultOptions)).rejects.toThrow(
        TokenInvalidError
      );
    });

    it("should throw TokenExpiredError when token issued too long ago", async () => {
      const mockPayload: JWTPayload = {
        sub: "user-123",
        user: mockUser,
        exp: Math.floor(Date.now() / 1000) + 10 * 60,
        iat: Math.floor(Date.now() / 1000) - 8 * 24 * 60 * 60, // issued 8 days ago
      };

      mockExtractToken.mockReturnValue("token");
      mockJwtVerify.mockResolvedValue(createMockJwtResult(mockPayload));

      await expect(handleRefresh(mockContext, defaultOptions)).rejects.toThrow(
        TokenExpiredError
      );
    });

    it("should use default maxRefreshWindow when not specified", async () => {
      const optionsWithoutMaxWindow: AuthModuleOptions = {
        secret: "test-secret",
        // no maxRefreshWindow
      };

      const mockPayload: JWTPayload = {
        sub: "user-123",
        user: mockUser,
        exp: Math.floor(Date.now() / 1000) + 10 * 60,
        iat: Math.floor(Date.now() / 1000) - 8 * 24 * 60 * 60, // issued 8 days ago
      };

      mockExtractToken.mockReturnValue("token");
      mockJwtVerify.mockResolvedValue(createMockJwtResult(mockPayload));

      await expect(
        handleRefresh(mockContext, optionsWithoutMaxWindow)
      ).rejects.toThrow(TokenExpiredError);
    });

    it("should throw TooManyRequestsError when token not eligible for refresh yet", async () => {
      const mockPayload: JWTPayload = {
        sub: "user-123",
        user: mockUser,
        exp: Math.floor(Date.now() / 1000) + 30 * 60, // expires in 30 minutes
        iat: Math.floor(Date.now() / 1000) - 60,
      };

      mockExtractToken.mockReturnValue("token");
      mockJwtVerify.mockResolvedValue(createMockJwtResult(mockPayload));

      await expect(handleRefresh(mockContext, defaultOptions)).rejects.toThrow(
        TooManyRequestsError
      );
      await expect(handleRefresh(mockContext, defaultOptions)).rejects.toThrow(
        "Token not eligible for refresh yet"
      );
    });

    it("should use default minRefreshWindow when not specified", async () => {
      const optionsWithoutMinWindow: AuthModuleOptions = {
        secret: "test-secret",
        // no minRefreshWindow
      };

      const mockPayload: JWTPayload = {
        sub: "user-123",
        user: mockUser,
        exp: Math.floor(Date.now() / 1000) + 30 * 60, // expires in 30 minutes
        iat: Math.floor(Date.now() / 1000) - 60,
      };

      mockExtractToken.mockReturnValue("token");
      mockJwtVerify.mockResolvedValue(createMockJwtResult(mockPayload));

      await expect(
        handleRefresh(mockContext, optionsWithoutMinWindow)
      ).rejects.toThrow(TooManyRequestsError);
    });
  });

  describe("successful refresh", () => {
    it("should generate new token and return both tokens", async () => {
      const mockPayload: JWTPayload = {
        sub: "user-123",
        user: mockUser,
        exp: Math.floor(Date.now() / 1000) + 10 * 60, // expires in 10 minutes
        iat: Math.floor(Date.now() / 1000) - 60, // issued 1 minute ago
      };

      mockExtractToken.mockReturnValue("old-token");
      mockJwtVerify.mockResolvedValue(createMockJwtResult(mockPayload));
      mockSignToken.mockResolvedValue("new-token");

      const result = await handleRefresh(mockContext, defaultOptions);

      expect(result).toEqual({
        outdated: "old-token",
        current: "new-token",
      });

      expect(mockSignToken).toHaveBeenCalledWith(
        mockUser,
        defaultOptions
      );
    });

    it("should handle complex user data", async () => {
      const complexUser: AuthUser<{ roles: Record<string, string[]>; email: string; verified: number; permissions: string[]; customField: string }> = {
        id: "user-complex",
        roles: { admin: ["read", "write"], user: ["read"] },
        email: "complex@example.com",
        verified: 1234567890,
        permissions: ["read:users", "write:posts"],
        customField: "custom-value",
      };

      const mockPayload: JWTPayload = {
        sub: "user-complex",
        user: complexUser,
        exp: Math.floor(Date.now() / 1000) + 10 * 60,
        iat: Math.floor(Date.now() / 1000) - 60,
      };

      mockExtractToken.mockReturnValue("old-token");
      mockJwtVerify.mockResolvedValue(createMockJwtResult(mockPayload));
      mockSignToken.mockResolvedValue("new-token");

      const result = await handleRefresh(mockContext, defaultOptions);

      expect(result).toEqual({
        outdated: "old-token",
        current: "new-token",
      });

      expect(mockSignToken).toHaveBeenCalledWith(
        complexUser,
        defaultOptions
      );
    });
  });
});
