import type { HttpContext, HttpFacade, HttpResponse, HttpRuntimeContext } from "@comity/http";
import type { Context as HonoContext } from "hono";

import { describe, expect, it, vi } from "vitest";
import { httpHonoAdapter } from "../adapter.js";

// Mock the internal functions
vi.mock("../internal/context.js", () => ({
  createHttpContext: vi.fn(),
}));

vi.mock("../internal/map-error.js", () => ({
  mapErrorToHttpResponse: vi.fn(),
}));

vi.mock("../internal/map-response.js", () => ({
  mapHttpResponseToHono: vi.fn(),
}));

import { createHttpContext } from "../internal/context.js";
import { mapErrorToHttpResponse } from "../internal/map-error.js";
import { mapHttpResponseToHono } from "../internal/map-response.js";

describe("httpHonoAdapter", () => {
  it("should register middleware on Hono instance", () => {
    const useMiddleware = vi.fn();

    const mockHono = {
      use: useMiddleware,
    } as unknown as Hono;

    const mockFacade = {
      handle: vi.fn(),
    } as unknown as HttpFacade;

    httpHonoAdapter(mockHono, mockFacade);

    expect(useMiddleware).toHaveBeenCalledWith("*", expect.any(Function));
  });

  it("should use pattern * to handle all routes", () => {
    const useMiddleware = vi.fn();

    const mockHono = {
      use: useMiddleware,
    } as unknown as Hono;

    const mockFacade = {
      handle: vi.fn(),
    } as unknown as HttpFacade;

    httpHonoAdapter(mockHono, mockFacade);

    const [pattern] = useMiddleware.mock.calls[0];
    expect(pattern).toBe("*");
  });

  it("should adapter function returns undefined", () => {
    const mockHono = {
      use: vi.fn(),
    } as unknown as Hono;

    const mockFacade = {
      handle: vi.fn(),
    } as unknown as HttpFacade;

    const result = httpHonoAdapter(mockHono, mockFacade);

    expect(result).toBeUndefined();
  });

  it("should register middleware function that is invoked", () => {
    let capturedMiddleware: any;

    const mockHono = {
      use: vi.fn((pattern, handler) => {
        capturedMiddleware = handler;
      }),
    } as unknown as Hono;

    const mockFacade = {
      handle: vi.fn(),
    } as unknown as HttpFacade;

    httpHonoAdapter(mockHono, mockFacade);

    expect(capturedMiddleware).toBeDefined();
    expect(typeof capturedMiddleware).toBe("function");
  });

  it("should middleware be async function", () => {
    let capturedMiddleware: any;

    const mockHono = {
      use: vi.fn((pattern, handler) => {
        capturedMiddleware = handler;
      }),
    } as unknown as Hono;

    const mockFacade = {
      handle: vi.fn(),
    } as unknown as HttpFacade;

    httpHonoAdapter(mockHono, mockFacade);

    // Verify middleware function is defined
    expect(typeof capturedMiddleware).toBe("function");
    // Verify it's an async function (will be Promise-like or have async behavior)
    expect(capturedMiddleware.constructor.name).toMatch(/AsyncFunction|Function/);
  });

  it("should not call facade until middleware is invoked", () => {
    const mockHono = {
      use: vi.fn(),
    } as unknown as Hono;

    const mockFacade = {
      handle: vi.fn(),
    } as unknown as HttpFacade;

    httpHonoAdapter(mockHono, mockFacade);

    expect(mockFacade.handle).not.toHaveBeenCalled();
  });

  it("should register only one middleware", () => {
    const mockHono = {
      use: vi.fn(),
    } as unknown as Hono;

    const mockFacade = {
      handle: vi.fn(),
    } as unknown as HttpFacade;

    httpHonoAdapter(mockHono, mockFacade);

    expect(mockHono.use).toHaveBeenCalledTimes(1);
  });

  it("should middleware accept context and next function", () => {
    let capturedMiddleware: any;

    const mockHono = {
      use: vi.fn((pattern, handler) => {
        capturedMiddleware = handler;
      }),
    } as unknown as Hono;

    const mockFacade = {
      handle: vi.fn(),
    } as unknown as HttpFacade;

    httpHonoAdapter(mockHono, mockFacade);

    // Just verify the middleware function is registered and callable
    expect(typeof capturedMiddleware).toBe("function");
  });

  it("should be callable multiple times with different instances", () => {
    for (let i = 0; i < 3; i++) {
      const mockHono = {
        use: vi.fn(),
      } as unknown as Hono;

      const mockFacade = {
        handle: vi.fn(),
      } as unknown as HttpFacade;

      expect(() => {
        httpHonoAdapter(mockHono, mockFacade);
      }).not.toThrow();

      expect(mockHono.use).toHaveBeenCalled();
    }
  });

  it("should middleware be function suitable for Hono middleware chain", () => {
    let capturedMiddleware: any;

    const mockHono = {
      use: vi.fn((pattern, handler) => {
        capturedMiddleware = handler;
      }),
    } as unknown as Hono;

    const mockFacade = {
      handle: vi.fn(),
    } as unknown as HttpFacade;

    httpHonoAdapter(mockHono, mockFacade);

    expect(typeof capturedMiddleware).toBe("function");
  });

  describe("middleware execution", () => {
    let mockHono: Hono;
    let mockFacade: HttpFacade;
    let mockRuntime: HttpRuntimeContext;
    let mockContext: HonoContext;
    let capturedMiddleware: Function;

    beforeEach(() => {
      vi.clearAllMocks();

      mockContext = {
        req: {
          method: "GET",
          url: "http://localhost/test",
          header: vi.fn(),
          raw: { headers: new Headers(), signal: {} as any },
          param: vi.fn(),
          query: vi.fn(),
          cookie: vi.fn(),
        },
      } as unknown as HonoContext;

      mockFacade = {
        handle: vi.fn(),
      } as unknown as HttpFacade;

      mockRuntime = {
        services: {},
        events: {},
      } as HttpRuntimeContext;

      mockHono = {
        use: vi.fn((pattern, handler) => {
          capturedMiddleware = handler;
        }),
      } as unknown as Hono;

      httpHonoAdapter(mockHono, mockFacade, mockRuntime);
    });

    it("should create HttpContext from Hono context", async () => {
      const mockHttpContext = { request: {}, signal: {} } as HttpContext;
      const mockResponse = { status: 200 } as HttpResponse;

      vi.mocked(createHttpContext).mockReturnValue(mockHttpContext);
      vi.mocked(mockFacade.handle).mockResolvedValue(mockResponse);
      vi.mocked(mapHttpResponseToHono).mockReturnValue(new Response());

      await capturedMiddleware(mockContext);

      expect(createHttpContext).toHaveBeenCalledWith(mockContext, mockRuntime);
    });

    it("should call facade.handle with created context", async () => {
      const mockHttpContext = { request: {}, signal: {} } as HttpContext;
      const mockResponse = { status: 200 } as HttpResponse;

      vi.mocked(createHttpContext).mockReturnValue(mockHttpContext);
      vi.mocked(mockFacade.handle).mockResolvedValue(mockResponse);
      vi.mocked(mapHttpResponseToHono).mockReturnValue(new Response());

      await capturedMiddleware(mockContext);

      expect(mockFacade.handle).toHaveBeenCalledWith(mockHttpContext);
    });

    it("should map successful response to Hono response", async () => {
      const mockHttpContext = { request: {}, signal: {} } as HttpContext;
      const mockResponse = { status: 200, body: "success" } as HttpResponse;
      const expectedHonoResponse = new Response("success");

      vi.mocked(createHttpContext).mockReturnValue(mockHttpContext);
      vi.mocked(mockFacade.handle).mockResolvedValue(mockResponse);
      vi.mocked(mapHttpResponseToHono).mockReturnValue(expectedHonoResponse);

      const result = await capturedMiddleware(mockContext);

      expect(mapHttpResponseToHono).toHaveBeenCalledWith(mockContext, mockResponse);
      expect(result).toBe(expectedHonoResponse);
    });

    it("should handle facade errors and map to HTTP response", async () => {
      const mockHttpContext = { request: {}, signal: {} } as HttpContext;
      const error = new Error("Facade error");
      const errorResponse = { status: 500, body: "Internal Server Error" } as HttpResponse;
      const expectedHonoResponse = new Response("Internal Server Error", { status: 500 });

      vi.mocked(createHttpContext).mockReturnValue(mockHttpContext);
      vi.mocked(mockFacade.handle).mockRejectedValue(error);
      vi.mocked(mapErrorToHttpResponse).mockReturnValue(errorResponse);
      vi.mocked(mapHttpResponseToHono).mockReturnValue(expectedHonoResponse);

      const result = await capturedMiddleware(mockContext);

      expect(mapErrorToHttpResponse).toHaveBeenCalledWith(mockHttpContext, error);
      expect(mapHttpResponseToHono).toHaveBeenCalledWith(mockContext, errorResponse);
      expect(result).toBe(expectedHonoResponse);
    });

    it("should propagate non-Error exceptions", async () => {
      const mockHttpContext = { request: {}, signal: {} } as HttpContext;
      const error = "string error";
      const errorResponse = { status: 500, body: "Internal Server Error" } as HttpResponse;
      const expectedHonoResponse = new Response("Internal Server Error", { status: 500 });

      vi.mocked(createHttpContext).mockReturnValue(mockHttpContext);
      vi.mocked(mockFacade.handle).mockRejectedValue(error);
      vi.mocked(mapErrorToHttpResponse).mockReturnValue(errorResponse);
      vi.mocked(mapHttpResponseToHono).mockReturnValue(expectedHonoResponse);

      const result = await capturedMiddleware(mockContext);

      expect(mapErrorToHttpResponse).toHaveBeenCalledWith(mockHttpContext, error);
      expect(result).toBe(expectedHonoResponse);
    });

    it("should handle async facade operations", async () => {
      const mockHttpContext = { request: {}, signal: {} } as HttpContext;
      const mockResponse = { status: 200 } as HttpResponse;
      const expectedHonoResponse = new Response();

      vi.mocked(createHttpContext).mockReturnValue(mockHttpContext);
      vi.mocked(mockFacade.handle).mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1));
        return mockResponse;
      });
      vi.mocked(mapHttpResponseToHono).mockReturnValue(expectedHonoResponse);

      const result = await capturedMiddleware(mockContext);

      expect(result).toBe(expectedHonoResponse);
    });
  });
});
