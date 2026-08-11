import type { AuthSessionRepository } from "../../contracts/session-repository.js";
import type { CreateSessionInput } from "../session-create.js";

import { AuthError } from "../../errors/auth.js";
import { AuthSessionId } from "../../value-objects/auth-session-id.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CreateSession } from "../session-create.js";

describe("CreateSession", () => {
  let repository: {
    getById: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    revoke: ReturnType<typeof vi.fn>;
  };
  let evaluator: {
    evaluate: ReturnType<typeof vi.fn>;
  };
  let emitter: {
    onSessionCreated: ReturnType<typeof vi.fn>;
    onSessionRevoked: ReturnType<typeof vi.fn>;
    onSessionRefreshed: ReturnType<typeof vi.fn>;
  };
  let guard: {
    assert: ReturnType<typeof vi.fn>;
    assertInvariants: ReturnType<typeof vi.fn>;
    assertAssurance: ReturnType<typeof vi.fn>;
    assertRefreshable: ReturnType<typeof vi.fn>;
  };
  let useCase: CreateSession;

  beforeEach(() => {
    repository = {
      getById: vi.fn(),
      save: vi.fn().mockResolvedValue({ success: true, value: undefined }),
      revoke: vi.fn(),
    };
    evaluator = {
      evaluate: vi.fn(),
    };
    emitter = {
      onSessionCreated: vi.fn(),
      onSessionRevoked: vi.fn(),
      onSessionRefreshed: vi.fn(),
    };
    guard = {
      assert: vi.fn(),
      assertInvariants: vi.fn(),
      assertAssurance: vi.fn(),
      assertRefreshable: vi.fn(),
    };
    useCase = new CreateSession(
      repository as unknown as AuthSessionRepository,
      evaluator,
      emitter,
      guard
    );
  });

  it("should create a basic session", async () => {
    const input: CreateSessionInput = {
      id: new AuthSessionId("session-1"),
      methods: ["password"],
      version: 1,
      transport: { type: "bearer" },
    };

    const assurance = {
      methods: ["password"],
      score: 1,
      evaluatedAt: 1000,
      version: 1,
    };

    evaluator.evaluate.mockReturnValue(assurance);

    const result = await useCase.execute(input, 1000);

    expect(evaluator.evaluate).toHaveBeenCalledWith(
      {
        methods: ["password"],
        version: 1,
      },
      1000
    );
    expect(guard.assertInvariants).toHaveBeenCalledWith(
      expect.objectContaining({ id: input.id }),
      1000
    );
    expect(guard.assertAssurance).toHaveBeenCalledWith(
      expect.objectContaining({ id: input.id }),
      1000
    );
    expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({ id: input.id }));
    expect(emitter.onSessionCreated).toHaveBeenCalledWith({
      sessionId: input.id,
      createdAt: 1000,
      assuranceScore: 1,
    });
    expect(result.value).toMatchObject({
      id: input.id,
      createdAt: 1000,
      verifiedAt: 1000,
      assurance,
      transport: { type: "bearer" },
    });
  });

  it("should create session with proof and context", async () => {
    const input: CreateSessionInput = {
      id: new AuthSessionId("session-2"),
      methods: ["totp"],
      proof: "123456",
      context: { deviceId: "mobile" },
      version: 1,
      transport: { type: "bearer" },
    };

    const assurance = {
      methods: ["totp"],
      score: 2,
      evaluatedAt: 2000,
      version: 1,
    };

    evaluator.evaluate.mockReturnValue(assurance);

    await useCase.execute(input, 2000);

    expect(evaluator.evaluate).toHaveBeenCalledWith(
      {
        methods: ["totp"],
        proof: "123456",
        context: { deviceId: "mobile" },
        version: 1,
      },
      2000
    );
  });

  it("should create session with expiration", async () => {
    const input: CreateSessionInput = {
      id: new AuthSessionId("session-3"),
      methods: ["password"],
      version: 1,
      transport: { type: "bearer" },
      expiresAt: 5000,
    };

    evaluator.evaluate.mockReturnValue({
      methods: ["password"],
      score: 1,
      evaluatedAt: 1000,
      version: 1,
    });

    const result = await useCase.execute(input, 1000);

    expect(result.value.expiresAt).toBe(5000);
  });

  it("should create session with refresh enabled", async () => {
    const input: CreateSessionInput = {
      id: new AuthSessionId("session-4"),
      methods: ["password"],
      version: 1,
      transport: { type: "bearer" },
      refresh: 10000,
    };

    evaluator.evaluate.mockReturnValue({
      methods: ["password"],
      score: 1,
      evaluatedAt: 1000,
      version: 1,
    });

    const result = await useCase.execute(input, 1000);

    expect(result.value.refresh).toEqual({ enabled: true, expiresAt: 10000 });
    expect(guard.assertRefreshable).toHaveBeenCalledWith(
      expect.objectContaining({ id: input.id }),
      1000
    );
  });

  it("should create session with refresh disabled", async () => {
    const input: CreateSessionInput = {
      id: new AuthSessionId("session-5"),
      methods: ["password"],
      version: 1,
      transport: { type: "bearer" },
      refresh: false,
    };

    evaluator.evaluate.mockReturnValue({
      methods: ["password"],
      score: 1,
      evaluatedAt: 1000,
      version: 1,
    });

    const result = await useCase.execute(input, 1000);

    expect(result.value.refresh).toEqual({ enabled: false });
    expect(guard.assertRefreshable).not.toHaveBeenCalled();
  });

  it("should create session with parent for step-up", async () => {
    const input: CreateSessionInput = {
      id: new AuthSessionId("session-6"),
      methods: ["totp"],
      version: 1,
      transport: { type: "bearer" },
      parent: new AuthSessionId("parent-session"),
    };

    evaluator.evaluate.mockReturnValue({
      methods: ["totp"],
      score: 2,
      evaluatedAt: 3000,
      version: 1,
    });

    const result = await useCase.execute(input, 3000);

    expect(result.value.stepUp).toEqual({
      parent: new AuthSessionId("parent-session"),
      at: 3000,
    });
  });

  it("should create session with scopes", async () => {
    const input: CreateSessionInput = {
      id: new AuthSessionId("session-7"),
      methods: ["password"],
      version: 1,
      transport: { type: "bearer" },
      scopes: ["read", "write"],
    };

    evaluator.evaluate.mockReturnValue({
      methods: ["password"],
      score: 1,
      evaluatedAt: 1000,
      version: 1,
    });

    const result = await useCase.execute(input, 1000);

    expect(result.value.scopes).toEqual(["read", "write"]);
  });

  it("should return failure if guard rejects session", async () => {
    const input: CreateSessionInput = {
      id: new AuthSessionId("session-8"),
      methods: ["password"],
      version: 1,
      transport: { type: "bearer" },
    };

    evaluator.evaluate.mockReturnValue({
      methods: ["password"],
      score: 1,
      evaluatedAt: 1000,
      version: 1,
    });

    guard.assertAssurance.mockImplementation(() => {
      throw new AuthError("assurance_required");
    });

    const result = await useCase.execute(input, 1000);

    expect(result.ok).toBe(false);
    expect(repository.save).not.toHaveBeenCalled();
    expect(emitter.onSessionCreated).not.toHaveBeenCalled();
  });

  it("should return failure if repository save fails", async () => {
    const input: CreateSessionInput = {
      id: new AuthSessionId("session-9"),
      methods: ["password"],
      version: 1,
      transport: { type: "bearer" },
    };

    evaluator.evaluate.mockReturnValue({
      methods: ["password"],
      score: 1,
      evaluatedAt: 1000,
      version: 1,
    });

    repository.save.mockResolvedValue({
      success: false,
      error: new Error("Database error"),
    });

    const result = await useCase.execute(input, 1000);

    expect(result.ok).toBe(false);
    expect(emitter.onSessionCreated).not.toHaveBeenCalled();
  });
});
