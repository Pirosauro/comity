import type { ModuleSetupContext } from "@comity/composition/setup";

import { describe, expect, it, vi } from "vitest";
import { createHttpContext } from "../create-context.js";

describe("createHttpContext", () => {
  it("should expose a bound service resolver", async () => {
    const resolve = vi.fn().mockReturnValue("service");
    const services = { resolve };
    const events = {};
    const ctx = { services, events } as unknown as ModuleSetupContext;

    const httpCtx = createHttpContext(ctx);

    const result = httpCtx.services.resolve("token");

    expect(resolve).toHaveBeenCalledWith("token");
    expect(result).toBe("service");
  });

  it("should expose the events bus", () => {
    const events = { emit: vi.fn() };
    const ctx = {
      services: { resolve: vi.fn() },
      events,
    } as unknown as ModuleSetupContext;

    const httpCtx = createHttpContext(ctx);

    expect(httpCtx.events).toBe(events);
  });
});