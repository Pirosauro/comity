import { describe, expect, it } from "vitest";
import { evaluateAssurance } from "../evaluate.js";

describe("evaluateAssurance", () => {
  it("should create assurance with basic input", () => {
    const input = {
      methods: ["password"],
      transport: "web",
    };

    const result = evaluateAssurance(input, 1000);

    expect(result.methods).toEqual(["password"]);
    expect(result.proof).toBe("web");
    expect(result.score).toBe(0);
    expect(result.evaluatedAt).toBe(1000);
    expect(result.version).toBe(0);
  });

  it("should include context when provided", () => {
    const input = {
      methods: ["password", "totp"],
      transport: "web",
      context: {
        userAgent: "Mozilla/5.0",
        ipAddress: "192.168.1.1",
        deviceId: "device1",
        channel: "web",
      },
    };

    const result = evaluateAssurance(input, 2000);

    expect(result.methods).toEqual(["password", "totp"]);
    expect(result.evaluatedAt).toBe(2000);
    expect(result.context?.userAgent).toBe("Mozilla/5.0");
    expect(result.context?.ipAddress).toBe("192.168.1.1");
    expect(result.context?.deviceId).toBe("device1");
    expect(result.context?.channel).toBe("web");
  });

  it("should handle multiple methods", () => {
    const input = {
      methods: ["password", "totp", "webauthn"],
      transport: "web",
    };

    const result = evaluateAssurance(input, 1500);

    expect(result.methods).toHaveLength(3);
    expect(result.methods).toContain("password");
    expect(result.methods).toContain("totp");
    expect(result.methods).toContain("webauthn");
  });

  it("should use transport as proof", () => {
    const input = {
      methods: ["password"],
      transport: "mobile-app",
    };

    const result = evaluateAssurance(input, 1000);

    expect(result.proof).toBe("mobile-app");
  });

  it("should work without context", () => {
    const input = {
      methods: ["token"],
      transport: "api",
    };

    const result = evaluateAssurance(input, 3000);

    expect(result.methods).toEqual(["token"]);
    expect(result.proof).toBe("api");
    expect(result.score).toBe(0);
    expect(result.evaluatedAt).toBe(3000);
    expect(result.version).toBe(0);
  });

  it("should handle empty context", () => {
    const input = {
      methods: ["password"],
      transport: "web",
      context: {},
    };

    const result = evaluateAssurance(input, 1000);

    expect(result.methods).toEqual(["password"]);
    expect(result.proof).toBe("web");
  });

  it("should preserve all context fields", () => {
    const input = {
      methods: ["password"],
      transport: "web",
      context: {
        identityId: "user1",
        userAgent: "Chrome",
        ipAddress: "10.0.0.1",
        deviceId: "abc123",
        channel: "desktop",
      },
    };

    const result = evaluateAssurance(input, 1000);

    expect(result.context?.identityId).toBe("user1");
    expect(result.context?.userAgent).toBe("Chrome");
    expect(result.context?.ipAddress).toBe("10.0.0.1");
    expect(result.context?.deviceId).toBe("abc123");
    expect(result.context?.channel).toBe("desktop");
  });
});
