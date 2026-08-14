import type { AuthSession } from "../../contracts/session.js";
import type { AuthSessionRepository } from "../../contracts/session-repository.js";
import type { RevokeSessionInput } from "../session-revoke.js";

import { AuthError } from "../../errors/auth.js";
import { AuthSessionId } from "../../value-objects/auth-session-id.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RevokeSession } from "../session-revoke.js";

describe("RevokeSession", () => {
  let repository: {
    getById: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
  };
  let emitter: {
    onSessionCreated: ReturnType<typeof vi.fn>;
    onSessionRevoked: ReturnType<typeof vi.fn>;
    onSessionRefreshed: ReturnType<typeof vi.fn>;
  };
  let useCase: RevokeSession;

  const baseSession: AuthSession = {
    id: new AuthSessionId("session-1"),
    createdAt: 1000,
    verifiedAt: 1000,
    assurance: {
      methods: ["password"],
      score: 1,
      evaluatedAt: 1000,
      version: 1,
    },
    transport: { type: "bearer" },
  };

  beforeEach(() => {
    repository = {
      getById: vi.fn().mockResolvedValue({ success: true, value: baseSession }),
      save: vi.fn().mockResolvedValue({ success: true, value: undefined }),
    };
    emitter = {
      onSessionCreated: vi.fn(),
      onSessionRevoked: vi.fn(),
      onSessionRefreshed: vi.fn(),
    };
    useCase = new RevokeSession(
      repository as unknown as AuthSessionRepository,
      emitter
    );
  });

  it("should revoke a session", async () => {
    const sessionId = new AuthSessionId("session-1");
    const input: RevokeSessionInput = {
      id: sessionId,
      reason: "user_logout",
    };

    const result = await useCase.revoke(sessionId, {
      reason: input.reason,
      at: 2000,
    });

    expect(repository.getById).toHaveBeenCalledWith(sessionId);
    expect(repository.save).toHaveBeenCalledWith({
      ...baseSession,
      revokedAt: 2000,
    });
    expect(emitter.onSessionRevoked).toHaveBeenCalledWith({
      sessionId,
      reason: "user_logout",
      revokedAt: 2000,
    });
    expect(result).toEqual({ success: true, value: undefined });
  });

  it("should revoke session with actor", async () => {
    const sessionId = new AuthSessionId("session-2");
    const input: RevokeSessionInput = {
      id: sessionId,
      reason: "admin_forced",
      actor: {
        type: "admin",
        id: "admin-123",
      },
    };

    const result = await useCase.revoke(sessionId, {
      reason: input.reason,
      at: 3000,
      actor: input.actor,
    });

    expect(repository.save).toHaveBeenCalledWith({
      ...baseSession,
      revokedAt: 3000,
    });
    expect(emitter.onSessionRevoked).toHaveBeenCalledWith({
      sessionId,
      reason: "admin_forced",
      revokedAt: 3000,
    });
    expect(result).toEqual({ success: true, value: undefined });
  });

  it("should return session_not_found when session is missing", async () => {
    const sessionId = new AuthSessionId("session-3");
    repository.getById.mockResolvedValue({ success: true, value: null });

    const result = await useCase.revoke(sessionId, {
      reason: "user_logout",
      at: 2000,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(AuthError);
      expect(result.error.meta.reason).toBe("session_not_found");
    }
    expect(repository.save).not.toHaveBeenCalled();
    expect(emitter.onSessionRevoked).not.toHaveBeenCalled();
  });

  it("should return session_revoked when session is already revoked", async () => {
    const sessionId = new AuthSessionId("session-4");
    repository.getById.mockResolvedValue({
      success: true,
      value: { ...baseSession, revokedAt: 1500 },
    });

    const result = await useCase.revoke(sessionId, {
      reason: "user_logout",
      at: 2000,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.meta.reason).toBe("session_revoked");
    }
    expect(repository.save).not.toHaveBeenCalled();
    expect(emitter.onSessionRevoked).not.toHaveBeenCalled();
  });

  it("should not emit event when repository save fails", async () => {
    const sessionId = new AuthSessionId("session-5");
    repository.save.mockResolvedValue({
      success: false,
      error: new Error("Database error"),
    });

    const result = await useCase.revoke(sessionId, {
      reason: "test",
      at: 2000,
    });

    expect(result.success).toBe(false);
    expect(emitter.onSessionRevoked).not.toHaveBeenCalled();
  });

  it("should not emit event when repository getById fails", async () => {
    const sessionId = new AuthSessionId("session-6");
    repository.getById.mockResolvedValue({
      success: false,
      error: new Error("Database error"),
    });

    const result = await useCase.revoke(sessionId, {
      reason: "test",
      at: 2000,
    });

    expect(result.success).toBe(false);
    expect(repository.save).not.toHaveBeenCalled();
    expect(emitter.onSessionRevoked).not.toHaveBeenCalled();
  });

  it("execute should delegate to revoke best-effort", async () => {
    const sessionId = new AuthSessionId("session-7");
    repository.getById.mockResolvedValue({
      success: false,
      error: new Error("Database error"),
    });

    const input: RevokeSessionInput = {
      id: sessionId,
      reason: "user_logout",
    };

    await useCase.execute(input, 2000);

    expect(emitter.onSessionRevoked).not.toHaveBeenCalled();
  });
});