import type { HttpContext } from "@comity/http";

import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "../memory.js";

describe("MemoryRouter", () => {
  describe("constructor", () => {
    it("should create router with empty routes array", () => {
      const router = new MemoryRouter([]);

      expect(router).toBeInstanceOf(MemoryRouter);
    });

    it("should store routes", () => {
      const routes = [{ handler: vi.fn() }, { method: "GET", path: "/test", handler: vi.fn() }];
      const router = new MemoryRouter(routes);

      expect(router).toBeInstanceOf(MemoryRouter);
    });
  });

  describe("match", () => {
    it("should return null when no routes provided", async () => {
      const router = new MemoryRouter([]);
      const ctx = {
        http: {
          request: { method: "GET", url: new URL("http://example.com/") },
        } as HttpContext,
        url: new URL("http://example.com/"),
      };
      const result = await router.match(ctx);

      expect(result).toBeNull();
    });

    it("should match route without method or path constraints", async () => {
      const handler = vi.fn();
      const router = new MemoryRouter([{ handler }]);

      const ctx = {
        http: {
          request: { method: "GET", url: new URL("http://example.com/") },
        } as HttpContext,
        url: new URL("http://example.com/"),
      };

      const result = await router.match(ctx);

      expect(result).toEqual({
        route: { handler },
      });
    });

    it("should match route with exact method", async () => {
      const getHandler = vi.fn();
      const postHandler = vi.fn();

      const router = new MemoryRouter([
        { method: "GET", handler: getHandler },
        { method: "POST", handler: postHandler },
      ]);

      const getCtx = {
        http: {
          request: { method: "GET", url: new URL("http://example.com/") },
        } as HttpContext,
        url: new URL("http://example.com/"),
      };
      const postCtx = {
        http: {
          request: { method: "POST", url: new URL("http://example.com/") },
        } as HttpContext,
        url: new URL("http://example.com/"),
      };

      const getResult = await router.match(getCtx);
      const postResult = await router.match(postCtx);

      expect(getResult).toEqual({ route: { method: "GET", handler: getHandler } });
      expect(postResult).toEqual({ route: { method: "POST", handler: postHandler } });
    });

    it("should not match when method does not match", async () => {
      const handler = vi.fn();
      const router = new MemoryRouter([{ method: "POST", handler }]);

      const ctx = {
        http: {
          request: { method: "GET", url: new URL("http://example.com/") },
        } as HttpContext,
        url: new URL("http://example.com/"),
      };

      const result = await router.match(ctx);

      expect(result).toBeNull();
    });

    it("should match route with exact path", async () => {
      const homeHandler = vi.fn();
      const apiHandler = vi.fn();

      const router = new MemoryRouter([
        { path: "/", handler: homeHandler },
        { path: "/api", handler: apiHandler },
      ]);

      const homeCtx = {
        http: {
          request: { method: "GET", url: new URL("http://example.com/") },
        } as HttpContext,
        url: new URL("http://example.com/"),
      };
      const apiCtx = {
        http: {
          request: { method: "GET", url: new URL("http://example.com/api") },
        } as HttpContext,
        url: new URL("http://example.com/api"),
      };
      const homeResult = await router.match(homeCtx);
      const apiResult = await router.match(apiCtx);

      expect(homeResult).toEqual({ route: { path: "/", handler: homeHandler } });
      expect(apiResult).toEqual({ route: { path: "/api", handler: apiHandler } });
    });

    it("should not match when path does not match", async () => {
      const handler = vi.fn();
      const router = new MemoryRouter([{ path: "/api", handler }]);
      const ctx = {
        http: {
          request: { method: "GET", url: new URL("http://example.com/other") },
        } as HttpContext,
        url: new URL("http://example.com/other"),
      };
      const result = await router.match(ctx);

      expect(result).toBeNull();
    });

    it("should match route with both method and path", async () => {
      const handler = vi.fn();
      const router = new MemoryRouter([{ method: "POST", path: "/api/users", handler }]);
      const ctx = {
        http: {
          request: { method: "POST", url: new URL("http://example.com/api/users") },
        } as HttpContext,
        url: new URL("http://example.com/api/users"),
      };
      const result = await router.match(ctx);

      expect(result).toEqual({
        route: { method: "POST", path: "/api/users", handler },
      });
    });

    it("should return first matching route", async () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      const router = new MemoryRouter([
        { path: "/", handler: handler1 },
        { path: "/", handler: handler2 },
      ]);
      const ctx = {
        http: {
          request: { method: "GET", url: new URL("http://example.com/") },
        } as HttpContext,
        url: new URL("http://example.com/"),
      };
      const result = await router.match(ctx);

      expect(result).toEqual({ route: { path: "/", handler: handler1 } });
    });

    it("should handle routes with additional properties", async () => {
      const handler = vi.fn();
      const router = new MemoryRouter([
        {
          method: "GET",
          path: "/test",
          handler,
          policies: { auth: true },
          meta: { description: "Test route" },
        },
      ]);
      const ctx = {
        http: {
          request: { method: "GET", url: new URL("http://example.com/test") },
        } as HttpContext,
        url: new URL("http://example.com/test"),
      };
      const result = await router.match(ctx);

      expect(result).toEqual({
        route: {
          method: "GET",
          path: "/test",
          handler,
          policies: { auth: true },
          meta: { description: "Test route" },
        },
      });
    });
  });
});
