import { describe, expect, it } from "vitest";
import { JsonIslandSerializer } from "../serializer.js";

describe("JsonIslandSerializer", () => {
  it("serializes undefined as null", () => {
    expect(JsonIslandSerializer.serialize(undefined)).toBe("null");
  });

  it("escapes characters that can break an inline script tag", () => {
    const serialized = JsonIslandSerializer.serialize({
      id: "hero",
      component: "Hero",
      data: {
        payload: "</script><script>alert('xss')</script>",
        separators: "\u2028\u2029",
      },
      strategy: { kind: "visible" },
    });

    expect(serialized).not.toContain("</script>");
    expect(serialized).toContain("\\u003C/script\\u003E");
    expect(serialized).toContain("\\u2028\\u2029");
  });

  it("rejects parsed payloads that are not valid island contracts", () => {
    expect(() => JsonIslandSerializer.deserialize('{"id":1}')).toThrow(TypeError);
  });

  it("deserializes contracts using object strategy shape", () => {
    const parsed = JsonIslandSerializer.deserialize(
      JSON.stringify({
        id: "counter",
        component: "counter",
        data: { initial: 1 },
        strategy: { kind: "immediate" },
      })
    );

    expect(parsed).toEqual({
      id: "counter",
      component: "counter",
      data: { initial: 1 },
      strategy: { kind: "immediate" },
    });
  });

  it("serializes null to the literal null JSON", () => {
    expect(JsonIslandSerializer.serialize(null)).toBe("null");
  });

  it("deserializes the literal null JSON to null", () => {
    expect(JsonIslandSerializer.deserialize("null")).toBeNull();
  });

  it("rejects payloads without a valid id", () => {
    expect(() =>
      JsonIslandSerializer.deserialize(
        JSON.stringify({ component: "counter", data: {}, strategy: { kind: "immediate" } })
      )
    ).toThrow(TypeError);
  });

  it("rejects payloads without a valid component", () => {
    expect(() =>
      JsonIslandSerializer.deserialize(
        JSON.stringify({ id: "counter", data: {}, strategy: { kind: "immediate" } })
      )
    ).toThrow(TypeError);
  });

  it("rejects payloads without a valid strategy", () => {
    expect(() =>
      JsonIslandSerializer.deserialize(
        JSON.stringify({ id: "counter", component: "counter", data: {} })
      )
    ).toThrow(TypeError);
  });

  it("rejects payloads without a data property", () => {
    expect(() =>
      JsonIslandSerializer.deserialize(
        JSON.stringify({ id: "counter", component: "counter", strategy: { kind: "immediate" } })
      )
    ).toThrow(TypeError);
  });

  it("rejects payloads with an invalid mode", () => {
    expect(() =>
      JsonIslandSerializer.deserialize(
        JSON.stringify({
          id: "counter",
          component: "counter",
          data: {},
          strategy: { kind: "immediate" },
          mode: "invalid",
        })
      )
    ).toThrow(TypeError);
  });

  it("accepts payloads with the client-only mode", () => {
    const parsed = JsonIslandSerializer.deserialize(
      JSON.stringify({
        id: "counter",
        component: "counter",
        data: {},
        strategy: { kind: "immediate" },
        mode: "client-only",
      })
    );

    expect(parsed).toEqual({
      id: "counter",
      component: "counter",
      data: {},
      strategy: { kind: "immediate" },
      mode: "client-only",
    });
  });
});
