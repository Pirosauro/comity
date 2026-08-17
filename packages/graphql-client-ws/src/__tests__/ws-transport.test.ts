import { describe, expect, it, vi, beforeEach } from "vitest";
import { GraphqlClientError } from "@comity/graphql-client/errors";
import { WsGraphqlTransport } from "../ws-transport.js";

type Sink = {
  next: (data: unknown) => void;
  error: (cause: unknown) => void;
  complete: () => void;
};

function captureClient(): {
  client: { subscribe: ReturnType<typeof vi.fn> };
  dispose: ReturnType<typeof vi.fn>;
  sink: () => Sink | undefined;
} {
  let captured: Sink | undefined;
  const dispose = vi.fn();
  const subscribe = vi.fn((_payload: unknown, sinkArg: Sink) => {
    captured = sinkArg;
    return dispose;
  });

  return {
    client: { subscribe },
    dispose,
    sink: () => captured,
  };
}

const { createClientMock } = vi.hoisted(() => ({ createClientMock: vi.fn() }));

vi.mock("graphql-ws", () => ({
  createClient: createClientMock,
}));

describe("WsGraphqlTransport", () => {
  beforeEach(() => {
    createClientMock.mockReset();
  });

  it("executes a request via the injected client and returns the first value", async () => {
    const { client, sink } = captureClient();
    const transport = new WsGraphqlTransport({ client: client as never });

    const resultPromise = transport.execute<{ ok: boolean }>({
      query: "query { ok }",
      variables: { id: "1" },
      operationName: "GetOk",
    });

    const captured = await vi.waitFor(() => {
      const s = sink();
      if (!s) throw new Error("no sink yet");
      return s;
    });

    captured.next({ data: { ok: true } });

    await expect(resultPromise).resolves.toEqual({ data: { ok: true } });
    expect(client.subscribe).toHaveBeenCalledWith(
      {
        query: "query { ok }",
        variables: { id: "1" },
        operationName: "GetOk",
      },
      expect.any(Object)
    );
  });

  it("throws a protocol error when the subscription completes without a value", async () => {
    const { client, sink } = captureClient();
    const transport = new WsGraphqlTransport({ client: client as never });

    const resultPromise = transport.execute({ query: "query { ok }" });
    const captured = await vi.waitFor(() => {
      const s = sink();
      if (!s) throw new Error("no sink yet");
      return s;
    });

    captured.complete();

    await expect(resultPromise).rejects.toMatchObject({ code: "graphql:protocol_error" });
  });

  it("yields every value emitted by the subscription in order", async () => {
    const { client, sink } = captureClient();
    const transport = new WsGraphqlTransport({ client: client as never });

    const iterator = transport.subscribe<{ n: number }>({ query: "subscription { n }" });
    const asyncIterator = iterator[Symbol.asyncIterator]();

    const values: unknown[] = [];
    const pull = async (): Promise<boolean> => {
      const r = await asyncIterator.next();
      if (!r.done) values.push(r.value);
      return r.done;
    };

    const first = pull();
    const captured = await vi.waitFor(() => {
      const s = sink();
      if (!s) throw new Error("no sink yet");
      return s;
    });

    captured.next({ data: { n: 1 } });
    await first;

    const second = pull();
    captured.next({ data: { n: 2 } });
    await second;

    const final = pull();
    captured.complete();
    await expect(final).resolves.toBe(true);

    expect(values).toEqual([{ data: { n: 1 } }, { data: { n: 2 } }]);
    expect(client.subscribe).toHaveBeenCalledTimes(1);
  });

  it("buffers values pushed before the iterator is pulled", async () => {
    const { client, sink } = captureClient();
    const transport = new WsGraphqlTransport({ client: client as never });

    const iterator = transport.subscribe<{ n: number }>({ query: "subscription { n }" });
    const asyncIterator = iterator[Symbol.asyncIterator]();

    const captured = await vi.waitFor(() => {
      const s = sink();
      if (!s) throw new Error("no sink yet");
      return s;
    });

    captured.next({ data: { n: 1 } });
    captured.next({ data: { n: 2 } });

    const first = await asyncIterator.next();
    const second = await asyncIterator.next();

    expect(first).toEqual({ value: { data: { n: 1 } }, done: false });
    expect(second).toEqual({ value: { data: { n: 2 } }, done: false });
    expect(client.subscribe).toHaveBeenCalledTimes(1);
  });

  it("completes the iterator when the subscription completes", async () => {
    const { client, sink } = captureClient();
    const transport = new WsGraphqlTransport({ client: client as never });

    const iterator = transport.subscribe<{ n: number }>({ query: "subscription { n }" });
    const asyncIterator = iterator[Symbol.asyncIterator]();

    const pending = asyncIterator.next();
    const captured = await vi.waitFor(() => {
      const s = sink();
      if (!s) throw new Error("no sink yet");
      return s;
    });

    captured.next({ data: { n: 1 } });
    await expect(pending).resolves.toEqual({ value: { data: { n: 1 } }, done: false });

    const nextPending = asyncIterator.next();
    captured.complete();
    await expect(nextPending).resolves.toEqual({ value: undefined, done: true });
  });

  it("completes before a pull returns done without a pending resolver", async () => {
    const { client, sink } = captureClient();
    const transport = new WsGraphqlTransport({ client: client as never });

    const iterator = transport.subscribe({ query: "subscription { n }" });
    const asyncIterator = iterator[Symbol.asyncIterator]();

    const captured = await vi.waitFor(() => {
      const s = sink();
      if (!s) throw new Error("no sink yet");
      return s;
    });

    captured.complete();

    await expect(asyncIterator.next()).resolves.toEqual({ value: undefined, done: true });
    expect(client.subscribe).toHaveBeenCalledTimes(1);
  });

  it("disposes the underlying subscription on return", async () => {
    const { client, dispose } = captureClient();
    const transport = new WsGraphqlTransport({ client: client as never });

    const iterator = transport.subscribe({ query: "subscription { n }" });
    const asyncIterator = iterator[Symbol.asyncIterator]();

    await asyncIterator.return?.();

    expect(dispose).toHaveBeenCalledTimes(1);
  });

  it("disposes the underlying subscription and rethrows on throw", async () => {
    const { client, dispose } = captureClient();
    const transport = new WsGraphqlTransport({ client: client as never });

    const iterator = transport.subscribe({ query: "subscription { n }" });
    const asyncIterator = iterator[Symbol.asyncIterator]();
    const cause = new Error("boom");

    expect(() => asyncIterator.throw?.(cause)).toThrow(cause);
    expect(dispose).toHaveBeenCalledTimes(1);
  });

  it("surfaces subscription errors as transport errors", async () => {
    const { client, sink } = captureClient();
    const transport = new WsGraphqlTransport({ client: client as never });

    const iterator = transport.subscribe({ query: "subscription { n }" });
    iterator[Symbol.asyncIterator]();

    const captured = await vi.waitFor(() => {
      const s = sink();
      if (!s) throw new Error("no sink yet");
      return s;
    });

    const cause = new Error("socket failure");
    expect(() => captured.error(cause)).toThrowError(GraphqlClientError);
    expect(() => captured.error(cause)).toThrowError("Error occurred in GraphQL transport");
  });

  it("creates a client from url when no client is injected", async () => {
    const { client } = captureClient();
    createClientMock.mockReturnValue(client);

    new WsGraphqlTransport({
      url: "wss://example.com/graphql",
      connectionParams: { token: "abc" },
    });

    expect(createClientMock).toHaveBeenCalledWith({
      url: "wss://example.com/graphql",
      connectionParams: { token: "abc" },
    });
  });

  it("defaults connection params to an empty object", async () => {
    const { client } = captureClient();
    createClientMock.mockReturnValue(client);

    new WsGraphqlTransport({ url: "wss://example.com/graphql" });

    expect(createClientMock).toHaveBeenCalledWith({
      url: "wss://example.com/graphql",
      connectionParams: {},
    });
  });
});
