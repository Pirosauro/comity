import { describe, expect, it } from "vitest";
import { renderIslandHtml } from "../island.js";

describe("renderIslandHtml", () => {
  it("should render HTML with island wrapper and script tag", () => {
    const children = "<div>Hello World</div>";
    const contract = {
      name: "test-island",
      data: { message: "Hello" },
      strategy: { type: "immediate" as const },
    };

    const result = renderIslandHtml(children, contract);

    expect(result).toContain("<comity-island>");
    expect(result).toContain("</comity-island>");
    expect(result).toContain(children);
    expect(result).toContain('<script type="application/json">');
    expect(result).toContain("</script>");
  });

  it("should serialize contract as JSON in script tag", () => {
    const children = "<p>Test</p>";
    const contract = {
      name: "my-island",
      data: { count: 5 },
      strategy: { type: "idle" as const },
    };

    const result = renderIslandHtml(children, contract);

    const scriptMatch = result.match(/<script type="application\/json">([\s\S]*?)<\/script>/);
    expect(scriptMatch).toBeTruthy();

    const jsonContent = scriptMatch![1].trim();
    const parsed = JSON.parse(jsonContent);
    expect(parsed).toEqual(contract);
  });

  it("should handle empty children", () => {
    const contract = {
      name: "empty-island",
      data: {},
      strategy: { type: "visible" as const },
    };

    const result = renderIslandHtml("", contract);

    expect(result).toContain("<comity-island>");
    expect(result).toContain('<script type="application/json">');
    expect(result).toContain("</comity-island>");
  });

  it("should handle complex data", () => {
    const contract = {
      name: "complex-island",
      data: {
        array: [1, 2, 3],
        object: { nested: "value" },
        null: null,
        boolean: true,
      },
      strategy: { type: "interaction" as const, options: ["click"] },
    };

    const result = renderIslandHtml("<span>Complex</span>", contract);

    const scriptMatch = result.match(/<script type="application\/json">([\s\S]*?)<\/script>/);
    expect(scriptMatch).toBeTruthy();

    const jsonContent = scriptMatch![1].trim();
    const parsed = JSON.parse(jsonContent);
    expect(parsed).toEqual(contract);
  });

  it("should trim whitespace from result", () => {
    const contract = {
      name: "trim-test",
      data: {},
      strategy: { type: "immediate" as const },
    };

    const result = renderIslandHtml("  <div></div>  ", contract);

    expect(result).not.toMatch(/^\s/);
    expect(result).not.toMatch(/\s$/);
  });
});