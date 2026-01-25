import { describe, expect, it } from "vitest";
import { createHttpState } from "../state.js";

describe("createHttpState", () => {
  it("should create an HttpState instance", () => {
    const state = createHttpState();

    expect(state).toBeDefined();
    expect(typeof state.get).toBe("function");
    expect(typeof state.set).toBe("function");
    expect(typeof state.has).toBe("function");
  });

  describe("get", () => {
    it("should return undefined for non-existent key", () => {
      const state = createHttpState();

      expect(state.get("missing")).toBeUndefined();
    });

    it("should return stored value", () => {
      const state = createHttpState();
      state.set("key", "value");

      expect(state.get("key")).toBe("value");
    });

    it("should return typed value", () => {
      const state = createHttpState();
      const obj = { id: 1, name: "test" };
      state.set("user", obj);

      const result = state.get<typeof obj>("user");
      expect(result).toEqual(obj);
      expect(result?.id).toBe(1);
    });

    it("should handle different types", () => {
      const state = createHttpState();

      state.set("string", "value");
      state.set("number", 42);
      state.set("boolean", true);
      state.set("object", { nested: true });
      state.set("array", [1, 2, 3]);
      state.set("null", null);

      expect(state.get("string")).toBe("value");
      expect(state.get("number")).toBe(42);
      expect(state.get("boolean")).toBe(true);
      expect(state.get("object")).toEqual({ nested: true });
      expect(state.get("array")).toEqual([1, 2, 3]);
      expect(state.get("null")).toBe(null);
    });
  });

  describe("set", () => {
    it("should store a value", () => {
      const state = createHttpState();
      state.set("key", "value");

      expect(state.get("key")).toBe("value");
    });

    it("should overwrite existing value", () => {
      const state = createHttpState();
      state.set("key", "initial");
      state.set("key", "updated");

      expect(state.get("key")).toBe("updated");
    });

    it("should store complex objects", () => {
      const state = createHttpState();
      const user = { id: 1, email: "test@example.com", roles: ["admin", "user"] };

      state.set("user", user);

      expect(state.get("user")).toEqual(user);
    });

    it("should handle multiple keys", () => {
      const state = createHttpState();

      state.set("key1", "value1");
      state.set("key2", "value2");
      state.set("key3", "value3");

      expect(state.get("key1")).toBe("value1");
      expect(state.get("key2")).toBe("value2");
      expect(state.get("key3")).toBe("value3");
    });
  });

  describe("has", () => {
    it("should return false for non-existent key", () => {
      const state = createHttpState();

      expect(state.has("missing")).toBe(false);
    });

    it("should return true for existing key", () => {
      const state = createHttpState();
      state.set("key", "value");

      expect(state.has("key")).toBe(true);
    });

    it("should return true even when value is null or undefined", () => {
      const state = createHttpState();

      state.set("nullKey", null);
      state.set("undefinedKey", undefined);

      expect(state.has("nullKey")).toBe(true);
      expect(state.has("undefinedKey")).toBe(true);
    });

    it("should handle multiple keys", () => {
      const state = createHttpState();

      state.set("exists1", "value");
      state.set("exists2", "value");

      expect(state.has("exists1")).toBe(true);
      expect(state.has("exists2")).toBe(true);
      expect(state.has("notExists")).toBe(false);
    });
  });

  describe("isolation", () => {
    it("should isolate state between instances", () => {
      const state1 = createHttpState();
      const state2 = createHttpState();

      state1.set("key", "value1");
      state2.set("key", "value2");

      expect(state1.get("key")).toBe("value1");
      expect(state2.get("key")).toBe("value2");
    });
  });
});
