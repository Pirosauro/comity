import type { HttpHtmlResponse } from "@comity/http";
import type { Result } from "@comity/primitives/result";
import { describe, expect, it, vi } from "vitest";
import { HtmlRenderFailureError } from "../../errors/render-failure.js";
import { HtmlRendererPipeline } from "../renderer-pipeline.js";

// Mock renderer for testing
class MockRenderer {
  constructor(
    private shouldSucceed: boolean = true,
    private name = "MockRenderer"
  ) {}

  async render(
    view: any,
    options?: any
  ): Promise<Result<HttpHtmlResponse, HtmlRenderFailureError, "ok">> {
    if (this.shouldSucceed) {
      return {
        ok: true,
        value: {
          intent: "html",
          status: 200,
          headers: { "Content-Type": "text/html" },
          body: `<div>${view}</div>`,
        },
      };
    } else {
      return {
        ok: false,
        error: new HtmlRenderFailureError({ reason: "mock-failure" }),
      };
    }
  }
}

describe("HtmlRendererPipeline", () => {
  it("should render successfully with first renderer", async () => {
    const renderers = [new MockRenderer(true), new MockRenderer(false)];
    const pipeline = new HtmlRendererPipeline(renderers);

    const result = await pipeline.render("test content");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.intent).toBe("html");
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
      expect(result.error.code).toBe("html:render-failure");
      expect(result.error.meta.reason).toBe("mock-failure"); // Returns last failure
    }
  });

  it("should return failure if no renderers provided", async () => {
    const pipeline = new HtmlRendererPipeline([]);

    const result = await pipeline.render("test content");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.meta.reason).toBe("no-renderer-available");
    }
  });

  it("should pass options to renderers", async () => {
    const mockRenderer = new MockRenderer(true);
    const spy = vi.spyOn(mockRenderer, "render");

    const pipeline = new HtmlRendererPipeline([mockRenderer]);
    const options = { status: 404, headers: { "X-Test": "value" } };

    await pipeline.render("test", options);

    expect(spy).toHaveBeenCalledWith("test", options);
  });

  it("should emit renderStarted and renderCompleted events", async () => {
    const renderers = [new MockRenderer(true)];
    const emitter = {
      renderStarted: vi.fn(),
      renderCompleted: vi.fn(),
    };

    const pipeline = new HtmlRendererPipeline(renderers, emitter);

    await pipeline.render("test");

    expect(emitter.renderStarted).toHaveBeenCalledWith({
      renderer: "MockRenderer",
    });
    expect(emitter.renderCompleted).toHaveBeenCalledWith({
      renderer: "MockRenderer",
      duration: expect.any(Number),
    });
  });

  it("should emit renderFailed events for failed renderers", async () => {
    const renderers = [new MockRenderer(false), new MockRenderer(true)];
    const emitter = {
      renderFailed: vi.fn(),
    };

    const pipeline = new HtmlRendererPipeline(renderers, emitter);

    await pipeline.render("test");

    expect(emitter.renderFailed).toHaveBeenCalledWith({
      renderer: "MockRenderer",
      duration: expect.any(Number),
      reason: "renderer-error",
    });
  });
});
