import { describe, expect, it } from "vitest";
import { GRAPHQL_CLIENT_TOKEN } from "../constants.js";

describe("graphql client setup constants", () => {
  it("should expose the graphql client token", () => {
    expect(GRAPHQL_CLIENT_TOKEN).toBe(Symbol.for("@comity/graphql-client"));
  });
});