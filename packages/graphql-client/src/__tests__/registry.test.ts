import { describe, expect, it } from "vitest";
import { DefaultGraphqlRegistry } from "../registry.js";

describe("DefaultGraphqlRegistry", () => {
  it("returns the client registered under a name", () => {
    const registry = new DefaultGraphqlRegistry({ api: {} as never });

    expect(registry.get("api")).toBeDefined();
  });

  it("returns undefined for an unknown name", () => {
    const registry = new DefaultGraphqlRegistry({});

    expect(registry.get("missing")).toBeUndefined();
  });

  it("reports whether a name is registered", () => {
    const registry = new DefaultGraphqlRegistry({ api: {} as never });

    expect(registry.has("api")).toBe(true);
    expect(registry.has("missing")).toBe(false);
  });

  it("iterates over registered names", () => {
    const registry = new DefaultGraphqlRegistry({ api: {} as never, admin: {} as never });

    expect([...registry.keys()]).toEqual(["api", "admin"]);
  });
});