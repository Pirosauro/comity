import { beforeEach, describe, expect, it, vi } from "vitest";
import { ReactStreamingHtmlRenderer } from "../streaming-node.js";

describe("ReactStreamingHtmlRenderer (Node)", () => {
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

    // Mock the Node.js streaming
    const mockPassThrough = {
      write: vi.fn(),
      pipe: vi.fn(),
      destroy: vi.fn(),
      on: vi.fn(),
    };

    const mockReadable = {
      toWeb: vi.fn().mockReturnValue(new ReadableStream()),
    };

    vi.doMock("node:stream", () => ({
      PassThrough: vi.fn(() => mockPassThrough),
      Readable: mockReadable,
    }));

    const mockRenderToPipeableStream = vi.fn((element, options) => {
      // Simulate onShellReady being called
      setTimeout(() => {
        options.onShellReady();
      }, 0);

      return {
        pipe: vi.fn(),
        abort: vi.fn(),
      };
    });

    vi.doMock("react-dom/server", () => ({
      renderToPipeableStream: mockRenderToPipeableStream,
    }));

    const { ReactStreamingHtmlRenderer: MockedRenderer } =
      await import("../streaming-node.js");
    const mockedRenderer = new MockedRenderer(options);

    const result = await mockedRenderer.render(contract);

    expect(result).toEqual({
      intent: "html",
      status: 200,
      stream: expect.any(ReadableStream),
      abort: expect.any(Function),
      headers: { "custom-header": "value" },
    });
    expect(mockPassThrough.write).toHaveBeenCalledWith("<!DOCTYPE html>");
    expect(mockRenderToPipeableStream).toHaveBeenCalledWith(
      "<div>Hello World</div>",
      {
        onShellReady: expect.any(Function),
        onShellError: expect.any(Function),
        onError: expect.any(Function),
      },
    );
  });

  it("should render failed contract with error template", async () => {
    const contract = {
      success: false,
      data: { error: "Something went wrong" },
      locale: { locale: "en", direction: "ltr" as const },
      http: { status: 500 },
    };

    const mockPassThrough = {
      write: vi.fn(),
      pipe: vi.fn(),
      destroy: vi.fn(),
    };

    const mockReadable = {
      toWeb: vi.fn().mockReturnValue(new ReadableStream()),
    };

    vi.doMock("node:stream", () => ({
      PassThrough: vi.fn(() => mockPassThrough),
      Readable: mockReadable,
    }));

    const mockRenderToPipeableStream = vi.fn((element, options) => {
      setTimeout(() => {
        options.onShellReady();
      }, 0);

      return {
        pipe: vi.fn(),
        abort: vi.fn(),
      };
    });

    vi.doMock("react-dom/server", () => ({
      renderToPipeableStream: mockRenderToPipeableStream,
    }));

    const { ReactStreamingHtmlRenderer: MockedRenderer } =
      await import("../streaming-node.js");
    const mockedRenderer = new MockedRenderer(options);

    const result = await mockedRenderer.render(contract);

    expect(result).toEqual({
      intent: "html",
      status: 500,
      stream: expect.any(ReadableStream),
      abort: expect.any(Function),
    });
    expect(mockRenderToPipeableStream).toHaveBeenCalledWith(
      "<div>Error: Something went wrong</div>",
      {
        onShellReady: expect.any(Function),
        onShellError: expect.any(Function),
        onError: expect.any(Function),
      },
    );
  });

  it("should use default status 200 for successful contract", async () => {
    const contract = {
      success: true,
      data: { message: "test" },
      locale: { locale: "en", direction: "ltr" as const },
    };

    const mockPassThrough = {
      write: vi.fn(),
      pipe: vi.fn(),
      destroy: vi.fn(),
    };

    const mockReadable = {
      toWeb: vi.fn().mockReturnValue(new ReadableStream()),
    };

    vi.doMock("node:stream", () => ({
      PassThrough: vi.fn(() => mockPassThrough),
      Readable: mockReadable,
    }));

    const mockRenderToPipeableStream = vi.fn((element, options) => {
      setTimeout(() => {
        options.onShellReady();
      }, 0);

      return {
        pipe: vi.fn(),
        abort: vi.fn(),
      };
    });

    vi.doMock("react-dom/server", () => ({
      renderToPipeableStream: mockRenderToPipeableStream,
    }));

    const { ReactStreamingHtmlRenderer: MockedRenderer } =
      await import("../streaming-node.js");
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

    const mockPassThrough = {
      write: vi.fn(),
      pipe: vi.fn(),
      destroy: vi.fn(),
    };

    const mockReadable = {
      toWeb: vi.fn().mockReturnValue(new ReadableStream()),
    };

    vi.doMock("node:stream", () => ({
      PassThrough: vi.fn(() => mockPassThrough),
      Readable: mockReadable,
    }));

    const mockRenderToPipeableStream = vi.fn((element, options) => {
      setTimeout(() => {
        options.onShellReady();
      }, 0);

      return {
        pipe: vi.fn(),
        abort: vi.fn(),
      };
    });

    vi.doMock("react-dom/server", () => ({
      renderToPipeableStream: mockRenderToPipeableStream,
    }));

    const { ReactStreamingHtmlRenderer: MockedRenderer } =
      await import("../streaming-node.js");
    const mockedRenderer = new MockedRenderer(options);

    const result = await mockedRenderer.render(contract);

    expect(result.status).toBe(500);
  });

  it("should handle renderToPipeableStream onShellError", async () => {
    const contract = {
      success: true,
      data: { message: "test" },
      locale: { locale: "en", direction: "ltr" as const },
    };

    const mockPassThrough = {
      write: vi.fn(),
      pipe: vi.fn(),
      destroy: vi.fn(),
    };

    vi.doMock("node:stream", () => ({
      PassThrough: vi.fn(() => mockPassThrough),
      Readable: {
        toWeb: vi.fn(),
      },
    }));

    const mockRenderToPipeableStream = vi.fn((element, options) => {
      setTimeout(() => {
        options.onShellError(new Error("Shell error"));
      }, 0);

      return {
        pipe: vi.fn(),
        abort: vi.fn(),
      };
    });

    vi.doMock("react-dom/server", () => ({
      renderToPipeableStream: mockRenderToPipeableStream,
    }));

    const { ReactStreamingHtmlRenderer: MockedRenderer } =
      await import("../streaming-node.js");
    const mockedRenderer = new MockedRenderer(options);

    await expect(mockedRenderer.render(contract)).rejects.toThrow(
      "Shell error",
    );
  });

  it("should handle renderToPipeableStream onError", async () => {
    const contract = {
      success: true,
      data: { message: "test" },
      locale: { locale: "en", direction: "ltr" as const },
    };

    const mockPassThrough = {
      write: vi.fn(),
      pipe: vi.fn(),
      destroy: vi.fn(),
    };

    vi.doMock("node:stream", () => ({
      PassThrough: vi.fn(() => mockPassThrough),
      Readable: {
        toWeb: vi.fn(),
      },
    }));

    const mockRenderToPipeableStream = vi.fn((element, options) => {
      setTimeout(() => {
        options.onError(new Error("Render error"));
      }, 0);

      return {
        pipe: vi.fn(),
        abort: vi.fn(),
      };
    });

    vi.doMock("react-dom/server", () => ({
      renderToPipeableStream: mockRenderToPipeableStream,
    }));

    const { ReactStreamingHtmlRenderer: MockedRenderer } =
      await import("../streaming-node.js");
    const mockedRenderer = new MockedRenderer(options);

    await expect(mockedRenderer.render(contract)).rejects.toThrow(
      "Render error",
    );
  });

  it("should abort stream when timeout is reached", async () => {
    const contract = {
      success: true,
      data: { message: "test" },
      locale: { locale: "en", direction: "ltr" as const },
    };

    const mockPassThrough = {
      write: vi.fn(),
      pipe: vi.fn(),
      destroy: vi.fn(),
    };

    vi.doMock("node:stream", () => ({
      PassThrough: vi.fn(() => mockPassThrough),
      Readable: {
        toWeb: vi.fn(),
      },
    }));

    // Mock a slow renderToPipeableStream
    const mockRenderToPipeableStream = vi.fn(() => {
      // Never calls onShellReady
      return {
        pipe: vi.fn(),
        abort: vi.fn(),
      };
    });

    vi.doMock("react-dom/server", () => ({
      renderToPipeableStream: mockRenderToPipeableStream,
    }));

    const { ReactStreamingHtmlRenderer: MockedRenderer } =
      await import("../streaming-node.js");
    const mockedRenderer = new MockedRenderer({ ...options, timeout: 100 });

    await expect(mockedRenderer.render(contract)).rejects.toThrow(
      "SSR timeout",
    );
    expect(mockPassThrough.destroy).toHaveBeenCalledWith(expect.any(Error));
  });
});
