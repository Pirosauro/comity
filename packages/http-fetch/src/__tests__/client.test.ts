import { afterEach, describe, expect, it, vi } from "vitest";
import { client } from "../client.js";

describe("client", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("preserves an already aborted caller signal when timeout is enabled", async () => {
    const fetchMock = vi.fn<(input: Request | URL, init?: RequestInit) => Promise<Response>>(
      async () => new Response(null, { status: 204 })
    );

    vi.stubGlobal("fetch", fetchMock);

    const controller = new AbortController();

    controller.abort(new Error("upstream aborted"));

    await client(new URL("https://example.com"), {
      timeout: 1000,
      signal: controller.signal,
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [, init] = fetchMock.mock.calls[0] ?? [];

    expect(init?.signal?.aborted).toBe(true);
  });
});
