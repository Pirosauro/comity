import { DiContainer } from "@comity/primitives/di";
import { EventBus, HookBus } from "@comity/primitives/lifecycle";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { InvalidLifecycleStateError } from "../errors/invalid-lifecycle-state.js";
import { Kernel } from "../kernel.js";

interface TestServices extends Record<string, unknown> {
  testService: string;
}

interface TestHooks extends Record<string, unknown> {
  testHook: string;
}

interface TestEvents extends Record<string, unknown> {
  testEvent: { id: number };
}

describe("Kernel", () => {
  let services: DiContainer<TestServices>;
  let events: EventBus<TestEvents>;
  let hooks: HookBus<TestHooks>;
  let kernel: Kernel<TestServices, TestEvents, TestHooks>;

  beforeEach(() => {
    services = new DiContainer();
    events = new EventBus<TestEvents>();
    hooks = new HookBus<TestHooks>();
    kernel = new Kernel({ services, events, hooks });
  });

  describe("constructor", () => {
    it("should create kernel with config", () => {
      expect(kernel).toBeInstanceOf(Kernel);
    });
  });

  describe("services getter", () => {
    it("should return services interface before sealing", () => {
      const svc = kernel.services;

      expect(typeof svc.define).toBe("function");
      expect(typeof svc.resolve).toBe("function");
    });

    it("should allow defining services before sealing", () => {
      kernel.services.define("test", () => "value");

      kernel.seal();

      const result = kernel.services.resolve("test");
      expect(result).toBe("value");
    });

    it("should throw when defining services after sealing", () => {
      kernel.seal();

      expect(() => kernel.services.define("test", () => "value")).toThrow(
        InvalidLifecycleStateError
      );
    });

    it("should throw when resolving services before sealing", () => {
      kernel.services.define("test", () => "value");

      expect(() => kernel.services.resolve("test")).toThrow(InvalidLifecycleStateError);
    });

    it("should allow resolving services after sealing", () => {
      kernel.services.define("test", () => "value");
      kernel.seal();

      const result = kernel.services.resolve("test");
      expect(result).toBe("value");
    });
  });

  describe("events getter", () => {
    it("should return events interface", () => {
      const evt = kernel.events;

      expect(typeof evt.subscribe).toBe("function");
      expect(typeof evt.emit).toBe("function");
    });

    it("should allow subscribing to events before sealing", () => {
      const handler = vi.fn();
      kernel.events.subscribe("testEvent", handler);

      kernel.seal();

      kernel.events.emit("testEvent", { id: 1 });
      expect(handler).toHaveBeenCalledWith({ id: 1 });
    });

    it("should throw when subscribing after sealing", () => {
      kernel.seal();

      expect(() => kernel.events.subscribe("testEvent", vi.fn())).toThrow(
        InvalidLifecycleStateError
      );
    });

    it("should throw when emitting before sealing", () => {
      expect(() => kernel.events.emit("testEvent", { id: 1 })).toThrow(InvalidLifecycleStateError);
    });

    it("should allow emitting after sealing", async () => {
      const handler = vi.fn();
      kernel.events.subscribe("testEvent", handler);
      kernel.seal();

      await kernel.events.emit("testEvent", { id: 1 });
      expect(handler).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe("hooks getter", () => {
    it("should return hooks interface", () => {
      const hks = kernel.hooks;

      expect(typeof hks.define).toBe("function");
      expect(typeof hks.execute).toBe("function");
    });

    it("should allow defining hooks before sealing", async () => {
      const handler = vi.fn((value: string) => value + "!");

      kernel.hooks.define("testHook", handler);
      kernel.seal();

      const result = await kernel.hooks.execute("testHook", "test");
      expect(result).toBe("test!");
    });

    it("should throw when defining hooks after sealing", () => {
      kernel.seal();

      expect(() => kernel.hooks.define("testHook", vi.fn())).toThrow(InvalidLifecycleStateError);
    });

    it("should throw when executing hooks before sealing", () => {
      kernel.hooks.define("testHook", vi.fn());

      expect(() => kernel.hooks.execute("testHook", "test")).toThrow(InvalidLifecycleStateError);
    });

    it("should allow executing hooks after sealing", async () => {
      const handler = vi.fn((value: string) => value.toUpperCase());

      kernel.hooks.define("testHook", handler);
      kernel.seal();

      const result = await kernel.hooks.execute("testHook", "hello");
      expect(result).toBe("HELLO");
    });
  });

  describe("seal", () => {
    it("should seal the kernel", () => {
      const result = kernel.seal();

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.value).toBe("sealed");
      }
    });

    it("should allow operations after sealing", () => {
      kernel.services.define("test", () => "value");
      kernel.events.subscribe("testEvent", vi.fn());
      kernel.hooks.define("testHook", vi.fn());

      kernel.seal();

      expect(kernel.services.resolve("test")).toBe("value");
    });
  });

  describe("createModuleSetupContext", () => {
    it("should return module setup context", () => {
      const ctx = kernel.createModuleSetupContext();

      expect(ctx).toHaveProperty("services");
      expect(ctx).toHaveProperty("events");
      expect(ctx).toHaveProperty("hooks");
      expect(ctx.services).toBe(kernel.services);
      expect(ctx.events).toBe(kernel.events);
      expect(ctx.hooks).toBe(kernel.hooks);
    });
  });

  describe("start", () => {
    it("should start the kernel", () => {
      kernel.seal();

      const result = kernel.start();

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.value).toBe("running");
      }
    });

    it("should call kernelStarted event when emitter is provided", () => {
      const emitter = {
        kernelSealed: vi.fn(),
        kernelStarted: vi.fn(),
        kernelStopped: vi.fn(),
      };

      const kernelWithEmitter = new Kernel({ services, events, hooks }, emitter);
      kernelWithEmitter.seal();
      kernelWithEmitter.start();

      expect(emitter.kernelStarted).toHaveBeenCalledTimes(1);
    });

    it("should not call kernelStarted event on failure", () => {
      const emitter = {
        kernelSealed: vi.fn(),
        kernelStarted: vi.fn(),
        kernelStopped: vi.fn(),
      };

      const kernelWithEmitter = new Kernel({ services, events, hooks }, emitter);
      // Don't seal, so start fails

      kernelWithEmitter.start();

      expect(emitter.kernelStarted).not.toHaveBeenCalled();
    });
  });

  describe("stop", () => {
    it("should stop the kernel", () => {
      kernel.seal();
      kernel.start();

      const result = kernel.stop();

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.value).toBe("sealed");
      }
    });

    it("should call kernelStopped event when emitter is provided", () => {
      const emitter = {
        kernelSealed: vi.fn(),
        kernelStarted: vi.fn(),
        kernelStopped: vi.fn(),
      };

      const kernelWithEmitter = new Kernel({ services, events, hooks }, emitter);
      kernelWithEmitter.seal();
      kernelWithEmitter.start();
      kernelWithEmitter.stop();

      expect(emitter.kernelStopped).toHaveBeenCalledTimes(1);
    });

    it("should not call kernelStopped event on failure", () => {
      const emitter = {
        kernelSealed: vi.fn(),
        kernelStarted: vi.fn(),
        kernelStopped: vi.fn(),
      };

      const kernelWithEmitter = new Kernel({ services, events, hooks }, emitter);
      // Don't start, so stop fails

      kernelWithEmitter.stop();

      expect(emitter.kernelStopped).not.toHaveBeenCalled();
    });
  });

  describe("seal with emitter", () => {
    it("should call kernelSealed event when emitter is provided", () => {
      const emitter = {
        kernelSealed: vi.fn(),
        kernelStarted: vi.fn(),
        kernelStopped: vi.fn(),
      };

      const kernelWithEmitter = new Kernel({ services, events, hooks }, emitter);
      kernelWithEmitter.seal();

      expect(emitter.kernelSealed).toHaveBeenCalledTimes(1);
    });

    it("should work without emitter", () => {
      const kernelNoEmitter = new Kernel({ services, events, hooks });
      const result = kernelNoEmitter.seal();

      expect(result.success).toBe(true);
    });
  });
});
