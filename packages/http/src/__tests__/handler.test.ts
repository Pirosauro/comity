import type { HttpContext } from "../contracts/context.js";
import type { HttpRequest } from "../contracts/request.js";
import type { HttpResponse } from "../contracts/response.js";

import { describe, expect, it, vi } from "vitest";
import { HttpError } from "../errors/http.js";
import { createHttpHandler } from "../handler.js";

function createContext(): HttpContext {
  const request: HttpRequest = {
    id: "req-1",
    method: "GET",
    url: new URL("https://example.com/"),
    headers: {},
    params: {},
    cookies: {},
  };

  return {
    request,
    signal: new AbortController().signal,
    state: {},
    services: { resolve: vi.fn() },
    events: {},
  } as unknown as HttpContext;
}

function response(status = 200): HttpResponse {
  return { status };
}

describe("createHttpHandler", () => {
  it("should invoke the handler directly without middleware", async () => {
    const handler = vi.fn().mockResolvedValue(response(200));
    const httpHandler = createHttpHandler([], handler);
    const ctx = createContext();

    await expect(httpHandler(ctx)).resolves.toEqual({ status: 200 });
    expect(handler).toHaveBeenCalledWith(ctx);
  });

  it("should execute middleware in order", async () => {
    const calls: string[] = [];
    const middleware = [
      vi.fn().mockImplementation(async (_ctx, next) => {
        calls.push("m1");
        return next();
      }),
      vi.fn().mockImplementation(async (_ctx, next) => {
        calls.push("m2");
        return next();
      }),
    ];
    const handler = vi.fn().mockImplementation(async () => {
      calls.push("handler");
      return response(200);
    });
    const httpHandler = createHttpHandler(middleware, handler);

    await expect(httpHandler(createContext())).resolves.toEqual({ status: 200 });
    expect(calls).toEqual(["m1", "m2", "handler"]);
  });

  it("should allow middleware to short-circuit the pipeline", async () => {
    const middleware = [
      vi.fn().mockResolvedValue(response(401)),
      vi.fn().mockResolvedValue(response(200)),
    ];
    const handler = vi.fn().mockResolvedValue(response(200));
    const httpHandler = createHttpHandler(middleware, handler);

    await expect(httpHandler(createContext())).resolves.toEqual({ status: 401 });
    expect(handler).not.toHaveBeenCalled();
  });

  it("should allow middleware to modify the response from next", async () => {
    const middleware = [
      vi.fn().mockImplementation(async (_ctx, next) => {
        const res = await next();
        return { ...res, headers: { "x-mw": "true" } };
      }),
    ];
    const handler = vi.fn().mockResolvedValue(response(200));
    const httpHandler = createHttpHandler(middleware, handler);

    const res = await httpHandler(createContext());

    expect(res).toEqual({ status: 200, headers: { "x-mw": "true" } });
  });

  it("should reject when next is called multiple times", async () => {
    const middleware = [
      vi.fn().mockImplementation(async (_ctx, next) => {
        await next();
        return next();
      }),
    ];
    const handler = vi.fn().mockResolvedValue(response(200));
    const httpHandler = createHttpHandler(middleware, handler);

    await expect(httpHandler(createContext())).rejects.toBeInstanceOf(HttpError);
    await expect(httpHandler(createContext())).rejects.toMatchObject({
      code: "http:pipeline_contract_violation",
    });
  });

  it("should propagate errors thrown by middleware", async () => {
    const error = new Error("middleware boom");
    const middleware = [vi.fn().mockRejectedValue(error)];
    const handler = vi.fn();
    const httpHandler = createHttpHandler(middleware, handler);

    await expect(httpHandler(createContext())).rejects.toBe(error);
  });

  it("should propagate errors thrown by the handler", async () => {
    const error = new Error("handler boom");
    const httpHandler = createHttpHandler([], vi.fn().mockRejectedValue(error));

    await expect(httpHandler(createContext())).rejects.toBe(error);
  });
});