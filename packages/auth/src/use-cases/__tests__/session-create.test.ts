import type { CreateSessionInput } from "../session-create.js";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { CreateSession } from "../session-create.js";

describe("CreateSession", () => {
  let repository: {
    create: ReturnType<typeof vi.fn>;
    get: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    revoke: ReturnType<typeof vi.fn>;
  };
  let evaluator: {
    evaluate: ReturnType<typeof vi.fn>;
  };
  let emitter: {
    sessionCreated: ReturnType<typeof vi.fn>;
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
      create: vi.fn(),
      get: vi.fn(),
      update: vi.fn(),
      revoke: vi.fn(),
    };
    evaluator = {
      evaluate: vi.fn(),
    };
    emitter = {
      sessionCreated: vi.fn(),
    };
    guard = {
      assert: vi.fn(),
      assertInvariants: vi.fn(),
      assertAssurance: vi.fn(),
      assertRefreshable: vi.fn(),
    };
    // @ts-expect-error
    useCase = new CreateSession(repository, evaluator, emitter, guard);
  });

  it("should create a basic session", async () => {
    const input: CreateSessionInput = {
      id: "session-1",
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
      expect.objectContaining({ id: "session-1" }),
      1000
    );
    expect(guard.assertAssurance).toHaveBeenCalledWith(
      expect.objectContaining({ id: "session-1" }),
      1000
    );
    expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({ id: "session-1" }));
    expect(emitter.sessionCreated).toHaveBeenCalledWith({
      sessionId: "session-1",
      createdAt: 1000,
      assuranceScore: 1,
    });
    expect(result).toMatchObject({
      id: "session-1",
      createdAt: 1000,
      verifiedAt: 1000,
      assurance,
      transport: { type: "bearer" },
    });
  });

  it("should create session with proof and context", async () => {
    const input: CreateSessionInput = {
      id: "session-2",
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
      id: "session-3",
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

    expect(result.expiresAt).toBe(5000);
  });

  it("should create session with refresh enabled", async () => {
    const input: CreateSessionInput = {
      id: "session-4",
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

    expect(result.refresh).toEqual({ enabled: true, expiresAt: 10000 });
    expect(guard.assertRefreshable).toHaveBeenCalledWith(
      expect.objectContaining({ id: "session-4" }),
      1000
    );
  });

  it("should create session with refresh disabled", async () => {
    const input: CreateSessionInput = {
      id: "session-5",
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

    expect(result.refresh).toEqual({ enabled: false });
    expect(guard.assertRefreshable).not.toHaveBeenCalled();
  });

  it("should create session with parent for step-up", async () => {
    const input: CreateSessionInput = {
      id: "session-6",
      methods: ["totp"],
      version: 1,
      transport: { type: "bearer" },
      parent: "parent-session",
    };

    evaluator.evaluate.mockReturnValue({
      methods: ["totp"],
      score: 2,
      evaluatedAt: 3000,
      version: 1,
    });

    const result = await useCase.execute(input, 3000);

    expect(result.stepUp).toEqual({
      parent: "parent-session",
      at: 3000,
    });
  });

  it("should create session with scopes", async () => {
    const input: CreateSessionInput = {
      id: "session-7",
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

    expect(result.scopes).toEqual(["read", "write"]);
  });

  it("should throw if guard rejects session", async () => {
    const input: CreateSessionInput = {
      id: "session-8",
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
      throw new Error("Assurance failed");
    });

    await expect(useCase.execute(input, 1000)).rejects.toThrow("Assurance failed");
    expect(repository.create).not.toHaveBeenCalled();
    expect(emitter.sessionCreated).not.toHaveBeenCalled();
  });

  it("should throw if repository fails", async () => {
    const input: CreateSessionInput = {
      id: "session-9",
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

    repository.create.mockRejectedValue(new Error("Database error"));

    await expect(useCase.execute(input, 1000)).rejects.toThrow("Database error");
    expect(emitter.sessionCreated).not.toHaveBeenCalled();
  });
});
