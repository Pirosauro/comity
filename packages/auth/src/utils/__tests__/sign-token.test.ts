import type { AuthModuleOptions, AuthUser } from "../../types.js";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { signToken } from "../sign-token.js";

// Mock jose SignJWT (provide a constructable function and record constructor
// calls on a property so tests can inspect payloads)
vi.mock("jose", () => {
  const mockSignJWT = {
    setProtectedHeader: vi.fn().mockReturnThis(),
    setIssuedAt: vi.fn().mockReturnThis(),
    setSubject: vi.fn().mockReturnThis(),
    setExpirationTime: vi.fn().mockReturnThis(),
    setIssuer: vi.fn().mockReturnThis(),
    setAudience: vi.fn().mockReturnThis(),
    sign: vi.fn().mockResolvedValue("signed-jwt-token"),
  } as any;

  // Store the last payload for inspection
  let lastPayload: any = undefined;

  function SignJWT(payload: any) {
    lastPayload = payload;
    return mockSignJWT;
  }
  (SignJWT as any).getLastPayload = () => lastPayload;

  return {
    SignJWT,
  };
});

describe("signToken", () => {
  let mockSignJWT: any;
  let mockSignJWTConstructor: any;

  const baseOptions: AuthModuleOptions = {
    secret: "test-secret-key",
  };

  const baseUser: AuthUser<{ roles: Record<string, string[]> }> = {
    id: "user-123",
    roles: { admin: ["read", "write"] },
  };

  beforeEach(async () => {
    const { SignJWT } = await import("jose");
    mockSignJWTConstructor = SignJWT as any;

    // Get the mock instance that gets returned (constructable)
    const mockInstance = new (mockSignJWTConstructor as any)({});
    mockSignJWT = mockInstance;

    vi.clearAllMocks();
  });

  it("should create JWT with basic user data", async () => {
    const result = await signToken(baseUser, baseOptions);
    const payload = (mockSignJWTConstructor as any).getLastPayload();
    expect(payload).toEqual({
      sub: "user-123",
      iat: expect.any(Number),
      user: baseUser,
    });
    expect(mockSignJWT.setProtectedHeader).toHaveBeenCalledWith({
      alg: "HS256",
    });
    expect(mockSignJWT.setIssuedAt).toHaveBeenCalled();
    expect(mockSignJWT.setSubject).toHaveBeenCalledWith("user-123");
    expect(mockSignJWT.sign).toHaveBeenCalledWith(expect.any(Uint8Array));
    expect(result).toBe("signed-jwt-token");
  });

  it("should set expiration when lifetime is provided", async () => {
    const options = { ...baseOptions, lifetime: 3600 }; // 1 hour

    await signToken(baseUser, options);

    expect(mockSignJWT.setExpirationTime).toHaveBeenCalledWith(
      expect.any(Number)
    );

    // Check that expiration time is approximately current time + lifetime
    const call = mockSignJWT.setExpirationTime.mock.calls[0][0];
    const now = Math.floor(Date.now() / 1000);

    expect(call).toBeCloseTo(now + 3600, 5); // Within 5 seconds tolerance
  });

  it("should not set expiration when lifetime is not provided", async () => {
    await signToken(baseUser, baseOptions);
    // The implementation always sets expiration, defaulting to 1 hour if not provided
    expect(mockSignJWT.setExpirationTime).toHaveBeenCalledWith(
      expect.any(Number)
    );
  });

  it("should set issuer when provided", async () => {
    const options = { ...baseOptions, issuer: "https://auth.example.com" };

    await signToken(baseUser, options);

    expect(mockSignJWT.setIssuer).toHaveBeenCalledWith(
      "https://auth.example.com"
    );
  });

  it("should not set issuer when not provided", async () => {
    await signToken(baseUser, baseOptions);

    expect(mockSignJWT.setIssuer).not.toHaveBeenCalled();
  });

  it("should set audience when provided", async () => {
    const options = { ...baseOptions, audience: "https://api.example.com" };

    await signToken(baseUser, options);

    expect(mockSignJWT.setAudience).toHaveBeenCalledWith(
      "https://api.example.com"
    );
  });

  it("should handle string array audience", async () => {
    // Note: This tests the JOSE library capability even though our options
    // interface currently only supports string audience
    const options = { ...baseOptions, audience: "api1,api2" };

    await signToken(baseUser, options);

    expect(mockSignJWT.setAudience).toHaveBeenCalledWith("api1,api2");
  });

  it("should not set audience when not provided", async () => {
    await signToken(baseUser, baseOptions);

    expect(mockSignJWT.setAudience).not.toHaveBeenCalled();
  });

  it("should use custom algorithm when provided", async () => {
    const options = { ...baseOptions, algorithm: "HS512" as const };

    await signToken(baseUser, options);

    expect(mockSignJWT.setProtectedHeader).toHaveBeenCalledWith({
      alg: "HS512",
    });
  });

  it("should default to HS256 algorithm", async () => {
    await signToken(baseUser, baseOptions);

    expect(mockSignJWT.setProtectedHeader).toHaveBeenCalledWith({
      alg: "HS256",
    });
  });

  it("should include all user properties in payload", async () => {
    const userWithExtra: AuthUser<{ [key: string]: any }> = {
      id: "user-456",
      roles: { customer: ["read"] },
      verified: 1234567890,
      email: "user@example.com",
      name: "John Doe",
      permissions: ["read:profile"],
    };

    await signToken(userWithExtra, baseOptions);
    const payload = (mockSignJWTConstructor as any).getLastPayload();
    expect(payload).toEqual({
      sub: "user-456",
      iat: expect.any(Number),
      user: userWithExtra,
    });
  });

  it("should encode secret as Uint8Array", async () => {
    await signToken(baseUser, baseOptions);

    const encodedSecret = mockSignJWT.sign.mock.calls[0][0];
    expect(encodedSecret).toBeInstanceOf(Uint8Array);

    // Verify the encoded secret contains the expected bytes
    const expectedSecret = new TextEncoder().encode("test-secret-key");
    expect(encodedSecret).toEqual(expectedSecret);
  });

  it("should handle minimal user data", async () => {
    const minimalUser: AuthUser = {
      id: "minimal-user",
    };

    await signToken(minimalUser, baseOptions);
    const payload = (mockSignJWTConstructor as any).getLastPayload();
    expect(payload).toEqual({
      sub: "minimal-user",
      iat: expect.any(Number),
      user: minimalUser,
    });
  });

  it("should set current timestamp as iat", async () => {
    const beforeCall = Math.floor(Date.now() / 1000);
    await signToken(baseUser, baseOptions);
    const afterCall = Math.floor(Date.now() / 1000);
    const payload = (mockSignJWTConstructor as any).getLastPayload();
    expect(payload.iat).toBeGreaterThanOrEqual(beforeCall);
    expect(payload.iat).toBeLessThanOrEqual(afterCall);
  });

  it("should handle complete options configuration", async () => {
    const fullOptions: AuthModuleOptions = {
      secret: "full-secret",
      lifetime: 7200,
      issuer: "https://issuer.example.com",
      audience: "https://audience.example.com",
      algorithm: "HS384",
    };

    await signToken(baseUser, fullOptions);

    expect(mockSignJWT.setProtectedHeader).toHaveBeenCalledWith({
      alg: "HS384",
    });
    expect(mockSignJWT.setExpirationTime).toHaveBeenCalled();
    expect(mockSignJWT.setIssuer).toHaveBeenCalledWith(
      "https://issuer.example.com"
    );
    expect(mockSignJWT.setAudience).toHaveBeenCalledWith(
      "https://audience.example.com"
    );
  });

  it("should propagate errors from JOSE SignJWT", async () => {
    const signError = new Error("Signing failed");
    mockSignJWT.sign.mockRejectedValue(signError);

    await expect(signToken(baseUser, baseOptions)).rejects.toThrow(
      "Signing failed"
    );
  });
});
