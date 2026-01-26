import { describe, it, expect, beforeEach } from "vitest";
import { Hono } from "hono";
import type { Context as HonoContext } from "hono";
import { createHonoHandler } from "../adapter/hono-handler.js";
import type { HttpFacade, HttpContext, HttpResult } from "@comity/http";

/**
 * Mock HttpFacade for testing
 */
class MockHttpFacade implements HttpFacade {
  private handler?: (ctx: HttpContext) => Promise<HttpResult>;

  use(...middleware: readonly any[]): void {
    // Not used in these tests
  }

  setHandler(handler: (ctx: HttpContext) => Promise<HttpResult>): void {
    this.handler = handler;
  }

  async handle(ctx: HttpContext): Promise<HttpResult> {
    if (!this.handler) {
      throw new Error("No handler set");
    }
    return this.handler(ctx);
  }
}

describe("createHonoHandler", () => {
  let facade: MockHttpFacade;

  beforeEach(() => {
    facade = new MockHttpFacade();
  });

  it("should handle successful responses", async () => {
    facade.setHandler(async (ctx) => ({
      ok: true,
      response: {
        status: 200,
        body: { message: "Hello, World!" },
      },
    }));

    const app = new Hono();
    app.get("/test", createHonoHandler({ facade }));

    const res = await app.request("/test");

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: "Hello, World!" });
    expect(res.headers.get("content-type")).toContain("application/json");
  });

  it("should handle error responses", async () => {
    facade.setHandler(async (ctx) => ({
      ok: false,
      error: {
        code: "test:error",
        status: 400,
        message: "Bad request",
        details: { field: "email" },
      },
    }));

    const app = new Hono();
    app.get("/test", createHonoHandler({ facade }));

    const res = await app.request("/test");

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      code: "test:error",
      message: "Bad request",
      details: { field: "email" },
    });
  });

  it("should handle string responses", async () => {
    facade.setHandler(async (ctx) => ({
      ok: true,
      response: {
        status: 200,
        body: "Plain text response",
      },
    }));

    const app = new Hono();
    app.get("/test", createHonoHandler({ facade }));

    const res = await app.request("/test");

    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Plain text response");
    expect(res.headers.get("content-type")).toContain("text/plain");
  });

  it("should handle empty responses", async () => {
    facade.setHandler(async (ctx) => ({
      ok: true,
      response: {
        status: 204,
      },
    }));

    const app = new Hono();
    app.get("/test", createHonoHandler({ facade }));

    const res = await app.request("/test");

    expect(res.status).toBe(204);
  });

  it("should handle custom headers", async () => {
    facade.setHandler(async (ctx) => ({
      ok: true,
      response: {
        status: 200,
        headers: {
          "x-custom-header": "custom-value",
        },
        body: "test",
      },
    }));

    const app = new Hono();
    app.get("/test", createHonoHandler({ facade }));

    const res = await app.request("/test");

    expect(res.headers.get("x-custom-header")).toBe("custom-value");
  });

  it("should handle exceptions from facade", async () => {
    facade.setHandler(async (ctx) => {
      throw new Error("Unexpected error");
    });

    const app = new Hono();
    app.get("/test", createHonoHandler({ facade }));

    const res = await app.request("/test");

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({
      code: "http:internal",
      message: "Internal server error",
    });
  });

  it("should extract query parameters", async () => {
    let capturedCtx: HttpContext | undefined;

    facade.setHandler(async (ctx) => {
      capturedCtx = ctx;
      return {
        ok: true,
        response: { status: 200 },
      };
    });

    const app = new Hono();
    app.get("/test", createHonoHandler({ facade }));

    await app.request("/test?foo=bar&baz=qux");

    expect(capturedCtx?.request.query).toEqual({
      foo: "bar",
      baz: "qux",
    });
  });

  it("should extract path parameters", async () => {
    let capturedCtx: HttpContext | undefined;

    facade.setHandler(async (ctx) => {
      capturedCtx = ctx;
      return {
        ok: true,
        response: { status: 200 },
      };
    });

    const app = new Hono();
    app.get("/users/:id", createHonoHandler({ facade }));

    await app.request("/users/123");

    expect(capturedCtx?.request.params).toEqual({
      id: "123",
    });
  });

  it("should extract headers", async () => {
    let capturedCtx: HttpContext | undefined;

    facade.setHandler(async (ctx) => {
      capturedCtx = ctx;
      return {
        ok: true,
        response: { status: 200 },
      };
    });

    const app = new Hono();
    app.get("/test", createHonoHandler({ facade }));

    await app.request("/test", {
      headers: {
        "X-Custom-Header": "custom-value",
      },
    });

    expect(capturedCtx?.request.headers["x-custom-header"]).toBe(
      "custom-value",
    );
  });

  it("should provide request ID", async () => {
    let capturedCtx: HttpContext | undefined;

    facade.setHandler(async (ctx) => {
      capturedCtx = ctx;
      return {
        ok: true,
        response: { status: 200 },
      };
    });

    const app = new Hono();
    app.get("/test", createHonoHandler({ facade }));

    await app.request("/test");

    expect(capturedCtx?.request.id).toBeDefined();
    expect(typeof capturedCtx?.request.id).toBe("string");
  });

  it("should provide mutable state", async () => {
    facade.setHandler(async (ctx) => {
      ctx.state.set("test", "value");
      expect(ctx.state.get("test")).toBe("value");
      expect(ctx.state.has("test")).toBe(true);

      return {
        ok: true,
        response: { status: 200 },
      };
    });

    const app = new Hono();
    app.get("/test", createHonoHandler({ facade }));

    await app.request("/test");
  });

  it("should guard against double response setting", async () => {
    facade.setHandler(async (ctx) => {
      ctx.setResponse({
        ok: true,
        response: { status: 200 },
      });

      expect(() => {
        ctx.setResponse({
          ok: true,
          response: { status: 200 },
        });
      }).toThrow("Response already set");

      return ctx.response!;
    });

    const app = new Hono();
    app.get("/test", createHonoHandler({ facade }));

    await app.request("/test");
  });

  it("should handle different HTTP methods", async () => {
    let capturedMethod: string | undefined;

    facade.setHandler(async (ctx) => {
      capturedMethod = ctx.request.method;
      return {
        ok: true,
        response: { status: 200 },
      };
    });

    const app = new Hono();
    app.post("/test", createHonoHandler({ facade }));

    await app.request("/test", { method: "POST" });

    expect(capturedMethod).toBe("POST");
  });
});
