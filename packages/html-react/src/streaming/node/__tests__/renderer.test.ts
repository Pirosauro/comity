import { DefaultHtmlLayoutCollector } from "@comity/html";
import { createElement } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { ReactStreamingHtmlRenderer } from "../renderer.js";

describe("ReactStreamingHtmlRenderer (Node)", () => {
  let renderer: ReactStreamingHtmlRenderer;
  let collector: DefaultHtmlLayoutCollector;

  beforeEach(() => {
    renderer = new ReactStreamingHtmlRenderer();
    collector = new DefaultHtmlLayoutCollector();
  });

  describe("render", () => {
    it("should render a React element to a readable stream", async () => {
      const element = createElement("div", { "data-testid": "test" }, "Hello World");
      const result = await renderer.render(element, collector);

      expect(result.ok).toBe(true);

      if (result.ok) {
        expect(result.value.status).toBe(200);
        expect(result.value.body).toBeDefined();
        expect(typeof result.value.abort).toBe("function");
      }
    });

    it("should use custom status code", async () => {
      const element = createElement("div", null, "Test");
      const result = await renderer.render(element, collector, { status: 404 });

      expect(result.ok).toBe(true);

      if (result.ok) {
        expect(result.value.status).toBe(404);
      }
    });

    it("should include custom headers", async () => {
      const element = createElement("div", null, "Test");
      const result = await renderer.render(element, collector, {
        headers: { "X-Custom": "value" },
      });

      expect(result.ok).toBe(true);

      if (result.ok) {
        expect(result.value.headers).toEqual({ "X-Custom": "value" });
      }
    });

    it("should stream the rendered document through the body", async () => {
      collector.setTitle("Node Stream");

      const element = createElement("div", null, "Hello Node");
      const result = await renderer.render(element, collector);

      expect(result.ok).toBe(true);

      if (result.ok) {
        const reader = result.value.body.getReader();
        const parts: string[] = [];

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          parts.push(
            typeof value === "string"
              ? value
              : new TextDecoder().decode(value)
          );
        }

        const html = parts.join("");

        expect(html).toContain("<!DOCTYPE html>");
        expect(html).toContain("<title>Node Stream</title>");
        expect(html).toContain("<div>Hello Node</div>");
        expect(html).toContain("</body></html>");
      }
    });
  });
});
