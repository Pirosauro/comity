import type { HttpContext, HttpResponse } from "@comity/http";

import { describe, expect, it, vi } from "vitest";
import { createRouterHttpHandler } from "../create-route-handler.js";

describe("createRouterHttpHandler", () => {
  it("should return an HTTP handler function", () => {
    const mockRouter = {
      match: vi.fn(),
    };
    const handler = createRouterHttpHandler(mockRouter);

    expect(typeof handler).toBe("function");
  });

  it("should call router.match with correct context", async () => {
    const mockRouter = {
      match: vi.fn().mockResolvedValue(null),
    };
    const handler = createRouterHttpHandler(mockRouter);

    const mockContext = {
      request: {
        id: "test-id",
        method: "GET",
        url: new URL("http://example.com/test"),
        headers: {},
        params: {},
        cookies: {},
        rawBody: null,
      },
      signal: {} as any,
      state: {},
    } as HttpContext;

    await handler(mockContext);

    expect(mockRouter.match).toHaveBeenCalledWith({
      http: mockContext,
      url: mockContext.request.url,
    });
  });

  it("should return 404 response when no route matches", async () => {
    const mockRouter = {
      match: vi.fn().mockResolvedValue(null),
    };
    const handler = createRouterHttpHandler(mockRouter);

    const mockContext = {
      request: {
        id: "test-id",
        method: "GET",
        url: new URL("http://example.com/test"),
        headers: {},
        params: {},
        cookies: {},
        rawBody: null,
      },
      signal: {} as any,
      state: {},
    } as HttpContext;
    const result = await handler(mockContext);

    expect(result).toEqual({
      status: 404,
      body: "Not Found",
    });
  });

  it("should call matched route handler when route matches", async () => {
    const mockRouteHandler = vi.fn().mockResolvedValue({
      status: 200,
      body: "OK",
    } as HttpResponse);
    const mockRouter = {
      match: vi.fn().mockResolvedValue({
        route: {
          handler: mockRouteHandler,
        },
      }),
    };
    const handler = createRouterHttpHandler(mockRouter);
    const mockContext = {
      request: {
        id: "test-id",
        method: "GET",
        url: new URL("http://example.com/test"),
        headers: {},
        params: {},
        cookies: {},
        rawBody: null,
      },
      signal: {} as any,
      state: {},
    } as HttpContext;
    const result = await handler(mockContext);

    expect(mockRouteHandler).toHaveBeenCalledWith(mockContext);
    expect(result).toEqual({
      status: 200,
      body: "OK",
    });
  });

  it("should handle different HTTP methods", async () => {
    const mockRouteHandler = vi.fn().mockResolvedValue({
      status: 200,
      body: "OK",
    } as HttpResponse);
    const mockRouter = {
      match: vi.fn().mockResolvedValue({
        route: {
          handler: mockRouteHandler,
        },
      }),
    };
    const handler = createRouterHttpHandler(mockRouter);
    const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];

    for (const method of methods) {
      const mockContext = {
        request: {
          id: "test-id",
          method,
          url: new URL("http://example.com/test"),
          headers: {},
          params: {},
          cookies: {},
          rawBody: null,
        },
        signal: {} as any,
        state: {},
      } as HttpContext;

      await handler(mockContext);

      expect(mockRouter.match).toHaveBeenCalledWith({
        http: mockContext,
        url: mockContext.request.url,
      });
    }
  });

  it("should handle routes with different paths", async () => {
    const mockRouteHandler = vi.fn().mockResolvedValue({
      status: 200,
      body: "OK",
    } as HttpResponse);
    const mockRouter = {
      match: vi.fn().mockResolvedValue({
        route: {
          handler: mockRouteHandler,
        },
      }),
    };
    const handler = createRouterHttpHandler(mockRouter);
    const paths = ["/", "/api", "/api/users", "/api/users/123"];

    for (const path of paths) {
      const mockContext = {
        request: {
          id: "test-id",
          method: "GET",
          url: new URL(`http://example.com${path}`),
          headers: {},
          params: {},
          cookies: {},
          rawBody: null,
        },
        signal: {} as any,
        state: {},
      } as HttpContext;

      await handler(mockContext);

      expect(mockRouter.match).toHaveBeenCalledWith({
        http: mockContext,
        url: mockContext.request.url,
      });
    }
  });
});
