import { afterEach, describe, expect, it, vi } from "vitest";
import { FetchGraphqlTransport } from "../fetch-transport.js";

describe("FetchGraphqlTransport", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("executes a query with POST and JSON content-type", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () =>
      new Response(JSON.stringify({ data: { viewer: { id: "1" } } }), { status: 200 })
    );

    vi.stubGlobal("fetch", fetchMock);

    const transport = new FetchGraphqlTransport({ url: "https://example.com/graphql" });

    const result = await transport.execute<{ viewer: { id: string } }>({
      query: "query { viewer { id } }",
      variables: { limit: 10 },
      operationName: "GetViewer",
    });

    expect(result.data).toEqual({ viewer: { id: "1" } });
    expect(result.meta?.httpStatus).toBe(200);

    const [input, init] = fetchMock.mock.calls[0] ?? [];

    expect(String(input)).toBe("https://example.com/graphql");
    expect(init?.method).toBe("POST");
    expect(init?.headers).toMatchObject({ "content-type": "application/json" });
    expect(JSON.parse(String(init?.body))).toEqual({
      query: "query { viewer { id } }",
      variables: { limit: 10 },
      operationName: "GetViewer",
    });
  });

  it("defaults to the global fetch function", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () =>
      new Response(JSON.stringify({ data: { ok: true } }), { status: 200 })
    );

    vi.stubGlobal("fetch", fetchMock);

    const transport = new FetchGraphqlTransport({ url: "https://example.com/graphql" });

    await transport.execute({ query: "query { ok }" });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("merges configured headers with request headers", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () =>
      new Response(JSON.stringify({ data: { ok: true } }), { status: 200 })
    );

    vi.stubGlobal("fetch", fetchMock);

    const transport = new FetchGraphqlTransport({
      url: "https://example.com/graphql",
      headers: { authorization: "Bearer token" },
    });

    await transport.execute({
      query: "query { ok }",
      headers: { "x-custom": "value" },
    });

    const [, init] = fetchMock.mock.calls[0] ?? [];

    expect(init?.headers).toMatchObject({
      "content-type": "application/json",
      authorization: "Bearer token",
      "x-custom": "value",
    });
  });

  it("surfaces transport errors with http status", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => new Response("boom", { status: 500 }));

    vi.stubGlobal("fetch", fetchMock);

    const transport = new FetchGraphqlTransport({ url: "https://example.com/graphql" });

    await expect(
      transport.execute({ query: "query { ok }", operationName: "GetOk" })
    ).rejects.toMatchObject({
      code: "graphql:transport_error",
      meta: {
        httpStatus: 500,
        details: { operationName: "GetOk" },
      },
    });
  });

  it("normalizes data, errors, extensions, headers and status into the response", async () => {
    const headers = new Headers({ "x-request-id": "abc" });

    const fetchMock = vi.fn<typeof fetch>(async () =>
      new Response(
        JSON.stringify({
          data: { ok: true },
          errors: [{ message: "oops" }],
          extensions: { tracing: { version: 1 } },
        }),
        { status: 200, headers }
      )
    );

    vi.stubGlobal("fetch", fetchMock);

    const transport = new FetchGraphqlTransport({ url: "https://example.com/graphql" });

    const result = await transport.execute<{ ok: boolean }>({ query: "query { ok }" });

    expect(result.data).toEqual({ ok: true });
    expect(result.errors).toEqual([{ message: "oops" }]);
    expect(result.meta?.extensions).toEqual({ tracing: { version: 1 } });
    expect(result.meta?.httpStatus).toBe(200);
    expect(result.meta?.headers?.get("x-request-id")).toBe("abc");
  });

  it("supports injection of a custom fetch function", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () =>
      new Response(JSON.stringify({ data: { ok: true } }), { status: 200 })
    );

    const transport = new FetchGraphqlTransport({
      url: "https://example.com/graphql",
      fetch: fetchMock,
    });

    await transport.execute({ query: "query { ok }" });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("omits extensions when absent from the response", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () =>
      new Response(JSON.stringify({ data: { ok: true } }), { status: 200 })
    );

    vi.stubGlobal("fetch", fetchMock);

    const transport = new FetchGraphqlTransport({ url: "https://example.com/graphql" });

    const result = await transport.execute<{ ok: boolean }>({ query: "query { ok }" });

    expect(result.meta?.extensions).toBeUndefined();
  });

  it("propagates raw network failures without wrapping", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => {
      throw new TypeError("fetch failed");
    });

    vi.stubGlobal("fetch", fetchMock);

    const transport = new FetchGraphqlTransport({ url: "https://example.com/graphql" });

    await expect(transport.execute({ query: "query { ok }" })).rejects.toBeInstanceOf(TypeError);
  });
});