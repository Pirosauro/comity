import type { AuthFacade, AuthSession, AuthTokenService } from "@comity/auth";
import type { AuthTokenEnvelope } from "../../contracts/envelope";
import type { IssueTokensInput } from "../../contracts/facade";

import { AuthError } from "@comity/auth/error";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DefaultAuthTokenFacade } from "../default";

describe("DefaultAuthTokenFacade", () => {
  let authFacade: AuthFacade;
  let tokenService: AuthTokenService;
  let facade: DefaultAuthTokenFacade;

  const mockSession: AuthSession = {
    id: "session-123",
    createdAt: 1000,
    expiresAt: 2000,
    verifiedAt: 0,
    assurance: {
      methods: [],
      score: 0,
      evaluatedAt: 0,
      version: 0,
    },
    transport: { type: "bearer" },
  };

  beforeEach(() => {
    authFacade = {
      assertSession: vi.fn(),
      createSession: vi.fn(),
      refreshSession: vi.fn(),
    } as any;

    tokenService = {
      verifyAccessToken: vi.fn(),
      verifyRefreshToken: vi.fn(),
      signAccessToken: vi.fn(),
      signRefreshToken: vi.fn(),
    } as any;

    facade = new DefaultAuthTokenFacade(authFacade, tokenService);
  });

  describe("authenticate", () => {
    it("should return session when token is valid", async () => {
      vi.mocked(tokenService.verifyAccessToken).mockResolvedValue({
        ok: true,
        value: mockSession,
      });
      vi.mocked(authFacade.assertSession).mockImplementation(() => {});

      const result = await facade.authenticate("valid-token", 1500);

      expect(result.ok).toBe(true);
      expect((result as any).value).toEqual(mockSession);
    });

    it("should return error when token verification fails", async () => {
      const error = new AuthError("token_invalid");

      vi.mocked(tokenService.verifyAccessToken).mockResolvedValue({
        ok: false,
        error,
      });

      const result = await facade.authenticate("invalid-token", 1500);

      expect(result.ok).toBe(false);
      expect((result as any).error).toEqual(error);
    });

    it("should return error when session assertion fails", async () => {
      const authError = new AuthError("session_expired");

      vi.mocked(tokenService.verifyAccessToken).mockResolvedValue({
        ok: true,
        value: mockSession,
      });
      vi.mocked(authFacade.assertSession).mockImplementation(() => {
        throw authError;
      });

      const result = await facade.authenticate("valid-token", 3000);

      expect(result.ok).toBe(false);
      expect((result as any).error).toEqual(authError);
    });

    it("should wrap non-AuthError exceptions as internal_error", async () => {
      vi.mocked(tokenService.verifyAccessToken).mockResolvedValue({
        ok: true,
        value: mockSession,
      });

      const testError = new Error("Unknown error");

      vi.mocked(authFacade.assertSession).mockImplementation(() => {
        throw testError;
      });

      const result = await facade.authenticate("valid-token", 1500);

      expect(result.ok).toBe(false);
      expect((result as any).error.code).toBe("auth:internal_error");
      expect((result as any).error.cause).toEqual(testError);
    });
  });

  describe("issueTokens", () => {
    const issueInput: IssueTokensInput = {
      id: "user@example.com",
      transport: { type: "bearer" },
      methods: [],
      version: 0,
    };

    it("should return token envelope when all operations succeed", async () => {
      vi.mocked(authFacade.createSession).mockResolvedValue({
        ok: true,
        value: mockSession,
      });
      vi.mocked(tokenService.signAccessToken).mockResolvedValue({
        ok: true,
        value: "access-token",
      });
      vi.mocked(tokenService.signRefreshToken).mockResolvedValue({
        ok: true,
        value: "refresh-token",
      });

      const result = await facade.issueTokens(issueInput, 1000);

      expect(result.ok).toBe(true);

      const envelope = (result as any).value as AuthTokenEnvelope;

      expect(envelope.session).toEqual(mockSession);
      expect(envelope.accessToken).toBe("access-token");
      expect(envelope.refreshToken).toBe("refresh-token");
    });

    it("should return error when session creation fails", async () => {
      const error = new AuthError("token_invalid");

      vi.mocked(authFacade.createSession).mockResolvedValue({
        ok: false,
        error,
      });

      const result = await facade.issueTokens(issueInput, 1000);

      expect(result.ok).toBe(false);
      expect((result as any).error).toEqual(error);
    });

    it("should return error when access token signing fails", async () => {
      const error = new AuthError("token_invalid");

      vi.mocked(authFacade.createSession).mockResolvedValue({
        ok: true,
        value: mockSession,
      });
      vi.mocked(tokenService.signAccessToken).mockResolvedValue({
        ok: false,
        error,
      });

      const result = await facade.issueTokens(issueInput, 1000);

      expect(result.ok).toBe(false);
      expect((result as any).error).toEqual(error);
    });

    it("should return error when refresh token signing fails", async () => {
      const error = new AuthError("token_invalid");

      vi.mocked(authFacade.createSession).mockResolvedValue({
        ok: true,
        value: mockSession,
      });
      vi.mocked(tokenService.signAccessToken).mockResolvedValue({
        ok: true,
        value: "access-token",
      });
      vi.mocked(tokenService.signRefreshToken).mockResolvedValue({
        ok: false,
        error,
      });

      const result = await facade.issueTokens(issueInput, 1000);

      expect(result.ok).toBe(false);
      expect((result as any).error).toEqual(error);
    });
  });

  describe("refreshTokens", () => {
    const refreshedSession: AuthSession = { ...mockSession, createdAt: 2000 };

    it("should return new token envelope when refresh succeeds", async () => {
      vi.mocked(tokenService.verifyRefreshToken).mockResolvedValue({
        ok: true,
        value: mockSession,
      });
      vi.mocked(authFacade.refreshSession).mockResolvedValue({
        ok: true,
        value: refreshedSession,
      });
      vi.mocked(tokenService.signAccessToken).mockResolvedValue({
        ok: true,
        value: "new-access-token",
      });
      vi.mocked(tokenService.signRefreshToken).mockResolvedValue({
        ok: true,
        value: "new-refresh-token",
      });

      const result = await facade.refreshTokens("old-refresh-token", "session-123", 2000);

      expect(result.ok).toBe(true);

      const envelope = (result as any).value as AuthTokenEnvelope;

      expect(envelope.accessToken).toBe("new-access-token");
      expect(envelope.refreshToken).toBe("new-refresh-token");
    });

    it("should return error when refresh token verification fails", async () => {
      const error = new AuthError("token_invalid");

      vi.mocked(tokenService.verifyRefreshToken).mockResolvedValue({
        ok: false,
        error,
      });

      const result = await facade.refreshTokens("invalid-token", "session-123", 2000);

      expect(result.ok).toBe(false);
      expect((result as any).error).toEqual(error);
    });

    it("should return error when session refresh fails", async () => {
      const error = new AuthError("token_invalid");

      vi.mocked(tokenService.verifyRefreshToken).mockResolvedValue({
        ok: true,
        value: mockSession,
      });
      vi.mocked(authFacade.refreshSession).mockResolvedValue({
        ok: false,
        error,
      });

      const result = await facade.refreshTokens("valid-token", "session-123", 2000);

      expect(result.ok).toBe(false);
      expect((result as any).error).toEqual(error);
    });

    it("should return error when new access token signing fails", async () => {
      const error = new AuthError("token_invalid");

      vi.mocked(tokenService.verifyRefreshToken).mockResolvedValue({
        ok: true,
        value: mockSession,
      });
      vi.mocked(authFacade.refreshSession).mockResolvedValue({
        ok: true,
        value: refreshedSession,
      });
      vi.mocked(tokenService.signAccessToken).mockResolvedValue({
        ok: false,
        error,
      });

      const result = await facade.refreshTokens("valid-token", "session-123", 2000);

      expect(result.ok).toBe(false);
      expect((result as any).error).toEqual(error);
    });

    it("should return error when new refresh token signing fails", async () => {
      const error = new AuthError("token_invalid");

      vi.mocked(tokenService.verifyRefreshToken).mockResolvedValue({
        ok: true,
        value: mockSession,
      });
      vi.mocked(authFacade.refreshSession).mockResolvedValue({
        ok: true,
        value: refreshedSession,
      });
      vi.mocked(tokenService.signAccessToken).mockResolvedValue({
        ok: true,
        value: "new-access-token",
      });
      vi.mocked(tokenService.signRefreshToken).mockResolvedValue({
        ok: false,
        error,
      });

      const result = await facade.refreshTokens("valid-token", "session-123", 2000);

      expect(result.ok).toBe(false);
      expect((result as any).error).toEqual(error);
    });
  });
});
