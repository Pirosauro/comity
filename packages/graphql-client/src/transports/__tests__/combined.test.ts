import { describe, expect, it, vi } from "vitest";
import { CombinedGraphqlTransport } from "../combined.js";

describe("CombinedGraphqlTransport", () => {
  it("delegates execute to the execute transport", async () => {
    const execute = vi.fn(async () => ({ data: { ok: true } }));
    const subscribe = vi.fn();

    const transport = new CombinedGraphqlTransport({ execute, subscribe });

    const result = await transport.execute({ query: "query { ok }" });

    expect(execute).toHaveBeenCalledWith({ query: "query { ok }" });
    expect(result).toEqual({ data: { ok: true } });
    expect(subscribe).not.toHaveBeenCalled();
  });

  it("delegates subscribe to the subscribe transport", async () => {
    const execute = vi.fn();
    const subscribe = vi.fn(() => ({}));

    const transport = new CombinedGraphqlTransport({ execute, subscribe });

    const iterator = transport.subscribe({ query: "subscription { ok }" });

    expect(subscribe).toHaveBeenCalledWith({ query: "subscription { ok }" });
    expect(iterator).toEqual({});
  });

  it("throws subscription_not_supported when no subscribe transport is given", () => {
    const execute = vi.fn();

    const transport = new CombinedGraphqlTransport({ execute, subscribe: undefined as never });

    expect(() => transport.subscribe({ query: "subscription { ok }" })).toThrowError(
      "GraphQL transport does not support subscriptions"
    );
  });
});