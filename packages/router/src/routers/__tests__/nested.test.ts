import type { HttpContext } from "@comity/http";

import { describe, expect, it, vi } from "vitest";
import { NestedRouter } from "../nested.js";

describe("NestedRouter", () => {
  describe("constructor", () => {
    it("should create router with empty routes array", () => {
      const router = new NestedRouter([]);

      expect(router).toBeInstanceOf(NestedRouter);
    });

    it("should store nested routes", () => {
      const mockRouter = { match: vi.fn() };
      const routes = [
        { prefix: "/api", router: mockRouter },
        { prefix: "/admin", router: mockRouter },
      ];
      const router = new NestedRouter(routes);

      expect(router).toBeInstanceOf(NestedRouter);
    });
  });

  describe("match", () => {
    it("should return null when no nested routes provided", async () => {
      const router = new NestedRouter([]);
      const ctx = {
        http: {} as HttpContext,
        url: new URL("http://example.com/"),
      };
      const result = await router.match(ctx);

      expect(result).toBeNull();
    });

    it("should match route with exact prefix", async () => {
      const mockRouter = {
        match: vi.fn().mockResolvedValue({
          route: { handler: vi.fn() },
        }),
      };
      const nestedRouter = new NestedRouter([{ prefix: "/api", router: mockRouter }]);
      const ctx = {
        http: {} as HttpContext,
        url: new URL("http://example.com/api/users"),
      };
      const result = await nestedRouter.match(ctx);

      expect(mockRouter.match).toHaveBeenCalledWith({
        http: ctx.http,
        url: new URL("http://example.com/users"),
      });
      expect(result).toBeDefined();
    });

    it("should not match when prefix does not match", async () => {
      const mockRouter = {
        match: vi.fn().mockResolvedValue({
          route: { handler: vi.fn() },
        }),
      };
      const nestedRouter = new NestedRouter([{ prefix: "/api", router: mockRouter }]);
      const ctx = {
        http: {} as HttpContext,
        url: new URL("http://example.com/other/path"),
      };
      const result = await nestedRouter.match(ctx);

      expect(mockRouter.match).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it("should handle prefix with trailing slash", async () => {
      const mockRouter = {
        match: vi.fn().mockResolvedValue({
          route: { handler: vi.fn() },
        }),
      };
      const nestedRouter = new NestedRouter([{ prefix: "/api/", router: mockRouter }]);
      const ctx = {
        http: {} as HttpContext,
        url: new URL("http://example.com/api/users"),
      };

      await nestedRouter.match(ctx);

      expect(mockRouter.match).toHaveBeenCalledWith({
        http: ctx.http,
        url: new URL("http://example.com/users"),
      });
    });

    it("should handle root prefix", async () => {
      const mockRouter = {
        match: vi.fn().mockResolvedValue({
          route: { handler: vi.fn() },
        }),
      };
      const nestedRouter = new NestedRouter([{ prefix: "/", router: mockRouter }]);
      const ctx = {
        http: {} as HttpContext,
        url: new URL("http://example.com/any/path"),
      };

      await nestedRouter.match(ctx);

      expect(mockRouter.match).toHaveBeenCalledWith({
        http: ctx.http,
        url: new URL("http://example.com/any/path"),
      });
    });

    it("should handle exact prefix match", async () => {
      const mockRouter = {
        match: vi.fn().mockResolvedValue({
          route: { handler: vi.fn() },
        }),
      };
      const nestedRouter = new NestedRouter([{ prefix: "/api", router: mockRouter }]);
      const ctx = {
        http: {} as HttpContext,
        url: new URL("http://example.com/api"),
      };

      await nestedRouter.match(ctx);

      expect(mockRouter.match).toHaveBeenCalledWith({
        http: ctx.http,
        url: new URL("http://example.com/"),
      });
    });

    it("should handle nested prefixes", async () => {
      const apiRouter = {
        match: vi.fn().mockResolvedValue({
          route: { handler: vi.fn() },
        }),
      };
      const adminRouter = {
        match: vi.fn().mockResolvedValue(null),
      };
      const nestedRouter = new NestedRouter([
        { prefix: "/api", router: apiRouter },
        { prefix: "/admin", router: adminRouter },
      ]);
      const apiCtx = {
        http: {} as HttpContext,
        url: new URL("http://example.com/api/users"),
      };
      const adminCtx = {
        http: {} as HttpContext,
        url: new URL("http://example.com/admin/users"),
      };
      const apiResult = await nestedRouter.match(apiCtx);
      const adminResult = await nestedRouter.match(adminCtx);

      expect(apiResult).toBeDefined();
      expect(adminResult).toBeNull();
    });

    it("should return first matching nested route", async () => {
      const router1 = {
        match: vi.fn().mockResolvedValue({
          route: { handler: vi.fn() },
        }),
      };
      const router2 = {
        match: vi.fn().mockResolvedValue({
          route: { handler: vi.fn() },
        }),
      };
      const nestedRouter = new NestedRouter([
        { prefix: "/api", router: router1 },
        { prefix: "/api", router: router2 },
      ]);
      const ctx = {
        http: {} as HttpContext,
        url: new URL("http://example.com/api/test"),
      };
      const result = await nestedRouter.match(ctx);

      expect(router1.match).toHaveBeenCalled();
      expect(router2.match).not.toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it("should handle URL with query parameters", async () => {
      const mockRouter = {
        match: vi.fn().mockResolvedValue({
          route: { handler: vi.fn() },
        }),
      };
      const nestedRouter = new NestedRouter([{ prefix: "/api", router: mockRouter }]);
      const ctx = {
        http: {} as HttpContext,
        url: new URL("http://example.com/api/users?id=123"),
      };

      await nestedRouter.match(ctx);

      const expectedUrl = new URL("http://example.com/users?id=123");

      expect(mockRouter.match).toHaveBeenCalledWith({
        http: ctx.http,
        url: expectedUrl,
      });
    });

    it("should handle URL with hash", async () => {
      const mockRouter = {
        match: vi.fn().mockResolvedValue({
          route: { handler: vi.fn() },
        }),
      };
      const nestedRouter = new NestedRouter([{ prefix: "/api", router: mockRouter }]);
      const ctx = {
        http: {} as HttpContext,
        url: new URL("http://example.com/api/page#section"),
      };

      await nestedRouter.match(ctx);

      const expectedUrl = new URL("http://example.com/page#section");

      expect(mockRouter.match).toHaveBeenCalledWith({
        http: ctx.http,
        url: expectedUrl,
      });
    });
  });
});

describe("NestedRoute interface", () => {
  it("should allow creating nested route object", () => {
    const mockRouter = { match: vi.fn() };
    const nestedRoute = {
      prefix: "/api",
      router: mockRouter,
    };

    expect(nestedRoute.prefix).toBe("/api");
    expect(nestedRoute.router).toBe(mockRouter);
  });
});
