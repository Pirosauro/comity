import { beforeEach, describe, expect, it, vi } from "vitest";
import { HookBus } from "../bus.js";

interface TestHooks extends Record<string, unknown> {
  beforeSave: string;
  afterSave: number;
  onError: boolean;
}

describe("HookBus", () => {
  let bus: HookBus<TestHooks>;

  beforeEach(() => {
    bus = new HookBus<TestHooks>();
  });

  describe("define", () => {
    it("should add a handler for a hook", () => {
      const handler = vi.fn((value: string) => value.toUpperCase());

      bus.define("beforeSave", handler);

      // No direct way to check internal state, but execute will test it
    });

    it("should allow multiple handlers for the same hook", () => {
      const handler1 = vi.fn((value: string) => value + "1");
      const handler2 = vi.fn((value: string) => value + "2");

      bus.define("beforeSave", handler1);
      bus.define("beforeSave", handler2);

      // Again, execute will test
    });
  });

  describe("execute", () => {
    it("should return initial value when no handlers are defined", async () => {
      const result = await bus.execute("beforeSave", "test");

      expect(result).toBe("test");
    });

    it("should execute a single handler", async () => {
      const handler = vi.fn((value: string) => value.toUpperCase());

      bus.define("beforeSave", handler);

      const result = await bus.execute("beforeSave", "hello");

      expect(handler).toHaveBeenCalledWith("hello", "hello");
      expect(result).toBe("HELLO");
    });

    it("should execute multiple handlers in sequence", async () => {
      const handler1 = vi.fn((value: string) => value + " world");
      const handler2 = vi.fn((value: string) => value.toUpperCase());

      bus.define("beforeSave", handler1);
      bus.define("beforeSave", handler2);

      const result = await bus.execute("beforeSave", "hello");

      expect(handler1).toHaveBeenCalledWith("hello", "hello");
      expect(handler2).toHaveBeenCalledWith("hello world", "hello");
      expect(result).toBe("HELLO WORLD");
    });

    it("should handle async handlers", async () => {
      const handler = vi.fn(async (value: string) => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return value + " async";
      });

      bus.define("beforeSave", handler);

      const result = await bus.execute("beforeSave", "test");

      expect(result).toBe("test async");
    });

    it("should handle different hook types", async () => {
      const stringHandler = vi.fn((value: string) => value + "!");
      const numberHandler = vi.fn((value: number) => value * 2);
      const booleanHandler = vi.fn((value: boolean) => !value);

      bus.define("beforeSave", stringHandler);
      bus.define("afterSave", numberHandler);
      bus.define("onError", booleanHandler);

      const stringResult = await bus.execute("beforeSave", "hi");
      const numberResult = await bus.execute("afterSave", 5);
      const booleanResult = await bus.execute("onError", true);

      expect(stringResult).toBe("hi!");
      expect(numberResult).toBe(10);
      expect(booleanResult).toBe(false);
    });

    it("should pass initial value to all handlers", async () => {
      const handler1 = vi.fn((value: string, initial: string) => initial + "1");
      const handler2 = vi.fn((value: string, initial: string) => value + "2");

      bus.define("beforeSave", handler1);
      bus.define("beforeSave", handler2);

      const result = await bus.execute("beforeSave", "start");

      expect(handler1).toHaveBeenCalledWith("start", "start");
      expect(handler2).toHaveBeenCalledWith("start1", "start");
      expect(result).toBe("start12");
    });
  });
});
