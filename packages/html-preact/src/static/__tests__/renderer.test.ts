import { DefaultHtmlLayoutCollector } from "@comity/html";
import { h } from "preact";
import { beforeEach, describe, expect, it } from "vitest";
import { PreactStaticHtmlRenderer } from "../renderer.js";

describe("PreactStaticHtmlRenderer", () => {
  let renderer: PreactStaticHtmlRenderer;

  beforeEach(() => {
    renderer = new PreactStaticHtmlRenderer();
  });

  describe("render", () => {
    it("should render a simple Preact element to HTML", async () => {
      const collector = new DefaultHtmlLayoutCollector();
      const element = h("div", { "data-testid": "test" }, "Hello World");
      const result = await renderer.render(element, collector);

      expect(result.ok).toBe(true);

      if (result.ok) {
        expect(result.value.status).toBe(200);
        expect(result.value.headers?.["Content-Type"]).toBe("text/html; charset=utf-8");
        expect(result.value.body).toContain('<div data-testid="test">Hello World</div>');
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

    it("should merge custom headers", async () => {
      const collector = new DefaultHtmlLayoutCollector();
      const element = h("div", null, "Test");
      const result = await renderer.render(element, collector, {
        headers: { "X-Custom": "value" },
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.headers?.["Content-Type"]).toBe("text/html; charset=utf-8");
        expect(result.value.headers?.["X-Custom"]).toBe("value");
      }
    });

    it("should return a render_error result when rendering throws", async () => {
      const collector = new DefaultHtmlLayoutCollector();
      const Boom = () => {
        throw new Error("Rendering failed");
      };
      const element = h(Boom);
      const result = await renderer.render(element, collector);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.code).toBe("html:render_error");
        expect(result.error.meta.reason).toBe("render_error");
        expect(result.error.meta.context).toEqual({
          renderer: "preact",
          mode: "static",
          layout: expect.stringContaining("Rendering failed"),
        });
      }
    });
  });
});
