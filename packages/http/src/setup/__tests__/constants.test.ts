import { describe, expect, it } from "vitest";
import { HTTP_TOKEN } from "../constants.js";

describe("http setup constants", () => {
  it("should expose the http token", () => {
    expect(HTTP_TOKEN.description).toBe("@comity/http");
  });
});