import { describe, expect, it } from "vitest";
import { AUTH_JOSE_TOKEN } from "../constants.js";

describe("AUTH_JOSE_TOKEN", () => {
  it("creates a symbol token with the package description", () => {
    expect(typeof AUTH_JOSE_TOKEN).toBe("symbol");
    expect(AUTH_JOSE_TOKEN.toString()).toBe("Symbol(@comity/auth-jose)");
  });
});
