import { beforeEach, describe, expect, it, vi } from "vitest";
import { DefaultHttpFacade } from "../facade.js";

describe("DefaultHttpFacade", () => {
  let facade: DefaultHttpFacade;
  let mockEmitter: any;

  beforeEach(() => {
    mockEmitter = {
      requestStarted: vi.fn(),
      requestCompleted: vi.fn(),
      requestFailed: vi.fn(),
    };

    facade = new DefaultHttpFacade(mockEmitter);
  });

  describe("constructor", () => {
    it("should create facade with emitter", () => {
      expect(facade).toBeDefined();
    });
  });

  describe("use", () => {
    it("should register single middleware", () => {
      const middleware = vi.fn(async (ctx, next) => await next());

      facade.use(middleware);

      // Facade should accept middleware without throwing
      expect(() => facade.use(middleware)).not.toThrow();
    });

    it("should register multiple middleware at once", () => {
      const middleware1 = vi.fn(async (ctx, next) => await next());
      const middleware2 = vi.fn(async (ctx, next) => await next());

      facade.use(middleware1, middleware2);

      expect(() => facade.use(middleware1)).not.toThrow();
    });

    it("should throw when called after seal", () => {
      facade.seal();

      const middleware = vi.fn(async (ctx, next) => await next());

      expect(() => facade.use(middleware)).toThrow();
    });

    it("should throw with correct error when registering after seal", () => {
      facade.seal();
      const middleware = vi.fn(async (ctx, next) => await next());

      expect(() => facade.use(middleware)).toThrow("Invalid HTTP lifecycle state");
    });

    it("should maintain middleware order", async () => {
      const order: number[] = [];

      const m1 = async (ctx, next) => {
        order.push(1);
        await next();
      };
      const m2 = async (ctx, next) => {
        order.push(2);
        await next();
      };
      const m3 = async (ctx, next) => {
        order.push(3);
        await next();
      };

      facade.use(m1, m2, m3);

      const ctx = {
        request: { id: "req1", method: "GET", url: new URL("http://localhost") },
        signal: new AbortController().signal,
        state: { get: vi.fn(), set: vi.fn(), has: vi.fn() },
        setResponse: vi.fn(),
        response: { ok: true, response: { status: 200 } },
      };

      await facade.handle(ctx);

      expect(order).toEqual([1, 2, 3]);
    });
  });

  describe("seal", () => {
    it("should seal the facade", () => {
      facade.seal();

      expect(() => facade.use(vi.fn())).toThrow();
    });

    it("should be idempotent", () => {
      facade.seal();
      facade.seal();
      facade.seal();

      expect(() => facade.use(vi.fn())).toThrow();
    });
  });

  describe("handle", () => {
    it("should call requestStarted event", async () => {
      const middleware = async (ctx, next) => {
        ctx.setResponse({ ok: true, response: { status: 200 } });
        await next();
      };

      facade.use(middleware);

      let response: any;
      const ctx = {
        request: { id: "req1", method: "GET", url: new URL("http://localhost/api") },
        signal: new AbortController().signal,
        state: { get: vi.fn(), set: vi.fn(), has: vi.fn() },
        setResponse: vi.fn((result) => {
          response = result;
        }),
        get response() {
          return response;
        },
      };

      await facade.handle(ctx);

      expect(mockEmitter.requestStarted).toHaveBeenCalledWith({
        id: "req1",
        method: "GET",
        path: "/api",
      });
    });

    it("should call requestCompleted event on success", async () => {
      const middleware = async (ctx, next) => {
        ctx.setResponse({ ok: true, response: { status: 200 } });
        await next();
      };

      facade.use(middleware);

      let response: any;
      const ctx = {
        request: { id: "req1", method: "GET", url: new URL("http://localhost/api") },
        signal: new AbortController().signal,
        state: { get: vi.fn(), set: vi.fn(), has: vi.fn() },
        setResponse: vi.fn((result) => {
          response = result;
        }),
        get response() {
          return response;
        },
      };

      await facade.handle(ctx);

      expect(mockEmitter.requestCompleted).toHaveBeenCalledWith({
        id: "req1",
        status: 200,
        duration: expect.any(Number),
      });
    });

    it("should return success result", async () => {
      const middleware = async (ctx, next) => {
        ctx.setResponse({ ok: true, response: { status: 201 } });
        await next();
      };

      facade.use(middleware);

      let response: any;
      const ctx = {
        request: { id: "req1", method: "POST", url: new URL("http://localhost") },
        signal: new AbortController().signal,
        state: { get: vi.fn(), set: vi.fn(), has: vi.fn() },
        setResponse: vi.fn((result) => {
          response = result;
        }),
        get response() {
          return response;
        },
      };

      const result = await facade.handle(ctx);

      expect(result.ok).toBe(true);
      expect(result.response.status).toBe(201);
    });

    it("should throw when response not set", async () => {
      const middleware = async (ctx, next) => {
        // Don't set response
        await next();
      };

      facade.use(middleware);

      const ctx = {
        request: { id: "req1", method: "GET", url: new URL("http://localhost") },
        signal: new AbortController().signal,
        state: { get: vi.fn(), set: vi.fn(), has: vi.fn() },
        setResponse: vi.fn(),
        response: undefined,
      };

      await expect(facade.handle(ctx)).rejects.toThrow(
        "HTTP pipeline completed without setting a response"
      );
    });

    it("should call requestFailed event on error", async () => {
      const middleware = async (ctx, next) => {
        throw new Error("Middleware error");
      };

      facade.use(middleware);

      const ctx = {
        request: { id: "req1", method: "GET", url: new URL("http://localhost") },
        signal: new AbortController().signal,
        state: { get: vi.fn(), set: vi.fn(), has: vi.fn() },
        setResponse: vi.fn(),
        response: undefined,
      };

      try {
        await facade.handle(ctx);
      } catch (e) {
        // Expected
      }

      expect(mockEmitter.requestFailed).toHaveBeenCalledWith({
        id: "req1",
        code: expect.any(String),
        duration: expect.any(Number),
      });
    });

    it("should auto-seal before handling", async () => {
      const middleware = async (ctx, next) => {
        ctx.setResponse({ ok: true, response: { status: 200 } });
        await next();
      };

      facade.use(middleware);

      let response: any;
      const ctx = {
        request: { id: "req1", method: "GET", url: new URL("http://localhost") },
        signal: new AbortController().signal,
        state: { get: vi.fn(), set: vi.fn(), has: vi.fn() },
        setResponse: vi.fn((result) => {
          response = result;
        }),
        get response() {
          return response;
        },
      };

      const result = await facade.handle(ctx);

      expect(result.ok).toBe(true);
    });

    it("should handle error with cause", async () => {
      const middleware = async (ctx, next) => {
        const error = new Error("Wrapped error");
        throw error;
      };

      facade.use(middleware);

      const ctx = {
        request: { id: "req1", method: "GET", url: new URL("http://localhost") },
        signal: new AbortController().signal,
        state: { get: vi.fn(), set: vi.fn(), has: vi.fn() },
        setResponse: vi.fn(),
        response: undefined,
      };

      await expect(facade.handle(ctx)).rejects.toThrow();
    });

    it("should calculate duration correctly", async () => {
      let duration: number | undefined;

      const middleware = async (ctx, next) => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        ctx.setResponse({ ok: true, response: { status: 200 } });
        await next();
      };

      facade.use(middleware);

      let response: any;
      const ctx = {
        request: { id: "req1", method: "GET", url: new URL("http://localhost") },
        signal: new AbortController().signal,
        state: { get: vi.fn(), set: vi.fn(), has: vi.fn() },
        setResponse: vi.fn((result) => {
          response = result;
        }),
        get response() {
          return response;
        },
      };

      await facade.handle(ctx);

      expect(mockEmitter.requestCompleted).toHaveBeenCalled();
      duration = mockEmitter.requestCompleted.mock.calls[0][0].duration;

      expect(duration).toBeGreaterThanOrEqual(40); // At least ~50ms, allow some variation
    });

    it("should handle multiple requests", async () => {
      const middleware = async (ctx, next) => {
        ctx.setResponse({ ok: true, response: { status: 200 } });
        await next();
      };

      facade.use(middleware);

      for (let i = 0; i < 3; i++) {
        let response: any;
        const ctx = {
          request: {
            id: `req${i}`,
            method: "GET",
            url: new URL("http://localhost"),
          },
          signal: new AbortController().signal,
          state: { get: vi.fn(), set: vi.fn(), has: vi.fn() },
          setResponse: vi.fn((result) => {
            response = result;
          }),
          get response() {
            return response;
          },
        };

        await facade.handle(ctx);
      }

      expect(mockEmitter.requestStarted).toHaveBeenCalledTimes(3);
      expect(mockEmitter.requestCompleted).toHaveBeenCalledTimes(3);
    });

    it("should handle requests when already running", async () => {
      const middleware = async (ctx, next) => {
        ctx.setResponse({ ok: true, response: { status: 200 } });
        await next();
      };

      facade.use(middleware);

      let response1: any;
      const ctx1 = {
        request: { id: "req1", method: "GET", url: new URL("http://localhost") },
        signal: new AbortController().signal,
        state: { get: vi.fn(), set: vi.fn(), has: vi.fn() },
        setResponse: vi.fn((result) => {
          response1 = result;
        }),
        get response() {
          return response1;
        },
      };

      // First request
      await facade.handle(ctx1);

      // Second request without stopping
      let response2: any;
      const ctx2 = {
        request: { id: "req2", method: "GET", url: new URL("http://localhost") },
        signal: new AbortController().signal,
        state: { get: vi.fn(), set: vi.fn(), has: vi.fn() },
        setResponse: vi.fn((result) => {
          response2 = result;
        }),
        get response() {
          return response2;
        },
      };

      await facade.handle(ctx2);

      expect(mockEmitter.requestCompleted).toHaveBeenCalledTimes(2);
    });
  });
});
