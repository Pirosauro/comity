import type { AuthSession } from "../../contracts/session.js";
import type { AuthSessionRepository } from "../../contracts/session-repository.js";
import type { RefreshSessionInput } from "../session-refresh.js";

import { AuthError } from "../../errors/auth.js";
import { AuthSessionId } from "../../value-objects/auth-session-id.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RefreshSession } from "../session-refresh.js";

describe("RefreshSession", () => {
  let repository: {
    getById: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
  };
  let guard: {
    assert: ReturnType<typeof vi.fn>;
  };
  let emitter: {
    onSessionCreated: ReturnType<typeof vi.fn>;
    onSessionRevoked: ReturnType<typeof vi.fn>;
    onSessionRefreshed: ReturnType<typeof vi.fn>;
  };
  let useCase: RefreshSession;

  beforeEach(() => {
    repository = {
      getById: vi.fn(),
      save: vi.fn().mockResolvedValue({ success: true, value: undefined }),
    };
    guard = {
      assert: vi.fn(),
    };
    emitter = {
      onSessionCreated: vi.fn(),
      onSessionRevoked: vi.fn(),
      onSessionRefreshed: vi.fn(),
    };
    useCase = new RefreshSession(
      repository as unknown as AuthSessionRepository,
      guard,
      emitter
    );
  });

  it("should refresh a session", async () => {
    const originalId = new AuthSessionId("original-session");
    const newId = new AuthSessionId("new-session");
    const originalSession: AuthSession = {
      id: originalId,
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

    repository.getById.mockResolvedValue({ success: true, value: originalSession });

    const input: RefreshSessionInput = {
      id: newId,
      originalId,
    };

    const result = await useCase.execute(input, 2000);

    expect(repository.getById).toHaveBeenCalledWith(originalId);
    expect(guard.assert).toHaveBeenCalledWith(originalSession, 2000, true);
    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: newId,
        createdAt: 1000, // Original creation time is preserved
      })
    );
    expect(emitter.onSessionRefreshed).toHaveBeenCalledWith({
      sessionId: newId,
      originalId,
      refreshedAt: 2000,
    });
    expect(result.value).toMatchObject({
      ...originalSession,
      id: newId,
      createdAt: 1000, // Original creation time preserved
    });
  });

  it("should refresh session with new expiration", async () => {
    const originalId = new AuthSessionId("original-session");
    const newId = new AuthSessionId("new-session");
    const originalSession: AuthSession = {
      id: originalId,
      createdAt: 1000,
      verifiedAt: 1000,
      assurance: {
        methods: ["password"],
        score: 1,
        evaluatedAt: 1000,
        version: 1,
      },
      transport: { type: "bearer" },
      expiresAt: 5000,
    };

    repository.getById.mockResolvedValue({ success: true, value: originalSession });

    const input: RefreshSessionInput = {
      id: newId,
      originalId,
      expiresAt: 10000,
    };

    const result = await useCase.execute(input, 2000);

    expect(result.value.expiresAt).toBe(10000);
    expect(emitter.onSessionRefreshed).toHaveBeenCalledWith({
      sessionId: newId,
      originalId,
      refreshedAt: 2000,
      expiresAt: 10000,
    });
  });

  it("should return failure if original session not found", async () => {
    repository.getById.mockResolvedValue({ success: true, value: null });

    const input: RefreshSessionInput = {
      id: new AuthSessionId("new-session"),
      originalId: new AuthSessionId("missing-session"),
    };

    const result = await useCase.execute(input, 2000);

    expect(result.ok).toBe(false);
    expect(result.error.meta.reason).toBe("session_not_found");
    expect(guard.assert).not.toHaveBeenCalled();
    expect(repository.save).not.toHaveBeenCalled();
    expect(emitter.onSessionRefreshed).not.toHaveBeenCalled();
  });

  it("should return failure if guard rejects refresh", async () => {
    const originalId = new AuthSessionId("original-session");
    const originalSession: AuthSession = {
      id: originalId,
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

    repository.getById.mockResolvedValue({ success: true, value: originalSession });
    guard.assert.mockImplementation(() => {
      throw new AuthError("refresh_not_allowed");
    });

    const input: RefreshSessionInput = {
      id: new AuthSessionId("new-session"),
      originalId,
    };

    const result = await useCase.execute(input, 2000);

    expect(result.ok).toBe(false);
    expect(repository.save).not.toHaveBeenCalled();
    expect(emitter.onSessionRefreshed).not.toHaveBeenCalled();
  });

  it("should return failure if repository save fails", async () => {
    const originalId = new AuthSessionId("original-session");
    const originalSession: AuthSession = {
      id: originalId,
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

    repository.getById.mockResolvedValue({ success: true, value: originalSession });
    repository.save.mockResolvedValue({
      success: false,
      error: new Error("Database error"),
    });

    const input: RefreshSessionInput = {
      id: new AuthSessionId("new-session"),
      originalId,
    };

    const result = await useCase.execute(input, 2000);

    expect(result.ok).toBe(false);
    expect(emitter.onSessionRefreshed).not.toHaveBeenCalled();
  });
});
