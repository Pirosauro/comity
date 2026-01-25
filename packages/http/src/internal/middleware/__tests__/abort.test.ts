import { describe, expect, it, vi } from "vitest";
import { abortMiddleware } from "../abort.js";

describe("abortMiddleware", () => {
  it("should call next when signal is not aborted", async () => {
    const next = vi.fn(async () => {});
    const controller = new AbortController();

    const ctx = {
      signal: controller.signal,
    };

    await abortMiddleware(ctx as any, next);

    expect(next).toHaveBeenCalled();
  });

  it("should throw AbortError when signal is aborted", async () => {
    const next = vi.fn();
    const controller = new AbortController();
    controller.abort();

    const ctx = {
      signal: controller.signal,
    };

    await expect(abortMiddleware(ctx as any, next)).rejects.toThrow(DOMException);
    await expect(abortMiddleware(ctx as any, next)).rejects.toThrow("Request aborted");
  });

  it("should throw with AbortError name", async () => {
    const next = vi.fn();
    const controller = new AbortController();
    controller.abort();

    const ctx = {
      signal: controller.signal,
    };

    try {
      await abortMiddleware(ctx as any, next);
    } catch (error) {
      expect(error).toBeInstanceOf(DOMException);
      expect((error as DOMException).name).toBe("AbortError");
    }
  });

  it("should not call next when aborted", async () => {
    const next = vi.fn();
    const controller = new AbortController();
    controller.abort();

    const ctx = {
      signal: controller.signal,
    };

    try {
      await abortMiddleware(ctx as any, next);
    } catch (e) {
      // Expected
    }

    expect(next).not.toHaveBeenCalled();
  });

  it("should allow next to throw", async () => {
    const error = new Error("Next middleware error");
    const next = vi.fn(async () => {
      throw error;
    });
    const controller = new AbortController();

    const ctx = {
      signal: controller.signal,
    };

    await expect(abortMiddleware(ctx as any, next)).rejects.toThrow(error);
  });

  it("should work in middleware chain", async () => {
    const order: string[] = [];

    const ctx = {
      signal: new AbortController().signal,
    };

    const next = async () => {
      order.push("next");
    };

    await abortMiddleware(ctx as any, next);

    expect(order).toContain("next");
  });
});
