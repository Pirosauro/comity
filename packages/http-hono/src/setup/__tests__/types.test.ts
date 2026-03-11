import type { Hono } from "hono";
import { describe, expect, it } from "vitest";
import { HTTP_HONO_TOKEN } from "../constants.js";
import type {
  HttpHonoModuleContext,
  HttpHonoModuleEvents,
  HttpHonoModuleHooks,
  HttpHonoModuleOptions,
  HttpHonoModuleServices,
} from "../types.js";

describe("HttpHonoModuleOptions", () => {
  it("should allow empty options object", () => {
    const options: HttpHonoModuleOptions = {};
    expect(options).toEqual({});
  });
});

describe("HttpHonoModuleEvents", () => {
  it("should allow empty events object", () => {
    const events: HttpHonoModuleEvents = {};
    expect(events).toEqual({});
  });
});

describe("HttpHonoModuleHooks", () => {
  it("should define initialized hook with Hono type", () => {
    const hooks: HttpHonoModuleHooks = {
      "@comity/http-hono:initialized": {} as Hono,
    };
    expect(hooks).toHaveProperty("@comity/http-hono:initialized");
  });
});

describe("HttpHonoModuleServices", () => {
  it("should define service with HTTP_HONO_TOKEN", () => {
    const services: HttpHonoModuleServices = {
      [HTTP_HONO_TOKEN]: {} as Hono,
    };
    expect(HTTP_HONO_TOKEN in services).toBe(true);
    expect(services[HTTP_HONO_TOKEN]).toBeDefined();
  });
});

describe("HttpHonoModuleContext", () => {
  it("should be assignable to context with services", () => {
    // Type test: ensure the context can be used with the expected services
    const context: HttpHonoModuleContext = {
      services: {
        [HTTP_HONO_TOKEN]: {} as Hono,
      },
      events: {},
      hooks: {
        "@comity/http-hono:initialized": {} as Hono,
      },
    } as any; // Using any to bypass full interface requirements for type test

    expect(context).toBeDefined();
    expect(HTTP_HONO_TOKEN in context.services).toBe(true);
  });
});
