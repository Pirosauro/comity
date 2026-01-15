import { beforeEach, describe, expect, it, vi } from "vitest";
import { ReactStreamingHtmlRenderer } from "../streaming-edge.js";

describe("ReactStreamingHtmlRenderer", () => {
  const mockTemplates = {
    default: vi.fn((data) => `<div>${data.message}</div>`),
    error: vi.fn((data) => `<div>Error: ${data.error}</div>`),
  };

  const options = {
    templates: mockTemplates,
    timeout: 5000,
  };

  let renderer: ReactStreamingHtmlRenderer;

  beforeEach(() => {
    renderer = new ReactStreamingHtmlRenderer(options);
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
    const mockRenderToReadableStream = vi.fn().mockResolvedValue(mockStream);
    vi.doMock("react-dom/server", () => ({
      renderToReadableStream: mockRenderToReadableStream,
    }));

    // Re-import to use the mock
    const { ReactStreamingHtmlRenderer: MockedRenderer } =
      await import("../streaming-edge.js");
    const mockedRenderer = new MockedRenderer(options);

    const result = await mockedRenderer.render(contract);

    expect(result).toEqual({
      intent: "html",
      status: 200,
      stream: mockStream,
      abort: expect.any(Function),
      headers: { "custom-header": "value" },
    });
    expect(mockRenderToReadableStream).toHaveBeenCalledWith(
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
    const mockRenderToReadableStream = vi.fn().mockResolvedValue(mockStream);
    vi.doMock("react-dom/server", () => ({
      renderToReadableStream: mockRenderToReadableStream,
    }));

    const { ReactStreamingHtmlRenderer: MockedRenderer } =
      await import("../streaming-edge.js");
    const mockedRenderer = new MockedRenderer(options);

    const result = await mockedRenderer.render(contract);

    expect(result).toEqual({
      intent: "html",
      status: 500,
      stream: mockStream,
      abort: expect.any(Function),
    });
    expect(mockRenderToReadableStream).toHaveBeenCalledWith(
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
    const mockRenderToReadableStream = vi.fn().mockResolvedValue(mockStream);
    vi.doMock("react-dom/server", () => ({
      renderToReadableStream: mockRenderToReadableStream,
    }));

    const { ReactStreamingHtmlRenderer: MockedRenderer } =
      await import("../streaming-edge.js");
    const mockedRenderer = new MockedRenderer(options);

    const result = await mockedRenderer.render(contract);

    expect(result.status).toBe(200);
  });

  it("should use default status 500 for failed contract", async () => {
    const contract = {
      success: false,
      data: { error: "test" },
      locale: { locale: "en", direction: "ltr" as const },
    };

    const mockStream = new ReadableStream();
    const mockRenderToReadableStream = vi.fn().mockResolvedValue(mockStream);
    vi.doMock("react-dom/server", () => ({
      renderToReadableStream: mockRenderToReadableStream,
    }));

    const { ReactStreamingHtmlRenderer: MockedRenderer } =
      await import("../streaming-edge.js");
    const mockedRenderer = new MockedRenderer(options);

    const result = await mockedRenderer.render(contract);

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
    const mockRenderToReadableStream = vi.fn().mockResolvedValue(mockStream);
    vi.doMock("react-dom/server", () => ({
      renderToReadableStream: mockRenderToReadableStream,
    }));

    const { ReactStreamingHtmlRenderer: MockedRenderer } =
      await import("../streaming-edge.js");
    const mockedRenderer = new MockedRenderer(options);

    const result = await mockedRenderer.render(contract);

    expect(result.headers).toEqual({ "x-custom": "header" });
  });

  it("should handle renderToReadableStream throwing error", async () => {
    const contract = {
      success: true,
      data: { message: "test" },
      locale: { locale: "en", direction: "ltr" as const },
    };

    const mockRenderToReadableStream = vi
      .fn()
      .mockRejectedValue(new Error("Streaming error"));
    vi.doMock("react-dom/server", () => ({
      renderToReadableStream: mockRenderToReadableStream,
    }));

    const { ReactStreamingHtmlRenderer: MockedRenderer } =
      await import("../streaming-edge.js");
    const mockedRenderer = new MockedRenderer(options);

    await expect(mockedRenderer.render(contract)).rejects.toThrow(
      "Streaming error",
    );
  });

  it("should abort stream when timeout is reached", async () => {
    const contract = {
      success: true,
      data: { message: "test" },
      locale: { locale: "en", direction: "ltr" as const },
    };

    // Mock a slow renderToReadableStream that takes longer than timeout
    const mockRenderToReadableStream = vi.fn(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(new ReadableStream()), 6000),
        ),
    );
    vi.doMock("react-dom/server", () => ({
      renderToReadableStream: mockRenderToReadableStream,
    }));

    const { ReactStreamingHtmlRenderer: MockedRenderer } =
      await import("../streaming-edge.js");
    const mockedRenderer = new MockedRenderer({ ...options, timeout: 100 });

    await expect(mockedRenderer.render(contract)).rejects.toThrow();
  });
});
