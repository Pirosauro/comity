import type { HttpContext } from "../contracts/context.js";
import type { HttpRequest } from "../contracts/request.js";
import type { HttpResponse } from "../contracts/response.js";
import type { HttpObserver } from "../observers/observer.js";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { HttpFacade } from "../facade.js";

function createRequest(): HttpRequest {
  return {
    id: "req-1",
    method: "GET",
    url: new URL("https://example.com/products"),
    headers: {},
    params: {},
    cookies: {},
  };
}

function createContext(): HttpContext {
  return {
    request: createRequest(),
    signal: new AbortController().signal,
    state: {},
    services: { resolve: vi.fn() },
    events: {},
  } as unknown as HttpContext;
}

describe("HttpFacade", () => {
  it("should return the handler response", async () => {
    const response: HttpResponse = { status: 200, body: "ok" };
    const facade = new HttpFacade(vi.fn().mockResolvedValue(response));

    await expect(facade.handle(createContext())).resolves.toBe(response);
  });

  it("should emit onRequestStarted and onRequestCompleted", async () => {
    const observer: HttpObserver = {
      onRequestStarted: vi.fn(),
      onRequestCompleted: vi.fn(),
      onRequestFailed: vi.fn(),
    };
    const response: HttpResponse = { status: 200 };
    const handler = vi.fn().mockResolvedValue(response);
    const facade = new HttpFacade(handler, observer);
    const ctx = createContext();

    await facade.handle(ctx);

    expect(observer.onRequestStarted).toHaveBeenCalledWith(ctx.request);
    expect(observer.onRequestCompleted).toHaveBeenCalledWith(
      expect.objectContaining({ request: ctx.request, response })
    );
    expect(observer.onRequestFailed).not.toHaveBeenCalled();
  });

  it("should emit onRequestFailed and rethrow on handler error", async () => {
    const observer: HttpObserver = {
      onRequestStarted: vi.fn(),
      onRequestCompleted: vi.fn(),
      onRequestFailed: vi.fn(),
    };
    const error = new Error("boom");
    const handler = vi.fn().mockRejectedValue(error);
    const facade = new HttpFacade(handler, observer);
    const ctx = createContext();

    await expect(facade.handle(ctx)).rejects.toBe(error);

    expect(observer.onRequestFailed).toHaveBeenCalledWith(
      expect.objectContaining({
        request: ctx.request,
        error: expect.objectContaining({ code: "unknown" }),
      })
    );
    expect(observer.onRequestCompleted).not.toHaveBeenCalled();
  });

  it("should work without an observer", async () => {
    const response: HttpResponse = { status: 200 };
    const facade = new HttpFacade(vi.fn().mockResolvedValue(response));

    await expect(facade.handle(createContext())).resolves.toBe(response);
  });
});