import { describe, expect, it, vi } from "vitest";
import { HttpMiddlewareContractViolationError } from "../../errors/middleware-contract-violation.js";
import { DefaultHttpPipeline } from "../pipeline.js";

describe("DefaultHttpPipeline", () => {
  describe("execute", () => {
    it("should execute single middleware", async () => {
      const middleware = vi.fn(async (ctx, next) => {
        await next();
      });

      const pipeline = new DefaultHttpPipeline([middleware]);
      const ctx = {} as any;

      await pipeline.execute(ctx);

      expect(middleware).toHaveBeenCalledWith(ctx, expect.any(Function));
    });

    it("should execute middleware in order", async () => {
      const order: string[] = [];

      const middleware1 = vi.fn(async (ctx, next) => {
        order.push("m1-before");
        await next();
        order.push("m1-after");
      });

      const middleware2 = vi.fn(async (ctx, next) => {
        order.push("m2-before");
        await next();
        order.push("m2-after");
      });

      const middleware3 = vi.fn(async (ctx, next) => {
        order.push("m3-before");
        await next();
        order.push("m3-after");
      });

      const pipeline = new DefaultHttpPipeline([middleware1, middleware2, middleware3]);
      const ctx = {} as any;

      await pipeline.execute(ctx);

      expect(order).toEqual([
        "m1-before",
        "m2-before",
        "m3-before",
        "m3-after",
        "m2-after",
        "m1-after",
      ]);
    });

    it("should execute with empty middleware array", async () => {
      const pipeline = new DefaultHttpPipeline([]);
      const ctx = {} as any;

      await expect(pipeline.execute(ctx)).resolves.toBeUndefined();
    });

    it("should handle synchronous middleware", async () => {
      const middleware = vi.fn((ctx, next) => {
        // Synchronous
        next();
      });

      const pipeline = new DefaultHttpPipeline([middleware]);
      const ctx = {} as any;

      await pipeline.execute(ctx);

      expect(middleware).toHaveBeenCalled();
    });

    it("should handle asynchronous middleware", async () => {
      const middleware = vi.fn(async (ctx, next) => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        await next();
      });

      const pipeline = new DefaultHttpPipeline([middleware]);
      const ctx = {} as any;

      await pipeline.execute(ctx);

      expect(middleware).toHaveBeenCalled();
    });

    it("should pass context through middleware chain", async () => {
      const contexts: any[] = [];

      const middleware1 = async (ctx: any, next) => {
        contexts.push(ctx);
        await next();
      };

      const middleware2 = async (ctx: any, next) => {
        contexts.push(ctx);
        await next();
      };

      const pipeline = new DefaultHttpPipeline([middleware1, middleware2]);
      const ctx = { id: "test-ctx" } as any;

      await pipeline.execute(ctx);

      expect(contexts).toHaveLength(2);
      expect(contexts[0]).toBe(ctx);
      expect(contexts[1]).toBe(ctx);
    });

    it("should throw when next is called twice in same middleware", async () => {
      const middleware = async (ctx, next) => {
        await next();
        await next(); // Call next twice - should throw
      };

      const pipeline = new DefaultHttpPipeline([middleware]);
      const ctx = {} as any;

      await expect(pipeline.execute(ctx)).rejects.toThrow(HttpMiddlewareContractViolationError);
    });

    it("should throw with correct message when next called multiple times", async () => {
      const middleware = async (ctx, next) => {
        await next();
        await next();
      };

      const pipeline = new DefaultHttpPipeline([middleware]);
      const ctx = {} as any;

      await expect(pipeline.execute(ctx)).rejects.toThrow(
        "HttpMiddleware.next() called multiple times"
      );
    });

    it("should handle middleware that calls next after async work", async () => {
      const order: string[] = [];

      const middleware1 = async (ctx, next) => {
        order.push("m1-start");
        await new Promise((resolve) => setTimeout(resolve, 5));
        await next();
        order.push("m1-end");
      };

      const middleware2 = async (ctx, next) => {
        order.push("m2-start");
        await next();
        order.push("m2-end");
      };

      const pipeline = new DefaultHttpPipeline([middleware1, middleware2]);
      const ctx = {} as any;

      await pipeline.execute(ctx);

      expect(order).toEqual(["m1-start", "m2-start", "m2-end", "m1-end"]);
    });

    it("should handle middleware that skips calling next", async () => {
      const middleware1 = vi.fn(async (ctx, next) => {
        // Don't call next
      });

      const middleware2 = vi.fn(async (ctx, next) => {
        // Should not be called
        await next();
      });

      const pipeline = new DefaultHttpPipeline([middleware1, middleware2]);
      const ctx = {} as any;

      await pipeline.execute(ctx);

      expect(middleware1).toHaveBeenCalled();
      expect(middleware2).not.toHaveBeenCalled();
    });

    it("should handle errors thrown in middleware", async () => {
      const middleware1 = async (ctx, next) => {
        throw new Error("Middleware error");
      };

      const pipeline = new DefaultHttpPipeline([middleware1]);
      const ctx = {} as any;

      await expect(pipeline.execute(ctx)).rejects.toThrow("Middleware error");
    });

    it("should propagate errors through middleware chain", async () => {
      const middleware1 = async (ctx, next) => {
        try {
          await next();
        } catch (e) {
          // Catch and re-throw
          throw e;
        }
      };

      const middleware2 = async (ctx, next) => {
        throw new Error("Inner error");
      };

      const pipeline = new DefaultHttpPipeline([middleware1, middleware2]);
      const ctx = {} as any;

      await expect(pipeline.execute(ctx)).rejects.toThrow("Inner error");
    });

    it("should handle error recovery in middleware", async () => {
      const order: string[] = [];

      const middleware1 = async (ctx, next) => {
        try {
          await next();
        } catch (e) {
          order.push("caught");
        }
      };

      const middleware2 = async (ctx, next) => {
        throw new Error("Error");
      };

      const pipeline = new DefaultHttpPipeline([middleware1, middleware2]);
      const ctx = {} as any;

      await expect(pipeline.execute(ctx)).resolves.toBeUndefined();
      expect(order).toContain("caught");
    });

    it("should handle large middleware chains", async () => {
      const count = 100;
      const middlewares = Array.from({ length: count }, () =>
        vi.fn(async (ctx, next) => await next())
      );

      const pipeline = new DefaultHttpPipeline(middlewares);
      const ctx = {} as any;

      await pipeline.execute(ctx);

      for (const middleware of middlewares) {
        expect(middleware).toHaveBeenCalled();
      }
    });
  });
});
