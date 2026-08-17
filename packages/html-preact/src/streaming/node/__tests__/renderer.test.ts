import { DefaultHtmlLayoutCollector } from "@comity/html";
import { h } from "preact";
import { beforeEach, describe, expect, it } from "vitest";
import { PreactStreamingHtmlRenderer } from "../renderer.js";

describe("PreactStreamingHtmlRenderer (Node)", () => {
  let renderer: PreactStreamingHtmlRenderer;

  beforeEach(() => {
    renderer = new PreactStreamingHtmlRenderer();
  });

  describe("render", () => {
    it("should render a Preact element to a readable stream", async () => {
      const collector = new DefaultHtmlLayoutCollector();
      const element = h("div", { "data-testid": "test" }, "Hello World");
      const result = await renderer.render(element, collector);

      expect(result.ok).toBe(true);

      if (result.ok) {
        expect(result.value.status).toBe(200);
        expect(result.value.body).toBeDefined();
        expect(typeof result.value.abort).toBe("function");
      }
    });

    it("should use custom status code", async () => {
      const collector = new DefaultHtmlLayoutCollector();
      const element = h("div", null, "Test");
      const result = await renderer.render(element, collector, { status: 404 });

      expect(result.ok).toBe(true);

      if (result.ok) {
        expect(result.value.status).toBe(404);
      }
    });

    it("should include custom headers", async () => {
      const collector = new DefaultHtmlLayoutCollector();
      const element = h("div", null, "Test");
      const result = await renderer.render(element, collector, {
        headers: { "X-Custom": "value" },
      });

      expect(result.ok).toBe(true);

      if (result.ok) {
        expect(result.value.headers).toEqual({ "X-Custom": "value" });
      }
    });

    it("should handle streaming errors", async () => {
      const collector = new DefaultHtmlLayoutCollector();
      const Boom = () => {
        throw new Error("Streaming failed");
      };
      const element = h(Boom);
      const result = await renderer.render(element, collector);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.code).toBe("html:render_error");
        expect(result.error.meta.context).toEqual({
          renderer: "preact",
          mode: "node-streaming",
          layout: expect.stringContaining("Streaming failed"),
        });
      }
    });

    it("should stream the rendered document through the body", async () => {
      const collector = new DefaultHtmlLayoutCollector();

      collector.setTitle("Node Stream");

      const element = h("div", null, "Hello Node");
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
