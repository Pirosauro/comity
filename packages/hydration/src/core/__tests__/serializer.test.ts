import { describe, expect, it } from "vitest";
import { JsonIslandSerializer } from "../serializer.js";

describe("JsonIslandSerializer", () => {
  describe("serialize", () => {
    it("should serialize a string", () => {
      const result = JsonIslandSerializer.serialize("test");
      expect(result).toBe('"test"');
    });

    it("should serialize a number", () => {
      const result = JsonIslandSerializer.serialize(42);
      expect(result).toBe("42");
    });

    it("should serialize an object", () => {
      const obj = { key: "value", num: 123 };
      const result = JsonIslandSerializer.serialize(obj);
      expect(result).toBe('{"key":"value","num":123}');
    });

    it("should serialize null", () => {
      const result = JsonIslandSerializer.serialize(null);
      expect(result).toBe("null");
    });

    it("should serialize undefined", () => {
      const result = JsonIslandSerializer.serialize(undefined);
      expect(result).toBeUndefined();
    });

    it("should serialize an array", () => {
      const arr = [1, "two", { three: 3 }];
      const result = JsonIslandSerializer.serialize(arr);
      expect(result).toBe('[1,"two",{"three":3}]');
    });
  });

  describe("deserialize", () => {
    it("should deserialize a string", () => {
      const result = JsonIslandSerializer.deserialize('"test"');
      expect(result).toBe("test");
    });

    it("should deserialize a number", () => {
      const result = JsonIslandSerializer.deserialize("42");
      expect(result).toBe(42);
    });

    it("should deserialize an object", () => {
      const json = '{"key":"value","num":123}';
      const result = JsonIslandSerializer.deserialize(json);
      expect(result).toEqual({ key: "value", num: 123 });
    });

    it("should deserialize null", () => {
      const result = JsonIslandSerializer.deserialize("null");
      expect(result).toBe(null);
    });

    it("should deserialize an array", () => {
      const json = '[1,"two",{"three":3}]';
      const result = JsonIslandSerializer.deserialize(json);
      expect(result).toEqual([1, "two", { three: 3 }]);
    });

    it("should throw on invalid JSON", () => {
      expect(() => JsonIslandSerializer.deserialize("invalid")).toThrow();
    });
  });

  describe("roundtrip", () => {
    it("should serialize and deserialize back to original", () => {
      const original = { name: "test", data: [1, 2, 3], nested: { key: "value" } };
      const serialized = JsonIslandSerializer.serialize(original);
      const deserialized = JsonIslandSerializer.deserialize(serialized);
      expect(deserialized).toEqual(original);
    });
  });
});