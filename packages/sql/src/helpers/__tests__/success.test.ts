import { describe, expect, it } from "vitest";

import { success } from "../../helpers/success.js";

describe("success", () => {
  it("should create success envelope with value", () => {
    const value = { id: 1, name: "test" };
    const result = success(value);

    expect(result.success).toBe(true);
    expect(result.value).toBe(value);
  });

  it("should work with primitive values", () => {
    expect(success(42).value).toBe(42);
    expect(success("hello").value).toBe("hello");
    expect(success(true).value).toBe(true);
    expect(success(null).value).toBe(null);
  });

  it("should work with undefined", () => {
    const result = success(undefined);
    expect(result.success).toBe(true);
    expect(result.value).toBeUndefined();
  });

  it("should work with complex objects", () => {
    const obj = {
      users: [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ],
      meta: { total: 2 },
    };
    const result = success(obj);

    expect(result.value).toEqual(obj);
    expect(result.value.users.length).toBe(2);
  });

  it("should work with arrays", () => {
    const arr = [1, 2, 3, 4, 5];
    const result = success(arr);

    expect(result.value).toBe(arr);
    expect(result.value.length).toBe(5);
  });

  it("should preserve object references", () => {
    const obj = { id: 1 };
    const result = success(obj);

    expect(result.value === obj).toBe(true);
  });

  it("should work with generic types", () => {
    interface User {
      id: number;
      name: string;
    }

    const user: User = { id: 1, name: "Alice" };
    const result = success<User>(user);

    expect(result.success).toBe(true);
    expect(result.value.id).toBe(1);
    expect(result.value.name).toBe("Alice");
  });

  it("should work with readonly values", () => {
    const readonly = { a: 1 } as const;
    const result = success(readonly);

    expect(result.value).toEqual({ a: 1 });
  });

  it("should work with empty objects", () => {
    const result = success({});

    expect(result.success).toBe(true);
    expect(result.value).toEqual({});
  });

  it("should work with empty arrays", () => {
    const result = success([]);

    expect(result.success).toBe(true);
    expect(result.value).toEqual([]);
    expect(result.value.length).toBe(0);
  });
});
