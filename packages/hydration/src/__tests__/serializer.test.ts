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
});
