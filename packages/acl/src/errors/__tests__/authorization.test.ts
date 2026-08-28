import { describe, expect, it } from "vitest";
import { AuthorizationError } from "../authorization.js";

describe("AuthorizationError", () => {
  it("creates an internal_error", () => {
    const error = new AuthorizationError("internal_error", {
      details: { provider: "casl" },
    });

    expect(error.code).toBe("authorization:internal_error");
    expect(error.message).toBe("Authorization infrastructure error");
    expect(error.meta.reason).toBe("internal_error");
    expect(error.meta.httpStatus).toBe(500);
    expect(error.meta.details).toEqual({ provider: "casl" });
  });

  it("has frozen meta", () => {
    const error = new AuthorizationError("internal_error");

    expect(() => {
      // @ts-expect-error - attempting to mutate frozen meta
      error.meta.reason = "internal_error";
    }).toThrow();
  });
});

describe("AuthorizationDecision", () => {
  it("represents an allowed decision", () => {
    const decision = { allowed: true, reason: "explicit grant" };

    expect(decision.allowed).toBe(true);
    expect(decision.reason).toBe("explicit grant");
  });

  it("represents a denied decision", () => {
    const decision = { allowed: false, reason: "insufficient role" };

    expect(decision.allowed).toBe(false);
    expect(decision.reason).toBe("insufficient role");
  });

  it("allows omission of reason", () => {
    const decision = { allowed: true };

    expect(decision.reason).toBeUndefined();
  });
});

describe("AuthorizationContext", () => {
  it("requires subject, action, and resource", () => {
    const ctx = {
      subject: "user:123",
      action: "read",
      resource: "order:456",
    };

    expect(ctx.subject).toBe("user:123");
    expect(ctx.action).toBe("read");
    expect(ctx.resource).toBe("order:456");
  });

  it("accepts optional context", () => {
    const ctx = {
      subject: "user:123",
      action: "read",
      resource: "order:456",
      context: { tenant: "tenant-a", channel: "web" },
    };

    expect(ctx.context).toEqual({ tenant: "tenant-a", channel: "web" });
  });

  it("allows empty context", () => {
    const ctx = {
      subject: "user:123",
      action: "read",
      resource: "order:456",
      context: {},
    };

    expect(ctx.context).toEqual({});
  });
});