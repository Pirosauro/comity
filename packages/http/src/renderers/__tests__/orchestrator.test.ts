import { describe, expect, it, vi } from "vitest";
import { HtmlRendererOrchestrator } from "../orchestrator.js";

describe("HtmlRenderer", () => {
  it("should throw error when no renderers provided", () => {
    expect(() => {
      // @ts-expect-error
      new HtmlRendererOrchestrator([]);
    }).toThrow("HtmlRenderer requires at least one renderer");
  });

  it("should render successfully with first renderer", async () => {
    const mockRenderer1 = {
      render: vi.fn().mockResolvedValue({
        intent: "html",
        status: 200,
        body: "<h1>Rendered by 1</h1>",
      }),
    };
    const mockRenderer2 = {
      render: vi.fn(),
    };

    const renderer = new HtmlRendererOrchestrator([
      mockRenderer1,
      mockRenderer2,
    ]);
    const contract = {
      success: true,
      data: { message: "test" },
      locale: { locale: "en", direction: "ltr" as const },
    };

    const result = await renderer.render(contract);

    expect(result).toEqual({
      intent: "html",
      status: 200,
      body: "<h1>Rendered by 1</h1>",
    });
    expect(mockRenderer1.render).toHaveBeenCalledWith(contract);
    expect(mockRenderer2.render).not.toHaveBeenCalled();
  });

  it("should fallback to second renderer when first fails", async () => {
    const mockRenderer1 = {
      render: vi.fn().mockRejectedValue(new Error("Renderer 1 failed")),
    };
    const mockRenderer2 = {
      render: vi.fn().mockResolvedValue({
        intent: "html",
        status: 200,
        body: "<h1>Rendered by 2</h1>",
      }),
    };

    const renderer = new HtmlRendererOrchestrator([
      mockRenderer1,
      mockRenderer2,
    ]);
    const contract = {
      success: true,
      data: { message: "test" },
      locale: { locale: "en", direction: "ltr" as const },
    };

    const result = await renderer.render(contract);

    expect(result).toEqual({
      intent: "html",
      status: 200,
      body: "<h1>Rendered by 2</h1>",
    });
    expect(mockRenderer1.render).toHaveBeenCalledWith(contract);
    expect(mockRenderer2.render).toHaveBeenCalledWith(contract);
  });

  it("should return fallback response when all renderers fail", async () => {
    const mockRenderer1 = {
      render: vi.fn().mockRejectedValue(new Error("Renderer 1 failed")),
    };
    const mockRenderer2 = {
      render: vi.fn().mockRejectedValue(new Error("Renderer 2 failed")),
    };

    const renderer = new HtmlRendererOrchestrator([
      mockRenderer1,
      mockRenderer2,
    ]);
    const contract = {
      success: false,
      data: { error: "test" },
      locale: { locale: "en", direction: "ltr" as const },
    };

    const result = await renderer.render(contract);

    expect(result).toEqual({
      intent: "html",
      status: 500,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
      body: "<!DOCTYPE html><html><body><h1>Internal Error</h1></body></html>",
    });
    expect(mockRenderer1.render).toHaveBeenCalledWith(contract);
    expect(mockRenderer2.render).toHaveBeenCalledWith(contract);
  });

  it("should work with single renderer", async () => {
    const mockRenderer = {
      render: vi.fn().mockResolvedValue({
        intent: "html",
        status: 200,
        body: "<h1>Single renderer</h1>",
      }),
    };

    const renderer = new HtmlRendererOrchestrator([mockRenderer]);
    const contract = {
      success: true,
      data: { message: "test" },
      locale: { locale: "en", direction: "ltr" as const },
    };

    const result = await renderer.render(contract);

    expect(result).toEqual({
      intent: "html",
      status: 200,
      body: "<h1>Single renderer</h1>",
    });
    expect(mockRenderer.render).toHaveBeenCalledWith(contract);
  });
});
