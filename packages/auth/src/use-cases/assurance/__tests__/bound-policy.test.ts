import type { AuthSession } from "../../../contracts/session.js";

import { describe, expect, it } from "vitest";
import { AssuranceRequiredError } from "../../../errors/assurance-required.js";
import { BoundAssurancePolicy } from "../bound-policy.js";

describe("BoundAssurancePolicy", () => {
  const baseSession: AuthSession = {
    id: "session1",
    createdAt: 1000,
    assurance: {
      methods: ["password"],
      score: 1,
      evaluatedAt: 1000,
      version: 1,
      context: {
        identityId: "user1",
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0",
        deviceId: "device1",
        channel: "web",
      },
    },
    transport: { type: "bearer" },
    verifiedAt: 1000,
  };

  it("should pass when context matches all bounds", () => {
    const policy = new BoundAssurancePolicy({
      identityId: "user1",
      ipAddress: "192.168.1.1",
    });

    expect(() => policy.assert(baseSession, 2000)).not.toThrow();
  });

  it("should pass when bounds are empty", () => {
    const policy = new BoundAssurancePolicy({});
    expect(() => policy.assert(baseSession, 2000)).not.toThrow();
  });

  it("should pass when session has no context and bounds are empty", () => {
    const policy = new BoundAssurancePolicy({});
    const session = { ...baseSession, assurance: { ...baseSession.assurance, context: undefined } };

    expect(() => policy.assert(session, 2000)).not.toThrow();
  });

  it("should pass when bound value is undefined", () => {
    const policy = new BoundAssurancePolicy({
      identityId: undefined,
      ipAddress: "192.168.1.1",
    });

    expect(() => policy.assert(baseSession, 2000)).not.toThrow();
  });

  it("should throw when identityId does not match", () => {
    const policy = new BoundAssurancePolicy({
      identityId: "user2",
    });

    expect(() => policy.assert(baseSession, 2000)).toThrow(AssuranceRequiredError);

    try {
      policy.assert(baseSession, 2000);
    } catch (error) {
      expect(error).toBeInstanceOf(AssuranceRequiredError);

      if (error instanceof AssuranceRequiredError) {
        expect(error.meta["reason"]).toBe("out_of_bounds");
        expect(error.meta["policy"]).toBe("bound");
        expect(error.meta["expected"]).toEqual({ identityId: "user2" });
        expect(error.meta["actual"]).toEqual({ identityId: "user1" });
      }
    }
  });

  it("should throw when ipAddress does not match", () => {
    const policy = new BoundAssurancePolicy({
      ipAddress: "10.0.0.1",
    });

    expect(() => policy.assert(baseSession, 2000)).toThrow(AssuranceRequiredError);
  });

  it("should throw when userAgent does not match", () => {
    const policy = new BoundAssurancePolicy({
      userAgent: "Different Browser",
    });

    expect(() => policy.assert(baseSession, 2000)).toThrow(AssuranceRequiredError);
  });

  it("should throw when deviceId does not match", () => {
    const policy = new BoundAssurancePolicy({
      deviceId: "device2",
    });

    expect(() => policy.assert(baseSession, 2000)).toThrow(AssuranceRequiredError);
  });

  it("should throw when channel does not match", () => {
    const policy = new BoundAssurancePolicy({
      channel: "mobile",
    });

    expect(() => policy.assert(baseSession, 2000)).toThrow(AssuranceRequiredError);
  });

  it("should throw when providerId does not match", () => {
    const policy = new BoundAssurancePolicy({
      providerId: "provider2",
    });
    const session = {
      ...baseSession,
      assurance: {
        ...baseSession.assurance,
        context: { ...baseSession.assurance.context, providerId: "provider1" },
      },
    };

    expect(() => policy.assert(session, 2000)).toThrow(AssuranceRequiredError);
  });

  it("should throw when context value is missing but expected", () => {
    const policy = new BoundAssurancePolicy({
      providerId: "provider1",
    });

    expect(() => policy.assert(baseSession, 2000)).toThrow(AssuranceRequiredError);
  });

  it("should check all bounds", () => {
    const policy = new BoundAssurancePolicy({
      identityId: "user1",
      ipAddress: "192.168.1.1",
      userAgent: "Mozilla/5.0",
      deviceId: "device1",
      channel: "web",
    });

    expect(() => policy.assert(baseSession, 2000)).not.toThrow();
  });
});
