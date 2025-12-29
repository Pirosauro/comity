import { describe, it, expect, vi } from "vitest";
import { createContext } from "../context.js";
import type { ModuleMeta } from "../../types.js";

describe("createContext", () => {
  it("should create context with no modules", async () => {
    const ctx = await createContext([]);
    expect(ctx).toBeDefined();
    expect(typeof ctx.onHook).toBe("function");
    expect(typeof ctx.emit).toBe("function");
  });

  it("should create context with modules", async () => {
    const modules: ModuleMeta[] = [
      {
        name: "test",
        version: "1.0.0",
        setup: async () => async (ctx) => {
          ctx.onHook("test-event", () => {});
        },
        dependsOn: [],
      },
    ];

    const ctx = await createContext(modules);
    expect(ctx).toBeDefined();
  });

  it("should pass options to module setup", async () => {
    const setupMock = vi.fn().mockResolvedValue(vi.fn());
    const modules: ModuleMeta[] = [
      {
        name: "test",
        version: "1.0.0",
        setup: setupMock,
        dependsOn: [],
      },
    ];

    const options = { test: { someOption: true } };
    await createContext(modules, options);

    expect(setupMock).toHaveBeenCalledWith({ someOption: true });
  });

  it("should call setup functions in dependency order", async () => {
    const callOrder: string[] = [];
    const modules: ModuleMeta[] = [
      {
        name: "dependent",
        version: "1.0.0",
        setup: async () => async () => {
          callOrder.push("dependent");
        },
        dependsOn: ["dependency"],
      },
      {
        name: "dependency",
        version: "1.0.0",
        setup: async () => async () => {
          callOrder.push("dependency");
        },
        dependsOn: [],
      },
    ];

    await createContext(modules);

    expect(callOrder).toEqual(["dependency", "dependent"]);
  });

  it("should validate module metadata", async () => {
    const invalidModule = {
      name: "invalid",
      // Missing required fields
    } as any;

    await expect(createContext([invalidModule])).rejects.toThrow();
  });
});
