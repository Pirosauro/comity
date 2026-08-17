import { describe, expect, it } from "vitest";
import { AUTH_TOKEN } from "../constants.js";

describe("AUTH_TOKEN", () => {
  it("is a symbol identifying the auth module", () => {
    expect(typeof AUTH_TOKEN).toBe("symbol");
  });

  it("has the comity auth description", () => {
    expect(AUTH_TOKEN.description).toBe("@comity/auth");
  });
});