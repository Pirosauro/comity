import { beforeEach, describe, expect, it, vi } from "vitest";
import { HydrationContext } from "../context.js";

describe("HydrationContext", () => {
  let mockEvents: any;
  let mockRegistry: any;

  beforeEach(() => {
    mockEvents = {
      emit: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
    };

    mockRegistry = {
      get: vi.fn(),
      register: vi.fn(),
      list: vi.fn(),
      clear: vi.fn(),
    };
  });

  describe("constructor", () => {
    it("should create a context with provided options", () => {
      const options = {
        events: mockEvents,
        registry: mockRegistry,
      };

      const ctx = new HydrationContext(options);

      expect(ctx.events).toBe(mockEvents);
      expect(ctx.registry).toBe(mockRegistry);
    });
  });

  describe("events getter", () => {
    it("should return the events instance", () => {
      const options = {
        events: mockEvents,
        registry: mockRegistry,
      };

      const ctx = new HydrationContext(options);

      expect(ctx.events).toBe(mockEvents);
    });
  });

  describe("registry getter", () => {
    it("should return the registry instance", () => {
      const options = {
        events: mockEvents,
        registry: mockRegistry,
      };

      const ctx = new HydrationContext(options);

      expect(ctx.registry).toBe(mockRegistry);
    });
  });
});