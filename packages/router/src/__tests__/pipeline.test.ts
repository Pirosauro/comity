import type { HttpContext } from "@comity/http";

import { describe, expect, it, vi } from "vitest";
import { RouterPipeline } from "../pipeline.js";

describe("RouterPipeline", () => {
  describe("constructor", () => {
    it("should create pipeline with empty arrays when no arguments provided", () => {
      const pipeline = new RouterPipeline([], [], {});

      expect(pipeline).toBeInstanceOf(RouterPipeline);
    });

    it("should store routers, rewriters, and policies", () => {
      const mockRouter = { match: vi.fn() };
      const mockRewriter = { rewrite: vi.fn() };
      const mockPolicy = vi.fn();
      const pipeline = new RouterPipeline([mockRouter], [mockRewriter], {
        testPolicy: mockPolicy,
      });

      expect(pipeline).toBeInstanceOf(RouterPipeline);
    });
  });

  describe("match", () => {
    it("should return null when no routers provided", async () => {
      const pipeline = new RouterPipeline([], [], {});
      const ctx = {
        http: {} as HttpContext,
        url: new URL("http://example.com/"),
      };
      const result = await pipeline.match(ctx);

      expect(result).toBeNull();
    });

    it("should apply URL rewriters before route matching", async () => {
      const mockRewriter = {
        rewrite: vi.fn().mockReturnValue(new URL("http://example.com/rewritten")),
      };
      const mockRouter = {
        match: vi.fn().mockResolvedValue(null),
      };
      const pipeline = new RouterPipeline([mockRouter], [mockRewriter], {});
      const ctx = {
        http: {} as HttpContext,
        url: new URL("http://example.com/original"),
      };

      await pipeline.match(ctx);

      expect(mockRewriter.rewrite).toHaveBeenCalledWith(
        new URL("http://example.com/original"),
        ctx.http
      );
      expect(mockRouter.match).toHaveBeenCalledWith({
        http: ctx.http,
        url: new URL("http://example.com/rewritten"),
      });
    });

    it("should not modify context URL when rewriter returns null", async () => {
      const mockRewriter = {
        rewrite: vi.fn().mockReturnValue(null),
      };
      const mockRouter = {
        match: vi.fn().mockResolvedValue(null),
      };
      const pipeline = new RouterPipeline([mockRouter], [mockRewriter], {});
      const originalUrl = new URL("http://example.com/original");
      const ctx = {
        http: {} as HttpContext,
        url: originalUrl,
      };

      await pipeline.match(ctx);

      expect(mockRouter.match).toHaveBeenCalledWith({
        http: ctx.http,
        url: originalUrl,
      });
    });

    it("should apply multiple rewriters in order", async () => {
      const rewriter1 = {
        rewrite: vi.fn().mockReturnValue(new URL("http://example.com/step1")),
      };
      const rewriter2 = {
        rewrite: vi.fn().mockReturnValue(new URL("http://example.com/step2")),
      };
      const mockRouter = {
        match: vi.fn().mockResolvedValue(null),
      };
      const pipeline = new RouterPipeline([mockRouter], [rewriter1, rewriter2], {});
      const ctx = {
        http: {} as HttpContext,
        url: new URL("http://example.com/original"),
      };

      await pipeline.match(ctx);

      expect(rewriter1.rewrite).toHaveBeenCalledWith(
        new URL("http://example.com/original"),
        ctx.http
      );
      expect(rewriter2.rewrite).toHaveBeenCalledWith(new URL("http://example.com/step1"), ctx.http);
      expect(mockRouter.match).toHaveBeenCalledWith({
        http: ctx.http,
        url: new URL("http://example.com/step2"),
      });
    });

    it("should return first successful router match", async () => {
      const router1 = {
        match: vi.fn().mockResolvedValue(null),
      };
      const router2 = {
        match: vi.fn().mockResolvedValue({
          route: { handler: vi.fn() },
          params: { id: "123" },
        }),
      };
      const router3 = {
        match: vi.fn().mockResolvedValue({
          route: { handler: vi.fn() },
          params: { id: "456" },
        }),
      };
      const pipeline = new RouterPipeline([router1, router2, router3], [], {});
      const ctx = {
        http: {} as HttpContext,
        url: new URL("http://example.com/"),
      };
      const result = await pipeline.match(ctx);

      expect(router1.match).toHaveBeenCalled();
      expect(router2.match).toHaveBeenCalled();
      expect(router3.match).not.toHaveBeenCalled();
      expect(result).toEqual({
        route: { handler: expect.any(Function) },
        params: { id: "123" },
      });
    });

    it("should apply policies to matched route", async () => {
      const mockPolicy = vi.fn().mockResolvedValue(undefined);
      const mockRouter = {
        match: vi.fn().mockResolvedValue({
          route: {
            handler: vi.fn(),
            policies: { testPolicy: "config" },
          },
        }),
      };
      const pipeline = new RouterPipeline([mockRouter], [], {
        testPolicy: mockPolicy,
      });
      const ctx = {
        http: {} as HttpContext,
        url: new URL("http://example.com/"),
      };
      const result = await pipeline.match(ctx);

      expect(mockPolicy).toHaveBeenCalledWith(ctx.http, result, "config");
    });

    it("should not apply policies when route has no policies", async () => {
      const mockPolicy = vi.fn();
      const mockRouter = {
        match: vi.fn().mockResolvedValue({
          route: {
            handler: vi.fn(),
          },
        }),
      };
      const pipeline = new RouterPipeline([mockRouter], [], {
        testPolicy: mockPolicy,
      });
      const ctx = {
        http: {} as HttpContext,
        url: new URL("http://example.com/"),
      };

      await pipeline.match(ctx);

      expect(mockPolicy).not.toHaveBeenCalled();
    });

    it("should skip unknown policies", async () => {
      const mockRouter = {
        match: vi.fn().mockResolvedValue({
          route: {
            handler: vi.fn(),
            policies: { unknownPolicy: "config" },
          },
        }),
      };
      const pipeline = new RouterPipeline([mockRouter], [], {});
      const ctx = {
        http: {} as HttpContext,
        url: new URL("http://example.com/"),
      };
      const result = await pipeline.match(ctx);

      expect(result).toBeDefined();
    });

    it("should handle multiple policies on a route", async () => {
      const policy1 = vi.fn().mockResolvedValue(undefined);
      const policy2 = vi.fn().mockResolvedValue(undefined);
      const mockRouter = {
        match: vi.fn().mockResolvedValue({
          route: {
            handler: vi.fn(),
            policies: { policy1: "config1", policy2: "config2" },
          },
        }),
      };
      const pipeline = new RouterPipeline([mockRouter], [], {
        policy1,
        policy2,
      });
      const ctx = {
        http: {} as HttpContext,
        url: new URL("http://example.com/"),
      };

      const result = await pipeline.match(ctx);

      expect(policy1).toHaveBeenCalledWith(ctx.http, result, "config1");
      expect(policy2).toHaveBeenCalledWith(ctx.http, result, "config2");
    });

    it("should return null when no routers match", async () => {
      const router1 = {
        match: vi.fn().mockResolvedValue(null),
      };
      const router2 = {
        match: vi.fn().mockResolvedValue(null),
      };
      const pipeline = new RouterPipeline([router1, router2], [], {});
      const ctx = {
        http: {} as HttpContext,
        url: new URL("http://example.com/"),
      };

      const result = await pipeline.match(ctx);

      expect(result).toBeNull();
    });
  });
});
