import type { AuthSession } from "../../contracts/session.js";
import type { StepUpSessionInput } from "../session-step-up.js";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { AssuranceRequiredError } from "../../errors/assurance-required.js";
import { StepUpSession } from "../session-step-up.js";

describe("StepUpSession", () => {
  let repository: {
    get: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
  };
  let evaluator: {
    evaluate: ReturnType<typeof vi.fn>;
  };
  let guard: {
    assert: ReturnType<typeof vi.fn>;
  };
  let emitter: {
    stepUpCompleted: ReturnType<typeof vi.fn>;
  };
  let useCase: StepUpSession;

  beforeEach(() => {
    repository = {
      get: vi.fn(),
      create: vi.fn(),
    };
    evaluator = {
      evaluate: vi.fn(),
    };
    guard = {
      assert: vi.fn(),
    };
    emitter = {
      stepUpCompleted: vi.fn(),
    };
    // @ts-expect-error
    useCase = new StepUpSession(repository, evaluator, guard, emitter);
  });

  it("should step up a session", async () => {
    const parentSession: AuthSession = {
      id: "parent-session",
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

    repository.get.mockResolvedValue(parentSession);

    const newAssurance = {
      methods: ["totp"],
      score: 2,
      evaluatedAt: 2000,
      version: 1,
    };

    evaluator.evaluate.mockReturnValue(newAssurance);

    const input: StepUpSessionInput = {
      parentId: "parent-session",
      id: "stepped-up-session",
      methods: ["totp"],
      version: 1,
      transport: { type: "bearer" },
    };

    const result = await useCase.execute(input, 2000);

    expect(repository.get).toHaveBeenCalledWith("parent-session");
    expect(guard.assert).toHaveBeenCalledTimes(2); // parent and new session
    expect(guard.assert).toHaveBeenNthCalledWith(1, parentSession, 2000);
    expect(evaluator.evaluate).toHaveBeenCalledWith(
      {
        methods: ["totp"],
        version: 1,
      },
      2000
    );
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "stepped-up-session",
        assurance: newAssurance,
        stepUp: {
          parent: "parent-session",
          at: 2000,
        },
      })
    );
    expect(emitter.stepUpCompleted).toHaveBeenCalledWith({
      sessionId: "stepped-up-session",
      parentId: "parent-session",
      assuranceScore: 2,
      at: 2000,
    });
    expect(result.stepUp).toEqual({
      parent: "parent-session",
      at: 2000,
    });
  });

  it("should step up with proof and context", async () => {
    const parentSession: AuthSession = {
      id: "parent-session",
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

    repository.get.mockResolvedValue(parentSession);

    evaluator.evaluate.mockReturnValue({
      methods: ["totp"],
      score: 2,
      evaluatedAt: 2000,
      version: 1,
    });

    const input: StepUpSessionInput = {
      parentId: "parent-session",
      id: "stepped-up-session",
      methods: ["totp"],
      proof: "123456",
      context: { deviceId: "mobile" },
      version: 1,
      transport: { type: "bearer" },
    };

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

  it("should step up with expiration", async () => {
    const parentSession: AuthSession = {
      id: "parent-session",
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

    repository.get.mockResolvedValue(parentSession);

    evaluator.evaluate.mockReturnValue({
      methods: ["totp"],
      score: 2,
      evaluatedAt: 2000,
      version: 1,
    });

    const input: StepUpSessionInput = {
      parentId: "parent-session",
      id: "stepped-up-session",
      methods: ["totp"],
      version: 1,
      transport: { type: "bearer" },
      expiresAt: 10000,
    };

    const result = await useCase.execute(input, 2000);

    expect(result.expiresAt).toBe(10000);
  });

  it("should step up with scopes", async () => {
    const parentSession: AuthSession = {
      id: "parent-session",
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

    repository.get.mockResolvedValue(parentSession);

    evaluator.evaluate.mockReturnValue({
      methods: ["totp"],
      score: 2,
      evaluatedAt: 2000,
      version: 1,
    });

    const input: StepUpSessionInput = {
      parentId: "parent-session",
      id: "stepped-up-session",
      methods: ["totp"],
      version: 1,
      transport: { type: "bearer" },
      scopes: ["admin", "write"],
    };

    const result = await useCase.execute(input, 2000);

    expect(result.scopes).toEqual(["admin", "write"]);
  });

  it("should throw if parent session not found", async () => {
    repository.get.mockRejectedValue(new Error("Session not found"));

    const input: StepUpSessionInput = {
      parentId: "missing-session",
      id: "stepped-up-session",
      methods: ["totp"],
      version: 1,
      transport: { type: "bearer" },
    };

    await expect(useCase.execute(input, 2000)).rejects.toThrow("Session not found");
    expect(evaluator.evaluate).not.toHaveBeenCalled();
  });

  it("should throw if parent session is invalid", async () => {
    const parentSession: AuthSession = {
      id: "parent-session",
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

    repository.get.mockResolvedValue(parentSession);
    guard.assert.mockImplementationOnce(() => {
      throw new Error("Parent session expired");
    });

    const input: StepUpSessionInput = {
      parentId: "parent-session",
      id: "stepped-up-session",
      methods: ["totp"],
      version: 1,
      transport: { type: "bearer" },
    };

    await expect(useCase.execute(input, 2000)).rejects.toThrow("Parent session expired");
    expect(evaluator.evaluate).not.toHaveBeenCalled();
  });

  it("should throw if new assurance score is not higher", async () => {
    const parentSession: AuthSession = {
      id: "parent-session",
      createdAt: 1000,
      verifiedAt: 1000,
      assurance: {
        methods: ["password"],
        score: 2,
        evaluatedAt: 1000,
        version: 1,
      },
      transport: { type: "bearer" },
    };

    repository.get.mockResolvedValue(parentSession);

    evaluator.evaluate.mockReturnValue({
      methods: ["totp"],
      score: 1,
      evaluatedAt: 2000,
      version: 1,
    });

    const input: StepUpSessionInput = {
      parentId: "parent-session",
      id: "stepped-up-session",
      methods: ["totp"],
      version: 1,
      transport: { type: "bearer" },
    };

    await expect(useCase.execute(input, 2000)).rejects.toThrow(AssuranceRequiredError);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it("should throw if new assurance score equals parent", async () => {
    const parentSession: AuthSession = {
      id: "parent-session",
      createdAt: 1000,
      verifiedAt: 1000,
      assurance: {
        methods: ["password"],
        score: 2,
        evaluatedAt: 1000,
        version: 1,
      },
      transport: { type: "bearer" },
    };

    repository.get.mockResolvedValue(parentSession);

    evaluator.evaluate.mockReturnValue({
      methods: ["totp"],
      score: 2,
      evaluatedAt: 2000,
      version: 1,
    });

    const input: StepUpSessionInput = {
      parentId: "parent-session",
      id: "stepped-up-session",
      methods: ["totp"],
      version: 1,
      transport: { type: "bearer" },
    };

    await expect(useCase.execute(input, 2000)).rejects.toThrow(AssuranceRequiredError);
  });

  it("should throw if new session fails guard validation", async () => {
    const parentSession: AuthSession = {
      id: "parent-session",
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

    repository.get.mockResolvedValue(parentSession);

    evaluator.evaluate.mockReturnValue({
      methods: ["totp"],
      score: 2,
      evaluatedAt: 2000,
      version: 1,
    });

    guard.assert
      .mockImplementationOnce(() => {})
      .mockImplementationOnce(() => {
        throw new Error("New session invalid");
      });

    const input: StepUpSessionInput = {
      parentId: "parent-session",
      id: "stepped-up-session",
      methods: ["totp"],
      version: 1,
      transport: { type: "bearer" },
    };

    await expect(useCase.execute(input, 2000)).rejects.toThrow("New session invalid");
    expect(repository.create).not.toHaveBeenCalled();
  });

  it("should throw if repository create fails", async () => {
    const parentSession: AuthSession = {
      id: "parent-session",
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

    repository.get.mockResolvedValue(parentSession);

    evaluator.evaluate.mockReturnValue({
      methods: ["totp"],
      score: 2,
      evaluatedAt: 2000,
      version: 1,
    });

    repository.create.mockRejectedValue(new Error("Database error"));

    const input: StepUpSessionInput = {
      parentId: "parent-session",
      id: "stepped-up-session",
      methods: ["totp"],
      version: 1,
      transport: { type: "bearer" },
    };

    await expect(useCase.execute(input, 2000)).rejects.toThrow("Database error");
    expect(emitter.stepUpCompleted).not.toHaveBeenCalled();
  });
});
