import { DefaultHtmlLayoutCollector } from "@comity/html";
import { createElement } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { ReactStreamingHtmlRenderer } from "../renderer.js";

describe("ReactStreamingHtmlRenderer", () => {
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

    it("should handle streaming errors", async () => {
      const Boom = () => {
        throw new Error("Streaming failed");
      };
      const element = createElement(Boom);
      const result = await renderer.render(element, collector);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.code).toBe("html:render_error");
        expect(result.error.meta.context).toEqual({
          renderer: "react",
          mode: "web-streaming",
          layout: expect.stringContaining("Streaming failed"),
        });
      }
    });

    it("should stream the rendered document through the body", async () => {
      collector.setTitle("Streamed Page");

      const element = createElement("div", { "data-testid": "test" }, "Hello World");
      const result = await renderer.render(element, collector);

      expect(result.ok).toBe(true);

      if (result.ok) {
        const reader = result.value.body.getReader();
        const chunks: Uint8Array[] = [];

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          chunks.push(value);
        }

        const html = new TextDecoder().decode(
          chunks.reduce((acc, chunk) => {
            const merged = new Uint8Array(acc.length + chunk.length);

            merged.set(acc);
            merged.set(chunk, acc.length);

            return merged;
          }, new Uint8Array(0))
        );

        expect(html).toContain("<!DOCTYPE html>");
        expect(html).toContain("<title>Streamed Page</title>");
        expect(html).toContain('<div data-testid="test">Hello World</div>');
        expect(html).toContain("</body></html>");
      }
    });
  });
});
