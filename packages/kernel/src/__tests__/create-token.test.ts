import { describe, expect, it } from "vitest";
import { createToken } from "../create-token.js";

describe("createToken", () => {
  it("should create a token with description", () => {
    const token = createToken<"TestType">("Test description");

    expect(typeof token).toBe("symbol");
    expect(token.toString()).toBe("Symbol(Test description)");
  });

  it("should create unique tokens", () => {
    const token1 = createToken<"Type1">("Token 1");
    const token2 = createToken<"Type2">("Token 2");

    expect(token1).not.toBe(token2);
  });

  it("should create tokens with same description that are not equal", () => {
    const token1 = createToken<"Same">("Same description");
    const token2 = createToken<"Same">("Same description");

    expect(token1).not.toBe(token2);
    expect(token1.toString()).toBe(token2.toString());
  });

  it("should work with different type parameters", () => {
    const stringToken = createToken<"string">("String token");
    const numberToken = createToken<"number">("Number token");

    expect(typeof stringToken).toBe("symbol");
    expect(typeof numberToken).toBe("symbol");
    expect(stringToken).not.toBe(numberToken);
  });
});
