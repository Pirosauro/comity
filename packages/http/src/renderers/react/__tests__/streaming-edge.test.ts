import { beforeEach, describe, expect, it, vi } from "vitest";
import { ReactStreamingHtmlRenderer } from "../streaming-edge.js";

// Mock react-dom/server
vi.mock("react-dom/server", () => ({
  renderToReadableStream: vi.fn(),
}));

import { renderToReadableStream } from "react-dom/server";

describe("ReactStreamingHtmlRenderer", () => {
  const mockTemplates = {
    default: vi.fn((data) => `<div>${data.message}</div>`),
    error: vi.fn((data) => `<div>Error: ${data.error}</div>`),
  };

  const options: any = {
    templates: mockTemplates,
    timeout: 5000,
  };

  let renderer: ReactStreamingHtmlRenderer;

  beforeEach(() => {
    renderer = new ReactStreamingHtmlRenderer(options);
    vi.clearAllMocks();
  });

  it("should render successful contract with streaming", async () => {
    const contract = {
      success: true,
      data: { message: "Hello World" },
      locale: { locale: "en", direction: "ltr" as const },
      http: { status: 200, headers: { "custom-header": "value" } },
    };

    // Mock renderToReadableStream
    const mockStream = new ReadableStream();
    (renderToReadableStream as any).mockResolvedValue(mockStream);

    const result = await renderer.render(contract);

    expect(result).toEqual({
      intent: "html",
      status: 200,
      stream: mockStream,
      abort: expect.any(Function),
      headers: { "custom-header": "value" },
    });
    expect(renderToReadableStream).toHaveBeenCalledWith(
      "<div>Hello World</div>",
      { signal: expect.any(AbortSignal) },
    );
  });

  it("should render failed contract with error template", async () => {
    const contract = {
      success: false,
      data: { error: "Something went wrong" },
      locale: { locale: "en", direction: "ltr" as const },
      http: { status: 500 },
    };

    const mockStream = new ReadableStream();
    (renderToReadableStream as any).mockResolvedValue(mockStream);

    const result = await renderer.render(contract);

    expect(result).toEqual({
      intent: "html",
      status: 500,
      stream: mockStream,
      abort: expect.any(Function),
    });
    expect(renderToReadableStream).toHaveBeenCalledWith(
      "<div>Error: Something went wrong</div>",
      { signal: expect.any(AbortSignal) },
    );
  });

  it("should use default status 200 for successful contract", async () => {
    const contract = {
      success: true,
      data: { message: "test" },
      locale: { locale: "en", direction: "ltr" as const },
    };

    const mockStream = new ReadableStream();
    (renderToReadableStream as any).mockResolvedValue(mockStream);

    const result = await renderer.render(contract);

    expect(result.status).toBe(200);
  });

  it("should use default status 500 for failed contract", async () => {
    const contract = {
      success: false,
      data: { error: "test" },
      locale: { locale: "en", direction: "ltr" as const },
    };

    const mockStream = new ReadableStream();
    (renderToReadableStream as any).mockResolvedValue(mockStream);

    const result = await renderer.render(contract);

    expect(result.status).toBe(500);
  });

  it("should include contract headers", async () => {
    const contract = {
      success: true,
      data: { message: "test" },
      locale: { locale: "en", direction: "ltr" as const },
      http: { headers: { "x-custom": "header" } },
    };

    const mockStream = new ReadableStream();
    (renderToReadableStream as any).mockResolvedValue(mockStream);

    const result: any = await renderer.render(contract);

    expect(result.headers).toEqual({ "x-custom": "header" });
  });

  it("should handle renderToReadableStream throwing error", async () => {
    const contract = {
      success: true,
      data: { message: "test" },
      locale: { locale: "en", direction: "ltr" as const },
    };

    (renderToReadableStream as any).mockRejectedValue(
      new Error("Streaming error"),
    );

    await expect(renderer.render(contract)).rejects.toThrow("Streaming error");
  });

  it("should abort stream when timeout is reached", async () => {
    const contract = {
      success: true,
      data: { message: "test" },
      locale: { locale: "en", direction: "ltr" as const },
    };

    // Mock renderToReadableStream to reject with AbortError when aborted
    (renderToReadableStream as any).mockImplementation(
      (element: any, options: any) => {
        return new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            if (options.signal.aborted) {
              reject(new Error("Aborted"));
            } else {
              resolve(new ReadableStream());
            }
          }, 200); // Resolve quickly but check abort

          options.signal.addEventListener("abort", () => {
            clearTimeout(timeout);
            reject(new Error("Aborted"));
          });
        });
      },
    );

    const timeoutRenderer = new ReactStreamingHtmlRenderer({
      ...options,
      timeout: 100,
    });

    await expect(timeoutRenderer.render(contract)).rejects.toThrow("Aborted");
  });
});
