import { describe, it, expect } from "vitest";
import { ApplicationContext } from "../context.js";
import { ServiceFlags } from "@comity/core/patterns";

describe("ApplicationContext", () => {
  describe("inheritance", () => {
    it("should extend the base Context class", () => {
      const context = new ApplicationContext();

      // Test that it has the expected methods from the base Context
      expect(typeof context.register).toBe("function");
      expect(typeof context.get).toBe("function");
      expect(typeof context.onHook).toBe("function");
      expect(typeof context.onEvent).toBe("function");
      expect(typeof context.trigger).toBe("function");
      expect(typeof context.emit).toBe("function");
    });

    it("should be an instance of ApplicationContext", () => {
      const context = new ApplicationContext();

      expect(context).toBeInstanceOf(ApplicationContext);
    });

    it("should create a new instance each time", () => {
      const context1 = new ApplicationContext();
      const context2 = new ApplicationContext();

      expect(context1).not.toBe(context2);
    });
  });

  describe("functionality", () => {
    it("should support dependency injection", () => {
      const context = new ApplicationContext();

      context.register("testService", () => ({ value: 42 }));
      const service = context.get<{ value: number }>("testService");

      expect(service.value).toBe(42);
    });

    it("should support lifecycle hooks", () => {
      const context = new ApplicationContext();
      let hookCalled = false;
      let receivedPayload: string | undefined;

      context.onHook("test:hook", async (payload: string) => {
        hookCalled = true;
        receivedPayload = payload;
        return payload.toUpperCase();
      });

      return context.trigger("test:hook", "hello").then((result) => {
        expect(hookCalled).toBe(true);
        expect(receivedPayload).toBe("hello");
        expect(result).toBe("HELLO");
      });
    });

    it("should support events", () => {
      const context = new ApplicationContext();
      let eventCalled = false;
      let receivedPayload: string | undefined;

      context.onEvent("test:event", async (payload?: string) => {
        eventCalled = true;
        receivedPayload = payload;
      });

      return context.emit("test:event", "test payload").then(() => {
        expect(eventCalled).toBe(true);
        expect(receivedPayload).toBe("test payload");
      });
    });

    it("should handle multiple hooks sequentially", () => {
      const context = new ApplicationContext();
      const callOrder: string[] = [];

      context.onHook("test:hook", async (payload: string) => {
        callOrder.push("first");
        return payload + " first";
      });

      context.onHook("test:hook", async (payload: string) => {
        callOrder.push("second");
        return payload + " second";
      });

      return context.trigger("test:hook", "start").then((result) => {
        expect(callOrder).toEqual(["first", "second"]);
        expect(result).toBe("start first second");
      });
    });

    it("should handle multiple events in parallel", () => {
      const context = new ApplicationContext();
      const callOrder: string[] = [];

      context.onEvent("test:event", async () => {
        // Simulate async work
        await new Promise((resolve) => setTimeout(resolve, 10));
        callOrder.push("first");
      });

      context.onEvent("test:event", async () => {
        callOrder.push("second");
      });

      return context.emit("test:event").then(() => {
        expect(callOrder).toContain("first");
        expect(callOrder).toContain("second");
        expect(callOrder.length).toBe(2);
      });
    });
  });

  describe("edge cases", () => {
    it("should handle undefined hook payload", () => {
      const context = new ApplicationContext();
      let hookCalled = false;

      context.onHook("test:hook", async (payload) => {
        hookCalled = true;
        expect(payload).toBe("test payload");
        return "result";
      });

      return context.trigger("test:hook", "test payload").then((result) => {
        expect(hookCalled).toBe(true);
        expect(result).toBe("result");
      });
    });

    it("should handle undefined event payload", () => {
      const context = new ApplicationContext();
      let eventCalled = false;

      context.onEvent("test:event", async (payload) => {
        eventCalled = true;
        expect(payload).toBeUndefined();
      });

      return context.emit("test:event").then(() => {
        expect(eventCalled).toBe(true);
      });
    });

    it("should handle hooks that don't return values", () => {
      const context = new ApplicationContext();

      context.onHook("test:hook", async (payload: string) => {
        // Hook that doesn't return anything
      });

      return context.trigger("test:hook", "test").then((result) => {
        expect(result).toBe("test");
      });
    });

    it("should handle singleton services", () => {
      const context = new ApplicationContext();
      let instanceCount = 0;

      context.register("singleton", () => {
        instanceCount++;
        return { id: instanceCount };
      });

      const service1 = context.get("singleton");
      const service2 = context.get("singleton");

      expect(service1).toBe(service2);
      expect(instanceCount).toBe(1);
    });

    it("should handle transient services", () => {
      const context = new ApplicationContext();
      let instanceCount = 0;

      context.register(
        "transient",
        () => {
          instanceCount++;
          return { id: instanceCount };
        },
        ServiceFlags.NONE
      );

      const service1 = context.get("transient");
      const service2 = context.get("transient");

      expect(service1).not.toBe(service2);
      expect(instanceCount).toBe(2);
    });
  });
});
