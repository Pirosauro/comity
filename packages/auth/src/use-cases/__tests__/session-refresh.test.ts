import type { AuthSession } from "../../contracts/session.js";
import type { RefreshSessionInput } from "../session-refresh.js";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { RefreshSession } from "../session-refresh.js";

describe("RefreshSession", () => {
  let repository: {
    get: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
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
      get: vi.fn(),
      update: vi.fn(),
    };
    guard = {
      assert: vi.fn(),
    };
    emitter = {
      onSessionCreated: vi.fn(),
      onSessionRevoked: vi.fn(),
      onSessionRefreshed: vi.fn(),
    };
    // @ts-expect-error
    useCase = new RefreshSession(repository, guard, emitter);
  });

  it("should refresh a session", async () => {
    const originalSession: AuthSession = {
      id: "original-session",
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

    repository.get.mockResolvedValue(originalSession);

    const input: RefreshSessionInput = {
      id: "new-session",
      originalId: "original-session",
    };

    const result = await useCase.execute(input, 2000);

    expect(repository.get).toHaveBeenCalledWith("original-session");
    expect(guard.assert).toHaveBeenCalledWith(originalSession, 2000, true);
    expect(repository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "new-session",
        createdAt: 1000, // Original creation time is preserved
      })
    );
    expect(emitter.onSessionRefreshed).toHaveBeenCalledWith({
      sessionId: "new-session",
      originalId: "original-session",
      refreshedAt: 2000,
    });
    expect(result).toMatchObject({
      ...originalSession,
      id: "new-session",
      createdAt: 1000, // Original creation time preserved
    });
  });

  it("should refresh session with new expiration", async () => {
    const originalSession: AuthSession = {
      id: "original-session",
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

    repository.get.mockResolvedValue(originalSession);

    const input: RefreshSessionInput = {
      id: "new-session",
      originalId: "original-session",
      expiresAt: 10000,
    };

    const result = await useCase.execute(input, 2000);

    expect(result.expiresAt).toBe(10000);
    expect(emitter.onSessionRefreshed).toHaveBeenCalledWith({
      sessionId: "new-session",
      originalId: "original-session",
      refreshedAt: 2000,
      expiresAt: 10000,
    });
  });

  it("should throw if original session not found", async () => {
    repository.get.mockRejectedValue(new Error("Session not found"));

    const input: RefreshSessionInput = {
      id: "new-session",
      originalId: "missing-session",
    };

    await expect(useCase.execute(input, 2000)).rejects.toThrow("Session not found");
    expect(guard.assert).not.toHaveBeenCalled();
    expect(repository.update).not.toHaveBeenCalled();
    expect(emitter.onSessionRefreshed).not.toHaveBeenCalled();
  });

  it("should throw if guard rejects refresh", async () => {
    const originalSession: AuthSession = {
      id: "original-session",
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

    repository.get.mockResolvedValue(originalSession);
    guard.assert.mockImplementation(() => {
      throw new Error("Refresh not allowed");
    });

    const input: RefreshSessionInput = {
      id: "new-session",
      originalId: "original-session",
    };

    await expect(useCase.execute(input, 2000)).rejects.toThrow("Refresh not allowed");
    expect(repository.update).not.toHaveBeenCalled();
    expect(emitter.onSessionRefreshed).not.toHaveBeenCalled();
  });

  it("should throw if repository update fails", async () => {
    const originalSession: AuthSession = {
      id: "original-session",
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

    repository.get.mockResolvedValue(originalSession);
    repository.update.mockRejectedValue(new Error("Database error"));

    const input: RefreshSessionInput = {
      id: "new-session",
      originalId: "original-session",
    };

    await expect(useCase.execute(input, 2000)).rejects.toThrow("Database error");
    expect(emitter.onSessionRefreshed).not.toHaveBeenCalled();
  });
});
