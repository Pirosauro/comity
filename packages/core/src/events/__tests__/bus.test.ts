import { beforeEach, describe, expect, it, vi } from "vitest";
import { InternalError } from "../../errors/internal.js";
import { EventBus } from "../bus.js";

interface TestEvents {
  userCreated: { id: string; name: string };
  userDeleted: { id: string };
  dataUpdated: { key: string; value: unknown };
}

describe("EventBus", () => {
  let bus: EventBus<TestEvents>;

  beforeEach(() => {
    bus = new EventBus<TestEvents>();
  });

  describe("constructor", () => {
    it("should create bus without options", () => {
      const bus = new EventBus<TestEvents>();
      expect(bus).toBeInstanceOf(EventBus);
    });

    it("should create bus with error handler", () => {
      const errorHandler = vi.fn();
      const bus = new EventBus<TestEvents>({ errorHandler });
      expect(bus).toBeInstanceOf(EventBus);
    });
  });

  describe("subscribe", () => {
    it("should add a handler for an event", () => {
      const handler = vi.fn();

      bus.subscribe("userCreated", handler);

      // Test via emit
    });

    it("should allow multiple handlers for the same event", () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      bus.subscribe("userCreated", handler1);
      bus.subscribe("userCreated", handler2);

      // Test via emit
    });
  });

  describe("emit", () => {
    it("should do nothing when no handlers are subscribed", async () => {
      await expect(
        bus.emit("userCreated", { id: "1", name: "Alice" }),
      ).resolves.toBeUndefined();
    });

    it("should execute a single handler", async () => {
      const handler = vi.fn();

      bus.subscribe("userCreated", handler);

      await bus.emit("userCreated", { id: "1", name: "Alice" });

      expect(handler).toHaveBeenCalledWith({ id: "1", name: "Alice" });
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it("should execute multiple handlers in parallel", async () => {
      const handler1 = vi.fn(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
      });
      const handler2 = vi.fn(async () => {
        await new Promise((resolve) => setTimeout(resolve, 5));
      });

      bus.subscribe("userCreated", handler1);
      bus.subscribe("userCreated", handler2);

      const start = Date.now();
      await bus.emit("userCreated", { id: "1", name: "Alice" });
      const end = Date.now();

      expect(handler1).toHaveBeenCalledWith({ id: "1", name: "Alice" });
      expect(handler2).toHaveBeenCalledWith({ id: "1", name: "Alice" });
      // Should complete in less than 20ms if parallel
      expect(end - start).toBeLessThan(20);
    });

    it("should handle different event types", async () => {
      const userCreatedHandler = vi.fn();
      const userDeletedHandler = vi.fn();
      const dataUpdatedHandler = vi.fn();

      bus.subscribe("userCreated", userCreatedHandler);
      bus.subscribe("userDeleted", userDeletedHandler);
      bus.subscribe("dataUpdated", dataUpdatedHandler);

      await bus.emit("userCreated", { id: "1", name: "Alice" });
      await bus.emit("userDeleted", { id: "1" });
      await bus.emit("dataUpdated", { key: "test", value: 42 });

      expect(userCreatedHandler).toHaveBeenCalledWith({
        id: "1",
        name: "Alice",
      });
      expect(userDeletedHandler).toHaveBeenCalledWith({ id: "1" });
      expect(dataUpdatedHandler).toHaveBeenCalledWith({
        key: "test",
        value: 42,
      });
    });

    it("should handle async handlers", async () => {
      const handler = vi.fn(async (payload) => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return payload;
      });

      bus.subscribe("userCreated", handler);

      await bus.emit("userCreated", { id: "1", name: "Alice" });

      expect(handler).toHaveBeenCalledWith({ id: "1", name: "Alice" });
    });

    it("should call error handler when handler throws", async () => {
      const errorHandler = vi.fn();
      const bus = new EventBus<TestEvents>({ errorHandler });

      const failingHandler = vi.fn(() => {
        throw new Error("Handler failed");
      });

      bus.subscribe("userCreated", failingHandler);

      await bus.emit("userCreated", { id: "1", name: "Alice" });

      expect(errorHandler).toHaveBeenCalledTimes(1);
      const error = errorHandler.mock.calls[0][0];
      expect(error).toBeInstanceOf(InternalError);
      expect(error.message).toBe("Event handler failed");
      expect(error.meta.event).toBe("userCreated");
      expect(error.cause).toBeInstanceOf(Error);
      expect((error.cause as Error).message).toBe("Handler failed");
    });

    it("should continue executing other handlers when one fails", async () => {
      const errorHandler = vi.fn();
      const bus = new EventBus<TestEvents>({ errorHandler });

      const failingHandler = vi.fn(() => {
        throw new Error("Fail");
      });
      const successHandler = vi.fn();

      bus.subscribe("userCreated", failingHandler);
      bus.subscribe("userCreated", successHandler);

      await bus.emit("userCreated", { id: "1", name: "Alice" });

      expect(errorHandler).toHaveBeenCalledTimes(1);
      expect(successHandler).toHaveBeenCalledTimes(1);
    });

    it("should not call error handler when no error occurs", async () => {
      const errorHandler = vi.fn();
      const bus = new EventBus<TestEvents>({ errorHandler });

      const handler = vi.fn();

      bus.subscribe("userCreated", handler);

      await bus.emit("userCreated", { id: "1", name: "Alice" });

      expect(errorHandler).not.toHaveBeenCalled();
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });
});
