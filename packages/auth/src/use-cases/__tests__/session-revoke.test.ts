import type { AuthSessionRepository } from "../../contracts/session-repository.js";
import type { RevokeSessionInput } from "../session-revoke.js";

import { AuthSessionId } from "../../value-objects/auth-session-id.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RevokeSession } from "../session-revoke.js";

describe("RevokeSession", () => {
  let repository: {
    getById: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
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
      getById: vi.fn(),
      save: vi.fn(),
      revoke: vi.fn().mockResolvedValue({ success: true, value: undefined }),
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

    await useCase.execute(input, 2000);

    expect(repository.revoke).toHaveBeenCalledWith({
      id: sessionId,
      reason: "user_logout",
      at: 2000,
    });
    expect(emitter.onSessionRevoked).toHaveBeenCalledWith({
      sessionId,
      reason: "user_logout",
      revokedAt: 2000,
    });
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

    await useCase.execute(input, 3000);

    expect(repository.revoke).toHaveBeenCalledWith({
      id: sessionId,
      reason: "admin_forced",
      at: 3000,
      actor: {
        type: "admin",
        id: "admin-123",
      },
    });
  });

  it("should not emit event when repository revoke fails", async () => {
    const sessionId = new AuthSessionId("session-3");
    repository.revoke.mockResolvedValue({
      success: false,
      error: new Error("Database error"),
    });

    const input: RevokeSessionInput = {
      id: sessionId,
      reason: "test",
    };

    await useCase.execute(input, 2000);

    expect(emitter.onSessionRevoked).not.toHaveBeenCalled();
  });
});
