import { beforeEach, describe, expect, it } from "vitest";
import { isFailure } from "@comity/primitives/result";
import type { AuthSession } from "../../contracts/session.js";
import { AuthSessionId } from "../../value-objects/auth-session-id.js";
import { MemoryAuthSessionRepository } from "../memory.js";

function sessionId(value: string): AuthSessionId {
  const result = AuthSessionId.create(value);

  if (isFailure(result)) {
    throw new Error("Unexpected failure");
  }

  return result.value;
}

function makeSession(id: string, overrides: Partial<AuthSession> = {}): AuthSession {
  return {
    id: sessionId(id),
    createdAt: 1000,
    verifiedAt: 1000,
    assurance: {
      methods: ["password"],
      score: 1,
      evaluatedAt: 1000,
      version: 1,
    },
    transport: { type: "bearer" },
    ...overrides,
  };
}

describe("MemoryAuthSessionRepository", () => {
  let repository: MemoryAuthSessionRepository;

  beforeEach(() => {
    repository = new MemoryAuthSessionRepository();
  });

  it("returns null when no session exists", async () => {
    const result = await repository.getById(sessionId("missing"));

    expect(result).toEqual({ success: true, value: null });
  });

  it("returns a session saved by id", async () => {
    const session = makeSession("session-1");

    await repository.save(session);

    const result = await repository.getById(sessionId("session-1"));

    expect(result.success).toBe(true);
    expect(result.value?.id.toString()).toBe("session-1");
  });

  it("returns null for a different id", async () => {
    await repository.save(makeSession("session-1"));

    const result = await repository.getById(sessionId("session-2"));

    expect(result).toEqual({ success: true, value: null });
  });

  it("stores a copy of the session", async () => {
    const session = makeSession("session-1", { scopes: ["read"] });

    await repository.save(session);

    session.scopes = ["write"];

    const result = await repository.getById(sessionId("session-1"));

    expect(result.value?.scopes).toEqual(["read"]);
  });

  it("overwrites an existing session on save", async () => {
    await repository.save(makeSession("session-1", { verifiedAt: 1000 }));

    await repository.save(makeSession("session-1", { verifiedAt: 2000 }));

    const result = await repository.getById(sessionId("session-1"));

    expect(result.value?.verifiedAt).toBe(2000);
  });

  it("clears all sessions", async () => {
    await repository.save(makeSession("session-1"));
    await repository.save(makeSession("session-2"));

    await repository.clear();

    const first = await repository.getById(sessionId("session-1"));
    const second = await repository.getById(sessionId("session-2"));

    expect(first.value).toBeNull();
    expect(second.value).toBeNull();
  });
});