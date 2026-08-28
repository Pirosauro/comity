import { Ability, createMongoAbility } from "@casl/ability";
import { isFailure, isSuccess } from "@comity/primitives/result";
import { describe, expect, it, vi } from "vitest";

import { AuthorizationError } from "@comity/acl";
import { CaslAuthorizer } from "../adapter.js";

function makeAbility(rules?: Parameters<typeof Ability>[0]) {
  return createMongoAbility(rules ?? []);
}

describe("CaslAuthorizer", () => {
  it("allows when CASL can", async () => {
    const ability = makeAbility([
      { action: "read", subject: "Order", conditions: { tenant: "tenant-a" } },
    ]);
    const authorizer = new CaslAuthorizer(
      makeAbility([{ action: "read", subject: "Order", conditions: { tenant: "tenant-a" } }])
    );

    const result = await authorizer.authorize({
      subject: "user:123",
      action: "read",
      resource: "Order",
      context: { tenant: "tenant-a" },
    });

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value.allowed).toBe(true);
    }
  });

  it("denies when CASL cannot", async () => {
    const authorizer = new CaslAuthorizer(
      makeAbility([{ action: "read", subject: "Order", conditions: { tenant: "tenant-a" } }])
    );

    const result = await authorizer.authorize({
      subject: "user:123",
      action: "read",
      resource: "Order",
      context: { tenant: "tenant-b" },
    });

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value.allowed).toBe(false);
      expect(result.value.reason).toBe("Authorization denied by policy");
    }
  });

  it("handles contextual conditions", async () => {
    const ability = makeAbility([
      { action: "manage", subject: "Order", conditions: { ownerId: "user:123" } },
    ]);
    const authorizer = new CaslAuthorizer(ability);

    const allowedResult = await authorizer.authorize({
      subject: "user:123",
      action: "manage",
      resource: "Order",
      context: { ownerId: "user:123" },
    });

    const deniedResult = await authorizer.authorize({
      subject: "user:456",
      action: "manage",
      resource: "Order",
      context: { ownerId: "user:789" },
    });

    expect(isSuccess(allowedResult)).toBe(true);
    if (isSuccess(allowedResult)) {
      expect(allowedResult.value.allowed).toBe(true);
    }

    expect(isSuccess(deniedResult)).toBe(true);
    if (isSuccess(deniedResult)) {
      expect(deniedResult.value.allowed).toBe(false);
    }
  });

  it("wraps CASL errors as internal_error", async () => {
    const failingAbility = {
      can: vi.fn().mockImplementation(() => {
        throw new Error("CASL internal error");
      }),
    } as any;

    const authorizer = new CaslAuthorizer(failingAbility);

    const result = await authorizer.authorize({
      subject: "user:123",
      action: "read",
      resource: "Order",
    });

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(AuthorizationError);
      expect(result.error.meta.reason).toBe("internal_error");
    }
  });
});
