import { describe, expect, it, vi } from "vitest";
import { ensureResponse } from "../ensure-response.js";

describe("ensureResponse", () => {
  it("should call next", async () => {
    const next = vi.fn(async () => {});

    const ctx = {
      response: { ok: true, response: { status: 200 } },
      setResponse: vi.fn(),
    };

    await ensureResponse(ctx as any, next);

    expect(next).toHaveBeenCalled();
  });

  it("should not change response if already set", async () => {
    const next = vi.fn(async () => {});
    const existingResponse = { ok: true, response: { status: 200 } };

    const ctx = {
      response: existingResponse,
      setResponse: vi.fn(),
    };

    await ensureResponse(ctx as any, next);

    expect(ctx.setResponse).not.toHaveBeenCalled();
  });

  it("should set 404 response if not set by middleware", async () => {
    const next = vi.fn(async () => {});

    const ctx = {
      response: undefined,
      setResponse: vi.fn(),
    };

    await ensureResponse(ctx as any, next);

    expect(ctx.setResponse).toHaveBeenCalledWith({
      ok: true,
      response: { status: 404 },
    });
  });

  it("should set default 404 with correct structure", async () => {
    const next = vi.fn(async () => {});

    const ctx = {
      response: undefined,
      setResponse: vi.fn(),
    };

    await ensureResponse(ctx as any, next);

    const call = ctx.setResponse.mock.calls[0][0];
    expect(call.ok).toBe(true);
    expect(call.response.status).toBe(404);
  });

  it("should not set response on error", async () => {
    const error = new Error("Middleware error");
    const next = vi.fn(async () => {
      throw error;
    });

    const ctx = {
      response: undefined,
      setResponse: vi.fn(),
    };

    await expect(ensureResponse(ctx as any, next)).rejects.toThrow(error);

    expect(ctx.setResponse).not.toHaveBeenCalled();
  });

  it("should work with error response", async () => {
    const next = vi.fn(async () => {});
    const errorResponse = { ok: false, error: { code: "ERROR", status: 500 } };

    const ctx = {
      response: errorResponse,
      setResponse: vi.fn(),
    };

    await ensureResponse(ctx as any, next);

    expect(ctx.setResponse).not.toHaveBeenCalled();
  });

  it("should work in middleware chain", async () => {
    const order: string[] = [];

    const ctx = {
      response: undefined,
      setResponse: vi.fn(() => {
        order.push("response-set");
      }),
    };

    const next = async () => {
      order.push("next");
    };

    await ensureResponse(ctx as any, next);

    expect(order).toEqual(["next", "response-set"]);
  });

  it("should handle async operations in next", async () => {
    const next = vi.fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    const ctx = {
      response: undefined,
      setResponse: vi.fn(),
    };

    await ensureResponse(ctx as any, next);

    expect(ctx.setResponse).toHaveBeenCalled();
  });

  it("should handle response set during next call", async () => {
    const next = vi.fn(async () => {
      // Response was set during next
    });

    const ctx: any = {
      response: undefined,
      setResponse: vi.fn((response) => {
        ctx.response = response;
      }),
    };

    // Simulate response being set during next
    next.mockImplementation(async () => {
      ctx.response = { ok: true, response: { status: 200 } };
    });

    await ensureResponse(ctx, next);

    expect(ctx.response).toEqual({ ok: true, response: { status: 200 } });
    expect(ctx.setResponse).not.toHaveBeenCalled();
  });
});
