import { describe, it, expect, beforeEach, vi } from "vitest";
import { Container, ServiceFlags } from "../container.js";
import { NotFoundError } from "../../errors/not-found.js";

describe("ServiceFlags", () => {
  it("should have correct bitwise flag values", () => {
    expect(ServiceFlags.NONE).toBe(0);
    expect(ServiceFlags.SINGLETON).toBe(1);
  });
});

describe("Container", () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
  });

  describe("register()", () => {
    it("should register a service with default singleton flags", () => {
      const factory = vi.fn(() => ({ id: "test" }));

      container.register("testService", factory);

      expect(container.has("testService")).toBe(true);
    });

    it("should register a service with explicit singleton flags", () => {
      const factory = vi.fn(() => ({ id: "test" }));

      container.register("testService", factory, ServiceFlags.SINGLETON);

      expect(container.has("testService")).toBe(true);
    });

    it("should register a service with transient flags", () => {
      const factory = vi.fn(() => ({ id: "test" }));

      container.register("testService", factory, ServiceFlags.NONE);

      expect(container.has("testService")).toBe(true);
    });

    it("should throw error when registering duplicate service", () => {
      const factory = vi.fn(() => ({ id: "test" }));

      container.register("testService", factory);

      expect(() => {
        container.register("testService", factory);
      }).toThrow('Service "testService" is already registered');
    });

    it("should register multiple different services", () => {
      const factory1 = vi.fn(() => ({ id: "test1" }));
      const factory2 = vi.fn(() => ({ id: "test2" }));

      container.register("service1", factory1);
      container.register("service2", factory2);

      expect(container.has("service1")).toBe(true);
      expect(container.has("service2")).toBe(true);
    });
  });

  describe("get()", () => {
    it("should throw NotFoundError for unregistered service", () => {
      expect(() => {
        container.get("nonexistent");
      }).toThrow(NotFoundError);
      expect(() => {
        container.get("nonexistent");
      }).toThrow('Service "nonexistent" is not registered');
    });

    it("should create and return singleton service instance", () => {
      const mockInstance = { id: "singleton" };
      const factory = vi.fn(() => mockInstance);

      container.register("singletonService", factory, ServiceFlags.SINGLETON);

      const instance1 = container.get("singletonService");
      const instance2 = container.get("singletonService");

      expect(instance1).toBe(mockInstance);
      expect(instance2).toBe(mockInstance);
      expect(instance1).toBe(instance2);
      expect(factory).toHaveBeenCalledTimes(1);
    });

    it("should create new transient service instance on each call", () => {
      let counter = 0;
      const factory = vi.fn(() => ({ id: ++counter }));

      container.register("transientService", factory, ServiceFlags.NONE);

      const instance1 = container.get("transientService");
      const instance2 = container.get("transientService");

      expect(instance1).toEqual({ id: 1 });
      expect(instance2).toEqual({ id: 2 });
      expect(instance1).not.toBe(instance2);
      expect(factory).toHaveBeenCalledTimes(2);
    });

    it("should use singleton behavior by default", () => {
      const mockInstance = { id: "default-singleton" };
      const factory = vi.fn(() => mockInstance);

      container.register("defaultService", factory);

      const instance1 = container.get("defaultService");
      const instance2 = container.get("defaultService");

      expect(instance1).toBe(instance2);
      expect(factory).toHaveBeenCalledTimes(1);
    });

    it("should return correct type with generic type parameter", () => {
      interface TestService {
        name: string;
        getValue(): number;
      }

      const testService: TestService = {
        name: "test",
        getValue: () => 42,
      };

      container.register("typedService", () => testService);

      const instance = container.get<TestService>("typedService");

      expect(instance.name).toBe("test");
      expect(instance.getValue()).toBe(42);
    });

    it("should handle factory functions with closures", () => {
      const contextValue = "captured";
      const factory = vi.fn(() => ({ context: contextValue }));

      container.register("closureService", factory);

      const instance = container.get<{ context: string }>("closureService");

      expect(instance.context).toBe("captured");
    });

    it("should handle factory functions that throw errors", () => {
      const factory = vi.fn(() => {
        throw new Error("Factory error");
      });

      container.register("errorService", factory);

      expect(() => {
        container.get("errorService");
      }).toThrow("Factory error");
    });
  });

  describe("has()", () => {
    it("should return true for registered services", () => {
      const factory = vi.fn(() => ({ id: "test" }));

      container.register("testService", factory);

      expect(container.has("testService")).toBe(true);
    });

    it("should return false for unregistered services", () => {
      expect(container.has("nonexistent")).toBe(false);
    });

    it("should return true even if singleton service not yet instantiated", () => {
      const factory = vi.fn(() => ({ id: "test" }));

      container.register("testService", factory, ServiceFlags.SINGLETON);

      expect(container.has("testService")).toBe(true);
      expect(factory).not.toHaveBeenCalled();
    });

    it("should return true for both singleton and transient services", () => {
      container.register("singleton", () => ({}), ServiceFlags.SINGLETON);
      container.register("transient", () => ({}), ServiceFlags.NONE);

      expect(container.has("singleton")).toBe(true);
      expect(container.has("transient")).toBe(true);
    });
  });

  describe("clear()", () => {
    it("should clear cached singleton instances", () => {
      let counter = 0;
      const factory = vi.fn(() => ({ id: ++counter }));

      container.register("singletonService", factory, ServiceFlags.SINGLETON);

      const instance1 = container.get<{ id: number }>("singletonService");

      expect(instance1.id).toBe(1);
      expect(factory).toHaveBeenCalledTimes(1);

      container.clear();

      const instance2 = container.get<{ id: number }>("singletonService");

      expect(instance2.id).toBe(2);
      expect(factory).toHaveBeenCalledTimes(2);
      expect(instance1).not.toBe(instance2);
    });

    it("should not affect service registrations", () => {
      const factory = vi.fn(() => ({ id: "test" }));

      container.register("testService", factory);

      expect(container.has("testService")).toBe(true);

      container.clear();

      expect(container.has("testService")).toBe(true);
    });

    it("should not affect transient services", () => {
      let counter = 0;
      const factory = vi.fn(() => ({ id: ++counter }));

      container.register("transientService", factory, ServiceFlags.NONE);

      const instance1 = container.get<{ id: number }>("transientService");

      container.clear();

      const instance2 = container.get<{ id: number }>("transientService");

      expect(instance1.id).toBe(1);
      expect(instance2.id).toBe(2);
      expect(factory).toHaveBeenCalledTimes(2);
    });

    it("should clear multiple singleton instances", () => {
      const factory1 = vi.fn(() => ({ service: "first" }));
      const factory2 = vi.fn(() => ({ service: "second" }));

      container.register("service1", factory1, ServiceFlags.SINGLETON);
      container.register("service2", factory2, ServiceFlags.SINGLETON);

      container.get("service1");
      container.get("service2");

      expect(factory1).toHaveBeenCalledTimes(1);
      expect(factory2).toHaveBeenCalledTimes(1);

      container.clear();

      container.get("service1");
      container.get("service2");

      expect(factory1).toHaveBeenCalledTimes(2);
      expect(factory2).toHaveBeenCalledTimes(2);
    });

    it("should handle clear on empty container", () => {
      expect(() => {
        container.clear();
      }).not.toThrow();
    });
  });

  describe("integration scenarios", () => {
    it("should handle complex service dependency scenario", () => {
      // Mock services for integration test
      class Logger {
        constructor(public level: string) {}
      }

      class Database {
        constructor(public connectionString: string) {}
      }

      class UserRepository {
        constructor(public db: Database, public logger: Logger) {}
      }

      // Register services with dependencies captured in closures
      container.register(
        "logger",
        () => new Logger("info"),
        ServiceFlags.SINGLETON
      );
      container.register(
        "database",
        () => new Database("test://localhost"),
        ServiceFlags.SINGLETON
      );

      // Register service that depends on other services
      container.register(
        "userRepo",
        () => {
          const db = container.get<Database>("database");
          const logger = container.get<Logger>("logger");
          return new UserRepository(db, logger);
        },
        ServiceFlags.SINGLETON
      );

      const userRepo1 = container.get<UserRepository>("userRepo");
      const userRepo2 = container.get<UserRepository>("userRepo");

      expect(userRepo1).toBe(userRepo2); // Singleton behavior
      expect(userRepo1.db).toBeInstanceOf(Database);
      expect(userRepo1.logger).toBeInstanceOf(Logger);
      expect(userRepo1.db.connectionString).toBe("test://localhost");
      expect(userRepo1.logger.level).toBe("info");
    });

    it("should handle mixed singleton and transient services", () => {
      container.register(
        "config",
        () => ({ version: "1.0.0" }),
        ServiceFlags.SINGLETON
      );
      container.register(
        "requestId",
        () => Math.random().toString(),
        ServiceFlags.NONE
      );

      const config1 = container.get("config");
      const config2 = container.get("config");
      const requestId1 = container.get("requestId");
      const requestId2 = container.get("requestId");

      expect(config1).toBe(config2); // Singleton
      expect(requestId1).not.toBe(requestId2); // Transient
    });
  });
});
