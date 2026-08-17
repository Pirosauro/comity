import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FetchHttpClient } from "../adapter.js";
import { client } from "../client.js";
import { combineAbortSignals, getAbortReason } from "../internal/abort.js";
import { wait } from "../internal/wait.js";

const ORIGINAL_ANY = Object.getOwnPropertyDescriptor(AbortSignal, "any");

function disableAbortSignalAny() {
  Object.defineProperty(AbortSignal, "any", {
    value: undefined,
    configurable: true,
    writable: true,
  });
}

function restoreAbortSignalAny() {
  if (ORIGINAL_ANY) {
    Object.defineProperty(AbortSignal, "any", ORIGINAL_ANY);
  } else {
    delete (AbortSignal as unknown as Record<string, unknown>).any;
  }
}

describe("client", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("performs a GET request by default", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await client(new URL("https://example.com"));

    expect(fetchMock).toHaveBeenCalledWith(
      new URL("https://example.com"),
      expect.objectContaining({})
    );
  });

  it("passes method, headers, and body through", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await client(new URL("https://example.com"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "John" }),
    });

    expect(fetchMock).toHaveBeenCalledWith(
      new URL("https://example.com"),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: '{"name":"John"}',
      })
    );
  });

  it("does not apply a delay when delay is not set", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await client(new URL("https://example.com"));

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("waits for the configured delay before fetching", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    vi.useFakeTimers();

    const promise = client(new URL("https://example.com"), { delay: 500 });

    expect(fetchMock).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(500);

    expect(fetchMock).toHaveBeenCalledTimes(1);

    await promise;

    vi.useRealTimers();
  });

  it("aborts the request when the timeout elapses", async () => {
    const fetchMock = vi
      .fn()
      .mockImplementation((_input: Request | URL, init?: RequestInit) => {
        return new Promise((resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            reject(new DOMException("The operation was aborted", "AbortError"));
          });
        });
      });
    vi.stubGlobal("fetch", fetchMock);

    vi.useFakeTimers();

    const promise = client(new URL("https://example.com"), { timeout: 100 });
    const assertion = expect(promise).rejects.toThrow("The operation was aborted");

    await vi.advanceTimersByTimeAsync(100);

    await assertion;

    vi.useRealTimers();
  });

  it("combines a caller signal with the timeout signal", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    vi.useFakeTimers();

    const caller = new AbortController();

    const promise = client(new URL("https://example.com"), {
      timeout: 100,
      signal: caller.signal,
    });

    await vi.advanceTimersByTimeAsync(100);

    await promise;

    const [, init] = fetchMock.mock.calls[0] ?? [];
    expect(init?.signal).toBeDefined();
    expect(init?.signal).not.toBe(caller.signal);

    vi.useRealTimers();
  });

  it("does not set a signal when timeout is not set", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await client(new URL("https://example.com"));

    const [, init] = fetchMock.mock.calls[0] ?? [];

    expect(init?.signal).toBeUndefined();
  });

  it("propagates fetch errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("Failed to fetch"))
    );

    await expect(client(new URL("https://example.com"))).rejects.toThrow("Failed to fetch");
  });
});

describe("FetchHttpClient", () => {
  it("delegates request to the client", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const transport = new FetchHttpClient();
    const response = await transport.request(new URL("https://example.com"), {
      method: "GET",
    });

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledWith(
      new URL("https://example.com"),
      expect.objectContaining({ method: "GET" })
    );
  });

  it("delegates request without init", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);

    const transport = new FetchHttpClient();
    const response = await transport.request(new URL("https://example.com"));

    expect(response.status).toBe(204);
  });
});

describe("combineAbortSignals", () => {
  let anySpy: ReturnType<typeof vi.spyOn> | undefined;

  beforeEach(() => {
    anySpy = vi.spyOn(AbortSignal, "any");
  });

  afterEach(() => {
    anySpy?.mockRestore();
    restoreAbortSignalAny();
  });

  it("uses AbortSignal.any when available", () => {
    const a = new AbortController().signal;
    const b = new AbortController().signal;

    anySpy?.mockReturnValue(b);

    const combined = combineAbortSignals([a, b]);

    expect(anySpy).toHaveBeenCalledWith([a, b]);
    expect(combined.signal).toBe(b);
    expect(combined.cleanup()).toBeUndefined();
  });

  it("falls back to a manual controller when AbortSignal.any is unavailable", () => {
    disableAbortSignalAny();

    const a = new AbortController().signal;
    const b = new AbortController().signal;
    const addListenerA = vi.spyOn(a, "addEventListener");
    const removeListenerA = vi.spyOn(a, "removeEventListener");

    const combined = combineAbortSignals([a, b]);

    expect(combined.signal.aborted).toBe(false);
    expect(addListenerA).toHaveBeenCalledWith("abort", expect.any(Function), { once: true });
    expect(removeListenerA).not.toHaveBeenCalled();

    combined.cleanup();

    expect(removeListenerA).toHaveBeenCalledWith("abort", expect.any(Function));
  });

  it("aborts the combined signal when a source signal aborts", () => {
    disableAbortSignalAny();

    const a = new AbortController();
    const b = new AbortController();

    const combined = combineAbortSignals([a.signal, b.signal]);

    expect(combined.signal.aborted).toBe(false);

    a.abort("reason");

    expect(combined.signal.aborted).toBe(true);
    expect(getAbortReason(combined.signal)).toBe("reason");
  });

  it("aborts immediately when a source signal is already aborted", () => {
    disableAbortSignalAny();

    const a = new AbortController();
    const b = new AbortController();

    a.abort("already aborted");

    const combined = combineAbortSignals([a.signal, b.signal]);

    expect(combined.signal.aborted).toBe(true);
    expect(getAbortReason(combined.signal)).toBe("already aborted");

    expect(combined.cleanup()).toBeUndefined();
  });
});

describe("getAbortReason", () => {
  it("returns the signal reason when present", () => {
    const controller = new AbortController();

    controller.abort("boom");

    expect(getAbortReason(controller.signal)).toBe("boom");
  });

  it("returns undefined when the signal has no reason", () => {
    expect(getAbortReason(new AbortController().signal)).toBeUndefined();
  });

  it("returns undefined when reason is not supported", () => {
    const signal = { aborted: true } as AbortSignal;

    expect(getAbortReason(signal)).toBeUndefined();
  });
});

describe("wait", () => {
  it("resolves after the specified time", async () => {
    vi.useFakeTimers();

    const promise = wait(100);

    await vi.advanceTimersByTimeAsync(100);

    await expect(promise).resolves.toBeUndefined();

    vi.useRealTimers();
  });
});