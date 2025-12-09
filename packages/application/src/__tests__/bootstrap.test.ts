import type { ApplicationModuleMeta } from "../types.js";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Hono } from "hono";
import { createApplication } from "../bootstrap.js";

// Helper function to create a basic module for testing
const createModule = (
  name: string,
  dependsOn?: string[],
  setupFn?: (ctx: any) => Promise<void>
): ApplicationModuleMeta => ({
  name,
  version: "1.0.0",
  dependsOn,
  setup: (options?: any) =>
    Promise.resolve(setupFn || (async (ctx: any) => {})),
});

describe("createApplication", () => {
  let app: Hono;

  beforeEach(() => {
    app = new Hono();
  });

  describe("basic functionality", () => {
    it("should return the same Hono app instance", async () => {
      const result = await createApplication(app, []);

      expect(result).toBe(app);
    });

    it("should initialize with empty modules array", async () => {
      const result = await createApplication(app, []);

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Hono);
    });

    it("should initialize with single module", async () => {
      const modules = [createModule("test-module")];

      const result = await createApplication(app, modules);

      expect(result).toBe(app);
    });

    it("should initialize multiple modules", async () => {
      const modules = [
        createModule("module-a"),
        createModule("module-b"),
        createModule("module-c"),
      ];

      const result = await createApplication(app, modules);

      expect(result).toBe(app);
    });
  });

  describe("module setup execution", () => {
    it("should call module setup function", async () => {
      const setupSpy = vi.fn(async (ctx: any) => {});
      const modules = [createModule("test", undefined, setupSpy)];

      await createApplication(app, modules);

      expect(setupSpy).toHaveBeenCalledTimes(1);
      expect(setupSpy).toHaveBeenCalledWith(expect.any(Object));
    });

    it("should pass options to module setup", async () => {
      const setupFn = vi.fn();
      const module: ApplicationModuleMeta = {
        name: "test-module",
        version: "1.0.0",
        setup: (options?: any) => {
          setupFn(options);
          return Promise.resolve(async (ctx: any) => {});
        },
      };

      const options = {
        "test-module": { key: "value" },
      };

      await createApplication(app, [module], options);

      expect(setupFn).toHaveBeenCalledWith({ key: "value" });
    });

    it("should execute modules in dependency order", async () => {
      const executionOrder: string[] = [];

      const modules = [
        createModule("app", ["auth"], async () => {
          executionOrder.push("app");
        }),
        createModule("auth", ["database"], async () => {
          executionOrder.push("auth");
        }),
        createModule("database", undefined, async () => {
          executionOrder.push("database");
        }),
      ];

      await createApplication(app, modules);

      expect(executionOrder).toEqual(["database", "auth", "app"]);
    });

    it("should call setup functions with application context", async () => {
      let contextReceived: any = null;

      const modules = [
        createModule("test", undefined, async (ctx) => {
          contextReceived = ctx;
        }),
      ];

      await createApplication(app, modules);

      expect(contextReceived).toBeDefined();
      expect(typeof contextReceived.onHook).toBe("function");
      expect(typeof contextReceived.trigger).toBe("function");
    });
  });

  describe("lifecycle hooks", () => {
    it("should trigger @comity/application:initialized hook", async () => {
      const hookSpy = vi.fn(async (payload: any) => payload);

      const modules = [
        createModule("test", undefined, async (ctx: any) => {
          ctx.onHook("@comity/application:initialized", hookSpy);
        }),
      ];

      await createApplication(app, modules);

      expect(hookSpy).toHaveBeenCalledTimes(1);
      expect(hookSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          get: expect.any(Function),
          post: expect.any(Function),
          use: expect.any(Function),
        })
      );
    });

    it("should provide bound Hono methods to hook", async () => {
      let hookPayload: any = null;

      const modules = [
        createModule("test", undefined, async (ctx: any) => {
          ctx.onHook(
            "@comity/application:initialized",
            async (payload: any) => {
              hookPayload = payload;
              return payload;
            }
          );
        }),
      ];

      await createApplication(app, modules);

      expect(hookPayload).toBeDefined();
      expect(hookPayload.get).toBeDefined();
      expect(hookPayload.post).toBeDefined();
      expect(hookPayload.put).toBeDefined();
      expect(hookPayload.delete).toBeDefined();
      expect(hookPayload.use).toBeDefined();
    });
  });

  describe("error handling", () => {
    it("should throw error for invalid module metadata", async () => {
      const invalidModule = {
        name: "", // Invalid: empty string
        version: "1.0.0",
        setup: () => Promise.resolve(async () => {}),
      } as any;

      await expect(createApplication(app, [invalidModule])).rejects.toThrow();
    });

    it("should throw error for invalid version format", async () => {
      const invalidModule = {
        name: "test",
        version: "1.0", // Invalid: not semantic versioning
        setup: () => Promise.resolve(async () => {}),
      } as any;

      await expect(createApplication(app, [invalidModule])).rejects.toThrow();
    });

    it("should throw error when module setup throws", async () => {
      const modules = [
        createModule("test", undefined, async () => {
          throw new Error("Setup failed");
        }),
      ];

      await expect(createApplication(app, modules)).rejects.toThrow(
        "Setup failed"
      );
    });

    it("should throw error for circular dependencies", async () => {
      const modules = [
        createModule("module-a", ["module-b"]),
        createModule("module-b", ["module-a"]),
      ];

      await expect(createApplication(app, modules)).rejects.toThrow(
        "Cycle detected"
      );
    });

    it("should throw error for missing dependencies", async () => {
      const modules = [createModule("app", ["nonexistent"])];

      await expect(createApplication(app, modules)).rejects.toThrow();
    });
  });

  describe("module options", () => {
    it("should pass undefined when no options provided", async () => {
      const setupFn = vi.fn();
      const module: ApplicationModuleMeta = {
        name: "test",
        version: "1.0.0",
        setup: (options?: any) => {
          setupFn(options);
          return Promise.resolve(async () => {});
        },
      };

      await createApplication(app, [module]);

      expect(setupFn).toHaveBeenCalledWith(undefined);
    });

    it("should handle empty options object", async () => {
      const setupFn = vi.fn();
      const module: ApplicationModuleMeta = {
        name: "test",
        version: "1.0.0",
        setup: (options?: any) => {
          setupFn(options);
          return Promise.resolve(async () => {});
        },
      };

      await createApplication(app, [module], {});

      expect(setupFn).toHaveBeenCalledWith(undefined);
    });

    it("should pass module-specific options correctly", async () => {
      const setupFn = vi.fn();
      const module: ApplicationModuleMeta = {
        name: "database",
        version: "1.0.0",
        setup: (options?: any) => {
          setupFn(options);
          return Promise.resolve(async () => {});
        },
      };

      const options = {
        database: {
          host: "localhost",
          port: 5432,
        },
      };

      await createApplication(app, [module], options);

      expect(setupFn).toHaveBeenCalledWith({
        host: "localhost",
        port: 5432,
      });
    });
  });

  describe("complex scenarios", () => {
    it("should handle multiple modules with complex dependencies", async () => {
      const executionOrder: string[] = [];

      const modules = [
        createModule("frontend", ["api", "auth"], async () => {
          executionOrder.push("frontend");
        }),
        createModule("api", ["database"], async () => {
          executionOrder.push("api");
        }),
        createModule("auth", ["database"], async () => {
          executionOrder.push("auth");
        }),
        createModule("database", undefined, async () => {
          executionOrder.push("database");
        }),
      ];

      await createApplication(app, modules);

      expect(executionOrder[0]).toBe("database");
      expect(executionOrder[3]).toBe("frontend");
      expect(executionOrder.indexOf("api")).toBeLessThan(
        executionOrder.indexOf("frontend")
      );
      expect(executionOrder.indexOf("auth")).toBeLessThan(
        executionOrder.indexOf("frontend")
      );
    });

    it("should allow modules to register multiple hooks", async () => {
      const hook1Spy = vi.fn();
      const hook2Spy = vi.fn();

      const modules = [
        createModule("test", undefined, async (ctx: any) => {
          ctx.onHook("@comity/application:initialized", hook1Spy);
          ctx.onHook("@comity/application:initialized", hook2Spy);
        }),
      ];

      await createApplication(app, modules);

      expect(hook1Spy).toHaveBeenCalled();
      expect(hook2Spy).toHaveBeenCalled();
    });
  });
});
