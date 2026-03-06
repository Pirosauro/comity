import type { RevokeSessionInput } from "../session-revoke.js";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { RevokeSession } from "../session-revoke.js";

describe("RevokeSession", () => {
  let repository: {
    get: ReturnType<typeof vi.fn>;
    revoke: ReturnType<typeof vi.fn>;
  };
  let emitter: {
    onSessionCreated: ReturnType<typeof vi.fn>;
    onSessionRevoked: ReturnType<typeof vi.fn>;
    onSessionRefreshed: ReturnType<typeof vi.fn>;
  };
  let useCase: RevokeSession;

  beforeEach(() => {
    repository = {
      get: vi.fn(),
      revoke: vi.fn(),
    };
    emitter = {
      onSessionCreated: vi.fn(),
      onSessionRevoked: vi.fn(),
      onSessionRefreshed: vi.fn(),
    };
    // @ts-expect-error
    useCase = new RevokeSession(repository, emitter);
  });

  it("should revoke a session", async () => {
    const session = {
      id: "session-1",
      createdAt: 1000,
      assurance: {
        methods: ["password"],
        score: 1,
        evaluatedAt: 1000,
        version: 1,
      },
      transport: { type: "bearer" },
    };

    repository.get.mockResolvedValue(session);

    const input: RevokeSessionInput = {
      id: "session-1",
      reason: "user_logout",
    };

    await useCase.execute(input, 2000);

    expect(repository.get).toHaveBeenCalledWith("session-1");
    expect(repository.revoke).toHaveBeenCalledWith("session-1", "user_logout", 2000, undefined);
    expect(emitter.onSessionRevoked).toHaveBeenCalledWith({
      sessionId: "session-1",
      reason: "user_logout",
      revokedAt: 2000,
    });
  });

  it("should revoke session with actor", async () => {
    const session = {
      id: "session-2",
      createdAt: 1000,
      assurance: {
        methods: ["password"],
        score: 1,
        evaluatedAt: 1000,
        version: 1,
      },
      transport: { type: "bearer" },
    };

    repository.get.mockResolvedValue(session);

    const input: RevokeSessionInput = {
      id: "session-2",
      reason: "admin_forced",
      actor: {
        type: "admin",
        id: "admin-123",
      },
    };

    await useCase.execute(input, 3000);

    expect(repository.revoke).toHaveBeenCalledWith("session-2", "admin_forced", 3000, {
      type: "admin",
      id: "admin-123",
    });
  });

  it("should throw if session not found", async () => {
    repository.get.mockRejectedValue(new Error("Session not found"));

    const input: RevokeSessionInput = {
      id: "missing-session",
      reason: "test",
    };

    await expect(useCase.execute(input, 2000)).rejects.toThrow("Session not found");
    expect(repository.revoke).not.toHaveBeenCalled();
    expect(emitter.onSessionRevoked).not.toHaveBeenCalled();
  });

  it("should throw if repository revoke fails", async () => {
    const session = {
      id: "session-3",
      createdAt: 1000,
      assurance: {
        methods: ["password"],
        score: 1,
        evaluatedAt: 1000,
        version: 1,
      },
      transport: { type: "bearer" },
    };

    repository.get.mockResolvedValue(session);
    repository.revoke.mockRejectedValue(new Error("Database error"));

    const input: RevokeSessionInput = {
      id: "session-3",
      reason: "test",
    };

    await expect(useCase.execute(input, 2000)).rejects.toThrow("Database error");
    expect(emitter.onSessionRevoked).not.toHaveBeenCalled();
  });
});
