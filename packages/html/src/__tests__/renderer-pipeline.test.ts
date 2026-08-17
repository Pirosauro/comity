import { describe, expect, it, vi } from "vitest";
import { MockRenderer } from "../__mocks__/html-renderer.js";
import type { HtmlLayoutCollector } from "../contracts/layout.js";
import { HtmlRendererPipeline } from "../renderer-pipeline.js";

describe("HtmlRendererPipeline", () => {
  it("should render successfully with first renderer", async () => {
    const renderers = [new MockRenderer(true), new MockRenderer(false)];
    const pipeline = new HtmlRendererPipeline(renderers);
    const result = await pipeline.render("test content");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.status).toBe(200);
      expect(result.value.body).toBe("<div>test content</div>");
    }
  });

  it("should try next renderer if first fails", async () => {
    const renderers = [new MockRenderer(false), new MockRenderer(true)];
    const pipeline = new HtmlRendererPipeline(renderers);
    const result = await pipeline.render("test content");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.body).toBe("<div>test content</div>");
    }
  });

  it("should return failure if all renderers fail", async () => {
    const renderers = [new MockRenderer(false), new MockRenderer(false)];
    const pipeline = new HtmlRendererPipeline(renderers);
    const result = await pipeline.render("test content");

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error.code).toBe("html:render_error");
      expect(result.error.meta.reason).toBe("render_error"); // Returns last failure
    }
  });

  it("should return failure if no renderers provided", async () => {
    const pipeline = new HtmlRendererPipeline([]);
    const result = await pipeline.render("test content");

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error.meta.reason).toBe("no_renderer");
    }
  });

  it("should pass options to renderers", async () => {
    const mockRenderer = new MockRenderer(true);
    const spy = vi.spyOn(mockRenderer, "render");
    const pipeline = new HtmlRendererPipeline([mockRenderer]);
    const collector = {} as HtmlLayoutCollector;
    const options = { status: 404, headers: { "X-Test": "value" } };

    await pipeline.render("test", collector, options);

    expect(spy).toHaveBeenCalledWith("test", collector, options);
  });

  it("should emit renderStarted and renderCompleted events", async () => {
    const renderers = [new MockRenderer(true)];
    const observer = {
      onRenderStarted: vi.fn(),
      onRenderCompleted: vi.fn(),
    };
    const pipeline = new HtmlRendererPipeline(renderers, observer);

    await pipeline.render("test");

    expect(observer.onRenderStarted).toHaveBeenCalledWith({
      renderer: "MockRenderer",
    });
    expect(observer.onRenderCompleted).toHaveBeenCalledWith({
      renderer: "MockRenderer",
      duration: expect.any(Number),
    });
  });

  it("should emit renderFailed events for failed renderers", async () => {
    const renderers = [new MockRenderer(false), new MockRenderer(true)];
    const observer = {
      onRenderFailed: vi.fn(),
    };
    const pipeline = new HtmlRendererPipeline(renderers, observer);

    await pipeline.render("test");

    expect(observer.onRenderFailed).toHaveBeenCalledWith({
      renderer: "MockRenderer",
      duration: expect.any(Number),
      error: expect.objectContaining({
        code: "html:render_error",
        message: "An error occurred while rendering the view",
      }),
    });
  });
});
