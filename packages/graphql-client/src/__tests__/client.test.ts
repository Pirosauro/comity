import { describe, expect, it, vi } from "vitest";
import { GraphqlClient } from "../client.js";
import { GraphqlClientError } from "../errors/index.js";

describe("GraphqlClient", () => {
  it("delegates execute to the transport", async () => {
    const execute = vi.fn(async () => ({ data: { ok: true } }));
    const client = new GraphqlClient({ transport: { execute } as never });

    const result = await client.execute<{ ok: boolean }>({ query: "query { ok }" });

    expect(execute).toHaveBeenCalledWith({ query: "query { ok }" });
    expect(result).toEqual({ data: { ok: true } });
  });

  it("aliases query to execute", async () => {
    const execute = vi.fn(async () => ({ data: { ok: true } }));
    const client = new GraphqlClient({ transport: { execute } as never });

    await client.query({ query: "query { ok }" });

    expect(execute).toHaveBeenCalledTimes(1);
  });

  it("aliases mutation to execute", async () => {
    const execute = vi.fn(async () => ({ data: { ok: true } }));
    const client = new GraphqlClient({ transport: { execute } as never });

    await client.mutation({ query: "mutation { ok }" });

    expect(execute).toHaveBeenCalledTimes(1);
  });

  it("delegates subscribe to the transport when supported", async () => {
    async function* source() {
      yield { data: { n: 1 } };
      yield { data: { n: 2 } };
    }
    const subscribe = vi.fn(() => source());
    const client = new GraphqlClient({ transport: { execute: vi.fn(), subscribe } as never });

    const values: unknown[] = [];
    for await (const value of client.subscribe({ query: "subscription { n }" })) {
      values.push(value);
    }

    expect(subscribe).toHaveBeenCalledWith({ query: "subscription { n }" });
    expect(values).toEqual([{ data: { n: 1 } }, { data: { n: 2 } }]);
  });

  it("throws subscription_not_supported when the transport has no subscribe", async () => {
    const client = new GraphqlClient({ transport: { execute: vi.fn() } as never });

    const iterator = client.subscribe({ query: "subscription { n }" });
    const next = iterator.next();

    await expect(next).rejects.toMatchObject({ code: "graphql:subscription_not_supported" });
  });
});

describe("GraphqlClientError", () => {
  it("exposes reason, message and code", () => {
    const error = new GraphqlClientError("network_error", { details: { operationName: "Get" } });

    expect(error.code).toBe("graphql:network_error");
    expect(error.message).toBe("Network error occurred during GraphQL request");
    expect(error.meta).toMatchObject({
      reason: "network_error",
      details: { operationName: "Get" },
    });
  });

  it("exposes the subscription_not_supported message", () => {
    const error = new GraphqlClientError("subscription_not_supported");

    expect(error.message).toBe("GraphQL transport does not support subscriptions");
  });
});