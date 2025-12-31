import { describe, it, expect, beforeEach, vi } from "vitest";
import { RepositoryRegistry } from "../registry.js";
import { Container } from "@comity/core/primitives";

describe("RepositoryRegistry", () => {
  let registry: RepositoryRegistry;
  let container: Container;

  beforeEach(() => {
    container = new Container();
    registry = new RepositoryRegistry(container);
  });

  describe("constructor", () => {
    it("should create a registry with a container", () => {
      expect(registry).toBeInstanceOf(RepositoryRegistry);
    });
  });

  describe("register", () => {
    it("should register a repository factory", () => {
      const factory = () => ({ test: "data" });
      registry.register("test-repo", factory);

      const result = registry.get("test-repo");
      expect(result).toEqual({ test: "data" });
    });

    it("should register multiple repositories", () => {
      const factory1 = () => ({ type: "repo1" });
      const factory2 = () => ({ type: "repo2" });

      registry.register("repo1", factory1);
      registry.register("repo2", factory2);

      expect(registry.get("repo1")).toEqual({ type: "repo1" });
      expect(registry.get("repo2")).toEqual({ type: "repo2" });
    });

    it("should register repository with complex object", () => {
      const mockRepo = {
        findById: vi.fn(),
        findAll: vi.fn(),
        create: vi.fn(),
      };
      const factory = () => mockRepo;

      registry.register("user-repo", factory);

      const result = registry.get("user-repo") as any;
      expect(result).toBe(mockRepo);
      expect(result.findById).toBeDefined();
      expect(result.findAll).toBeDefined();
      expect(result.create).toBeDefined();
    });
  });

  describe("get", () => {
    it("should retrieve a registered repository", () => {
      const mockData = { value: 42 };
      registry.register("test", () => mockData);

      const result = registry.get("test");
      expect(result).toBe(mockData);
    });

    it("should return the same instance on multiple calls", () => {
      let counter = 0;
      registry.register("counter-repo", () => ({ count: ++counter }));

      const first = registry.get("counter-repo");
      const second = registry.get("counter-repo");

      expect(first).toBe(second);
      expect((first as any).count).toBe(1);
    });

    it("should throw error for non-existent repository", () => {
      expect(() => registry.get("non-existent")).toThrow();
    });

    it("should handle typed repositories", () => {
      interface UserRepository {
        findById(id: string): Promise<{ id: string; name: string }>;
      }

      const userRepo: UserRepository = {
        findById: vi.fn().mockResolvedValue({ id: "1", name: "John" }),
      };

      registry.register<UserRepository>("user-repo", () => userRepo);

      const result = registry.get<UserRepository>("user-repo");
      expect(result).toBe(userRepo);
      expect(result.findById).toBeDefined();
    });
  });
});
