import { describe, expect, it } from "vitest";
import { HTTP_HONO_TOKEN } from "../constants.js";

describe("HTTP_HONO_TOKEN", () => {
  it("should be defined", () => {
    expect(HTTP_HONO_TOKEN).toBeDefined();
  });

  it("should be a token with correct description", () => {
    expect(HTTP_HONO_TOKEN.toString()).toBe("Symbol(@comity/http-hono)");
  });

  it("should be unique", () => {
    const anotherToken = Symbol("@comity/http-hono");
    expect(HTTP_HONO_TOKEN).not.toBe(anotherToken);
  });

  it("should be a symbol", () => {
    expect(typeof HTTP_HONO_TOKEN).toBe("symbol");
  });
});
