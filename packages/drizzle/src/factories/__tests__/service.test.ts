import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createDrizzleService } from "../service.js";
import type { DrizzleService } from "../../types.js";

describe("createDrizzleService", () => {
  let mockDb: any;
  let service: DrizzleService<any>;

  beforeEach(() => {
    mockDb = {
      execute: vi.fn(),
    };
    service = createDrizzleService(mockDb);
  });

  describe("service creation", () => {
    it("should create a drizzle service", () => {
      expect(service).toBeDefined();
      expect(service.registerRepository).toBeDefined();
      expect(service.getRepository).toBeDefined();
      expect(service.healthCheck).toBeDefined();
    });
  });

  describe("registerRepository", () => {
    it("should register a repository", () => {
      const mockRepository = {
        findById: vi.fn(),
        findAll: vi.fn(),
      };
      const factory = vi.fn(() => mockRepository);

      service.registerRepository("user-repo", factory);

      const repo = service.getRepository("user-repo");
      expect(factory).toHaveBeenCalledWith(mockDb);
      expect(repo).toBe(mockRepository);
    });

    it("should register multiple repositories", () => {
      const userRepo = { type: "user" };
      const postRepo = { type: "post" };

      service.registerRepository("user-repo", () => userRepo);
      service.registerRepository("post-repo", () => postRepo);

      expect(service.getRepository("user-repo")).toBe(userRepo);
      expect(service.getRepository("post-repo")).toBe(postRepo);
    });

    it("should pass db instance to factory", () => {
      const factory = vi.fn(() => ({}));
      service.registerRepository("test-repo", factory);
      service.getRepository("test-repo");

      expect(factory).toHaveBeenCalledWith(mockDb);
      expect(factory).toHaveBeenCalledTimes(1);
    });
  });

  describe("getRepository", () => {
    it("should retrieve a registered repository", () => {
      const mockRepo = { value: "test" };
      service.registerRepository("test", () => mockRepo);

      const result = service.getRepository("test");
      expect(result).toBe(mockRepo);
    });

    it("should throw error for non-existent repository", () => {
      expect(() => service.getRepository("non-existent")).toThrow();
    });

    it("should return same instance on multiple calls", () => {
      let counter = 0;
      service.registerRepository("counter", () => ({ count: ++counter }));

      const first = service.getRepository("counter");
      const second = service.getRepository("counter");

      expect(first).toBe(second);
      expect((first as any).count).toBe(1);
    });
  });

  describe("healthCheck", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should return healthy status for fast queries", async () => {
      const startTime = 1000;
      vi.setSystemTime(startTime);

      mockDb.execute.mockImplementation(() => {
        vi.advanceTimersByTime(50); // 50ms - under degraded threshold
        return Promise.resolve();
      });

      const result = await service.healthCheck();

      expect(result.status).toBe("healthy");
      expect(result.timestamp).toBeDefined();
      expect(result.details?.latency).toBeDefined();
      expect(result.details?.latency).toBeLessThan(100);
      expect(mockDb.execute).toHaveBeenCalledOnce();
    });

    it("should return degraded status for slow queries", async () => {
      const startTime = 1000;
      vi.setSystemTime(startTime);

      mockDb.execute.mockImplementation(() => {
        vi.advanceTimersByTime(150); // 150ms - above degraded, below unhealthy
        return Promise.resolve();
      });

      const result = await service.healthCheck();

      expect(result.status).toBe("degraded");
      expect(result.timestamp).toBeDefined();
      expect(result.details?.latency).toBeGreaterThanOrEqual(100);
      expect(result.details?.latency).toBeLessThan(300);
    });

    it("should return unhealthy status for very slow queries", async () => {
      const startTime = 1000;
      vi.setSystemTime(startTime);

      mockDb.execute.mockImplementation(() => {
        vi.advanceTimersByTime(350); // 350ms - above unhealthy threshold
        return Promise.resolve();
      });

      const result = await service.healthCheck();

      expect(result.status).toBe("unhealthy");
      expect(result.timestamp).toBeDefined();
      expect(result.details?.latency).toBeGreaterThanOrEqual(300);
      expect(result.details?.reason).toBe("Database response too slow");
    });

    it("should return unhealthy status on database error", async () => {
      const error = new Error("Connection failed");
      mockDb.execute.mockRejectedValue(error);

      const result = await service.healthCheck();

      expect(result.status).toBe("unhealthy");
      expect(result.timestamp).toBeDefined();
      expect(result.details?.error).toBe("Connection failed");
    });

    it("should handle non-Error objects in catch block", async () => {
      mockDb.execute.mockRejectedValue("string error");

      const result = await service.healthCheck();

      expect(result.status).toBe("unhealthy");
      expect(result.details?.error).toBe("Unknown error");
    });

    it("should execute SELECT 1 query", async () => {
      mockDb.execute.mockResolvedValue(undefined);

      await service.healthCheck();

      expect(mockDb.execute).toHaveBeenCalledWith(expect.anything());
      const sqlArg = mockDb.execute.mock.calls[0][0];
      expect(sqlArg).toBeDefined();
    });

    it("should return valid ISO timestamp", async () => {
      mockDb.execute.mockResolvedValue(undefined);
      const testDate = new Date("2024-01-01T12:00:00.000Z");
      vi.setSystemTime(testDate);

      const result = await service.healthCheck();

      expect(result.timestamp).toBe(testDate.toISOString());
    });

    it("should include latency in healthy response", async () => {
      vi.setSystemTime(1000);
      mockDb.execute.mockImplementation(() => {
        vi.advanceTimersByTime(10);
        return Promise.resolve();
      });

      const result = await service.healthCheck();

      expect(result.status).toBe("healthy");
      expect(result.details?.latency).toBeGreaterThanOrEqual(0);
    });

    it("should handle exactly at degraded threshold (100ms)", async () => {
      vi.setSystemTime(1000);
      mockDb.execute.mockImplementation(() => {
        vi.advanceTimersByTime(100);
        return Promise.resolve();
      });

      const result = await service.healthCheck();

      expect(result.status).toBe("degraded");
      expect(result.details?.latency).toBeGreaterThanOrEqual(100);
    });

    it("should handle exactly at unhealthy threshold (300ms)", async () => {
      vi.setSystemTime(1000);
      mockDb.execute.mockImplementation(() => {
        vi.advanceTimersByTime(300);
        return Promise.resolve();
      });

      const result = await service.healthCheck();

      expect(result.status).toBe("unhealthy");
      expect(result.details?.latency).toBeGreaterThanOrEqual(300);
    });
  });
});
