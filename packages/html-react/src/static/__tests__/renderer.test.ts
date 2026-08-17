import { DefaultHtmlLayoutCollector } from "@comity/html";
import { createElement } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { ReactStaticHtmlRenderer } from "../renderer.js";

describe("ReactStaticHtmlRenderer", () => {
  let renderer: ReactStaticHtmlRenderer;
  let collector: DefaultHtmlLayoutCollector;

  beforeEach(() => {
    renderer = new ReactStaticHtmlRenderer();
    collector = new DefaultHtmlLayoutCollector();
  });

  describe("render", () => {
    it("should render a simple React element to HTML", async () => {
      const element = createElement("div", { "data-testid": "test" }, "Hello World");

      const result = await renderer.render(element, collector);

      expect(result.ok).toBe(true);

      if (result.ok) {
        expect(result.value.status).toBe(200);
        expect(result.value.headers?.["Content-Type"]).toBe("text/html; charset=utf-8");
        expect(result.value.body).toContain('<div data-testid="test">Hello World</div>');
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

    it("should merge custom headers", async () => {
      const element = createElement("div", null, "Test");
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
      const Boom = () => {
        throw new Error("Rendering failed");
      };
      const element = createElement(Boom);
      const result = await renderer.render(element, collector);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.code).toBe("html:render_error");
        expect(result.error.meta.reason).toBe("render_error");
        expect(result.error.meta.context).toEqual({
          renderer: "react",
          mode: "static",
          layout: expect.stringContaining("Rendering failed"),
        });
      }
    });
  });
});
