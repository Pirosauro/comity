import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConflictError } from "../../errors/conflict.js";
import { NotFoundError } from "../../errors/not-found.js";
import { DiContainer } from "../container.js";

interface TestServices extends Record<string | symbol, unknown> {
  logger: { log: (message: string) => void };
  userService: { getUser: (id: string) => string };
  config: { apiUrl: string };
}

describe("DiContainer", () => {
  let container: DiContainer<TestServices>;

  beforeEach(() => {
    container = new DiContainer<TestServices>();
  });

  describe("define", () => {
    it("should register a service factory", () => {
      const factory = vi.fn(() => ({ log: vi.fn() }));

      container.define("logger", factory);

      expect(factory).not.toHaveBeenCalled();
    });

    it("should throw ConflictError when registering duplicate service", () => {
      const factory1 = vi.fn(() => ({ log: vi.fn() }));
      const factory2 = vi.fn(() => ({ log: vi.fn() }));

      container.define("logger", factory1);

      expect(() => container.define("logger", factory2)).toThrow(ConflictError);
      expect(() => container.define("logger", factory2)).toThrow(
        "Service already registered",
      );
    });

    it("should allow registering different services", () => {
      const loggerFactory = vi.fn(() => ({ log: vi.fn() }));
      const userServiceFactory = vi.fn(() => ({ getUser: vi.fn() }));

      container.define("logger", loggerFactory);
      container.define("userService", userServiceFactory);

      expect(loggerFactory).not.toHaveBeenCalled();
      expect(userServiceFactory).not.toHaveBeenCalled();
    });
  });

  describe("resolve", () => {
    it("should throw NotFoundError for unregistered service", () => {
      expect(() => container.resolve("logger")).toThrow(NotFoundError);
      expect(() => container.resolve("logger")).toThrow(
        "Service not registered",
      );
    });

    it("should resolve a service using its factory", () => {
      const loggerInstance = { log: vi.fn() };
      const factory = vi.fn(() => loggerInstance);

      container.define("logger", factory);

      const resolved = container.resolve("logger");

      expect(factory).toHaveBeenCalledTimes(1);
      expect(resolved).toBe(loggerInstance);
    });

    it("should cache resolved instances", () => {
      const factory = vi.fn(() => ({ log: vi.fn() }));

      container.define("logger", factory);

      const resolved1 = container.resolve("logger");
      const resolved2 = container.resolve("logger");
      const resolved3 = container.resolve("logger");

      expect(factory).toHaveBeenCalledTimes(1);
      expect(resolved1).toBe(resolved2);
      expect(resolved2).toBe(resolved3);
    });

    it("should resolve different services independently", () => {
      const loggerFactory = vi.fn(() => ({ log: vi.fn() }));
      const userServiceFactory = vi.fn(() => ({
        getUser: vi.fn(() => "user"),
      }));

      container.define("logger", loggerFactory);
      container.define("userService", userServiceFactory);

      const logger = container.resolve("logger");
      const userService = container.resolve("userService");

      expect(loggerFactory).toHaveBeenCalledTimes(1);
      expect(userServiceFactory).toHaveBeenCalledTimes(1);
      expect(logger).toHaveProperty("log");
      expect(userService).toHaveProperty("getUser");
    });

    it("should handle factory dependencies", () => {
      const loggerInstance = { log: vi.fn() };
      const loggerFactory = vi.fn(() => loggerInstance);
      const userServiceFactory = vi.fn(() => ({
        getUser: (id: string) => {
          loggerInstance.log(`Getting user ${id}`);
          return `user-${id}`;
        },
      }));

      container.define("logger", loggerFactory);
      container.define("userService", userServiceFactory);

      const userService = container.resolve("userService");
      const result = userService.getUser("123");

      expect(result).toBe("user-123");
      expect(loggerInstance.log).toHaveBeenCalledWith("Getting user 123");
    });

    it("should handle symbol keys", () => {
      const symbolKey = Symbol("testService");
      const container = new DiContainer<Record<symbol, unknown>>();
      const factory = vi.fn(() => "symbol value");

      container.define(symbolKey, factory);

      const resolved = container.resolve(symbolKey);

      expect(resolved).toBe("symbol value");
      expect(factory).toHaveBeenCalledTimes(1);
    });

    it("should handle factory that returns undefined", () => {
      const factory = vi.fn(() => undefined);

      container.define("config" as keyof TestServices, factory);

      const resolved = container.resolve("config" as keyof TestServices);

      expect(resolved).toBeUndefined();
      expect(factory).toHaveBeenCalledTimes(1);
    });
  });
});
