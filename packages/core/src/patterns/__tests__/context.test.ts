import { describe, it, expect, vi, beforeEach } from "vitest";
import { Context } from "../context.js";

describe("Context", () => {
  let context: Context;

  beforeEach(() => {
    context = new Context();
    vi.clearAllMocks();
  });

  describe("constructor", () => {
    it("should create Context with all required properties", () => {
      expect(context).toBeInstanceOf(Context);
    });
  });

  describe("hook system", () => {
    it("should register and trigger hooks correctly", async () => {
      const hook1 = vi.fn().mockResolvedValue("step1");
      const hook2 = vi.fn().mockResolvedValue("step2");

      context.onHook("test:hook", hook1);
      context.onHook("test:hook", hook2);

      const result = await context.trigger("test:hook", "initial");

      expect(hook1).toHaveBeenCalledWith("initial");
      expect(hook2).toHaveBeenCalledWith("step1");
      expect(result).toBe("step2");
    });

    it("should handle hooks that return undefined", async () => {
      const hook1 = vi.fn().mockResolvedValue(undefined);
      const hook2 = vi.fn().mockResolvedValue("final");

      context.onHook("test:hook", hook1);
      context.onHook("test:hook", hook2);

      const result = await context.trigger("test:hook", "initial");

      expect(hook1).toHaveBeenCalledWith("initial");
      expect(hook2).toHaveBeenCalledWith("initial"); // Should get original payload
      expect(result).toBe("final");
    });

    it("should handle multiple hooks with mixed return values", async () => {
      const hook1 = vi.fn().mockResolvedValue("transformed");
      const hook2 = vi.fn().mockResolvedValue(undefined);
      const hook3 = vi.fn().mockResolvedValue("final");

      context.onHook("test:hook", hook1);
      context.onHook("test:hook", hook2);
      context.onHook("test:hook", hook3);

      const result = await context.trigger("test:hook", "initial");

      expect(hook1).toHaveBeenCalledWith("initial");
      expect(hook2).toHaveBeenCalledWith("transformed");
      expect(hook3).toHaveBeenCalledWith("transformed");
      expect(result).toBe("final");
    });

    it("should return original payload when no hooks are registered", async () => {
      const result = await context.trigger("nonexistent:hook", "payload");

      expect(result).toBe("payload");
    });

    it("should handle async hooks correctly", async () => {
      const asyncHook = vi.fn().mockImplementation(async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 10));

        return `async-${payload}`;
      });

      context.onHook("async:hook", asyncHook);

      const result = await context.trigger("async:hook", "test");

      expect(asyncHook).toHaveBeenCalledWith("test");
      expect(result).toBe("async-test");
    });

    it("should handle hook errors correctly", async () => {
      const errorHook = vi.fn().mockRejectedValue(new Error("Hook failed"));

      context.onHook("error:hook", errorHook);

      await expect(context.trigger("error:hook", "test")).rejects.toThrow(
        "Hook failed"
      );
      expect(errorHook).toHaveBeenCalledWith("test");
    });

    it("should execute hooks sequentially", async () => {
      const order: number[] = [];

      const hook1 = vi.fn().mockImplementation(async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 20));
        order.push(1);
        return payload;
      });

      const hook2 = vi.fn().mockImplementation(async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        order.push(2);
        return payload;
      });

      context.onHook("sequential:hook", hook1);
      context.onHook("sequential:hook", hook2);

      await context.trigger("sequential:hook", "test");

      expect(order).toEqual([1, 2]); // Should execute in order
    });

    it("should handle same hook name registered multiple times", async () => {
      const hook1 = vi.fn().mockResolvedValue("result1");
      const hook2 = vi.fn().mockResolvedValue("result2");
      const hook3 = vi.fn().mockResolvedValue("result3");

      context.onHook("multi:hook", hook1);
      context.onHook("multi:hook", hook2);
      context.onHook("multi:hook", hook3);

      const result = await context.trigger("multi:hook", "input");

      expect(hook1).toHaveBeenCalledWith("input");
      expect(hook2).toHaveBeenCalledWith("result1");
      expect(hook3).toHaveBeenCalledWith("result2");
      expect(result).toBe("result3");
    });
  });

  describe("event system", () => {
    it("should register and emit events correctly", async () => {
      const event1 = vi.fn().mockResolvedValue(undefined);
      const event2 = vi.fn().mockResolvedValue(undefined);

      context.onEvent("test:event", event1);
      context.onEvent("test:event", event2);

      await context.emit("test:event", "payload");

      expect(event1).toHaveBeenCalledWith("payload");
      expect(event2).toHaveBeenCalledWith("payload");
    });

    it("should execute events in parallel", async () => {
      const order: number[] = [];

      const event1 = vi.fn().mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 20));
        order.push(1);
      });

      const event2 = vi.fn().mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        order.push(2);
      });

      context.onEvent("parallel:event", event1);
      context.onEvent("parallel:event", event2);

      // Execute events and verify they both ran. We assert ordering of completion
      // (faster handler should finish first) rather than rely on wall-clock timing
      await context.emit("parallel:event", "test");
      expect(order).toEqual([2, 1]); // Faster one finishes first
    });

    it("should handle events with no listeners", async () => {
      // Should not throw
      await expect(
        context.emit("nonexistent:event", "payload")
      ).resolves.toBeUndefined();
    });

    it("should handle event errors without stopping other events", async () => {
      const errorEvent = vi.fn().mockRejectedValue(new Error("Event failed"));
      const successEvent = vi.fn().mockResolvedValue(undefined);

      context.onEvent("mixed:event", errorEvent);
      context.onEvent("mixed:event", successEvent);

      // Should reject because one event failed
      await expect(context.emit("mixed:event", "test")).rejects.toThrow();

      expect(errorEvent).toHaveBeenCalledWith("test");
      expect(successEvent).toHaveBeenCalledWith("test");
    });

    it("should allow same function to be registered for multiple events", async () => {
      const sharedHandler = vi.fn().mockResolvedValue(undefined);

      context.onEvent("event1", sharedHandler);
      context.onEvent("event2", sharedHandler);

      await context.emit("event1", "payload1");
      await context.emit("event2", "payload2");

      expect(sharedHandler).toHaveBeenCalledTimes(2);
      expect(sharedHandler).toHaveBeenCalledWith("payload1");
      expect(sharedHandler).toHaveBeenCalledWith("payload2");
    });

    it("should handle large number of event listeners", async () => {
      const listeners = Array.from({ length: 100 }, () =>
        vi.fn().mockResolvedValue(undefined)
      );

      listeners.forEach((listener) => {
        context.onEvent("bulk:event", listener);
      });

      await context.emit("bulk:event", "test");

      listeners.forEach((listener) => {
        expect(listener).toHaveBeenCalledWith("test");
      });
    });
  });

  describe("integration scenarios", () => {
    it("should handle complex hook and event interactions", async () => {
      const hookResults: string[] = [];
      const eventResults: string[] = [];

      // Register hooks that transform data
      const hook1 = vi.fn().mockImplementation((data: string) => {
        hookResults.push(`hook1-${data}`);
        return `transformed-${data}`;
      });

      const hook2 = vi.fn().mockImplementation((data: string) => {
        hookResults.push(`hook2-${data}`);
        return `final-${data}`;
      });

      context.onHook("process:data", hook1);
      context.onHook("process:data", hook2);

      // Register events that just log
      const event1 = vi.fn().mockImplementation((data: string) => {
        eventResults.push(`event1-${data}`);
      });

      const event2 = vi.fn().mockImplementation((data: string) => {
        eventResults.push(`event2-${data}`);
      });

      context.onEvent("data:processed", event1);
      context.onEvent("data:processed", event2);

      // Trigger hook and emit event
      const hookResult = await context.trigger("process:data", "input");
      await context.emit("data:processed", hookResult);

      expect(hookResults).toEqual(["hook1-input", "hook2-transformed-input"]);
      expect(eventResults).toEqual([
        "event1-final-transformed-input",
        "event2-final-transformed-input",
      ]);
      expect(hookResult).toBe("final-transformed-input");
    });

    it("should maintain separate hook and event registries", async () => {
      const hookFn = vi.fn().mockResolvedValue("hook-result");
      const eventFn = vi.fn().mockResolvedValue(undefined);

      // Register same function for hooks and events with same name
      context.onHook("test", hookFn);
      context.onEvent("test", eventFn);

      const hookResult = await context.trigger("test", "data");
      await context.emit("test", "data");

      expect(hookFn).toHaveBeenCalledTimes(1);
      expect(eventFn).toHaveBeenCalledTimes(1);
      expect(hookResult).toBe("hook-result");
    });

    it("should handle hook registration order correctly", async () => {
      const hook1 = vi.fn().mockResolvedValue("result1");
      const hook2 = vi.fn().mockResolvedValue("result2");

      context.onHook("order:test", hook1);
      context.onHook("order:test", hook2);

      const result = await context.trigger("order:test", "input");

      expect(hook1).toHaveBeenCalledWith("input");
      expect(hook2).toHaveBeenCalledWith("result1");
      expect(result).toBe("result2");
    });

    it("should handle hook and event interaction in same flow", async () => {
      let processedData: string;

      // Hook to process data - using a mocked function that can return values
      const processHook = vi.fn().mockImplementation((data: string) => {
        processedData = `processed-${data}`;
        return processedData;
      });

      context.onHook("data:process", processHook);

      // Event to notify about processing
      const notificationEvent = vi.fn().mockImplementation((data: string) => {
        expect(data).toBe(processedData);
      });

      context.onEvent("data:processed", notificationEvent);

      // Process data through hook, then emit event
      const result = await context.trigger("data:process", "input");
      await context.emit("data:processed", result);

      expect(result).toBe("processed-input");
      expect(notificationEvent).toHaveBeenCalledWith("processed-input");
    });
  });

  describe("edge cases", () => {
    it("should handle empty hook/event names", async () => {
      const hook = vi.fn().mockResolvedValue("result");
      const event = vi.fn();

      context.onHook("", hook);
      context.onEvent("", event);

      const hookResult = await context.trigger("", "test");
      await context.emit("", "test");

      expect(hookResult).toBe("result");
      expect(hook).toHaveBeenCalledWith("test");
      expect(event).toHaveBeenCalledWith("test");
    });

    it("should handle special characters in hook/event names", async () => {
      const hook = vi.fn().mockResolvedValue("result");
      const event = vi.fn();

      const specialName = "@namespace/special-hook:v2.0";

      context.onHook(specialName, hook);
      context.onEvent(specialName, event);

      const hookResult = await context.trigger(specialName, "test");
      await context.emit(specialName, "test");

      expect(hookResult).toBe("result");
      expect(hook).toHaveBeenCalledWith("test");
      expect(event).toHaveBeenCalledWith("test");
    });

    it("should handle null/undefined payloads", async () => {
      const hook = vi.fn().mockResolvedValue("handled-null");
      const event = vi.fn();

      context.onHook("null:hook", hook);
      context.onEvent("null:event", event);

      const hookResult1 = await context.trigger("null:hook", null);
      const hookResult2 = await context.trigger("null:hook", undefined);

      await context.emit("null:event", null);
      await context.emit("null:event", undefined);

      expect(hookResult1).toBe("handled-null");
      expect(hookResult2).toBe("handled-null");
      expect(hook).toHaveBeenCalledWith(null);
      expect(hook).toHaveBeenCalledWith(undefined);
      expect(event).toHaveBeenCalledWith(null);
      expect(event).toHaveBeenCalledWith(undefined);
    });

    it("should handle synchronous hooks and events", async () => {
      const syncHook = vi.fn().mockReturnValue("sync-result");
      const syncEvent = vi.fn();

      context.onHook("sync:hook", syncHook);
      context.onEvent("sync:event", syncEvent);

      const hookResult = await context.trigger("sync:hook", "test");

      await context.emit("sync:event", "test");

      expect(hookResult).toBe("sync-result");
      expect(syncHook).toHaveBeenCalledWith("test");
      expect(syncEvent).toHaveBeenCalledWith("test");
    });
  });
});
