import { describe, it, expect, vi, beforeEach } from "vitest";
import { performHealthCheck } from "../health-check.js";

describe("performHealthCheck", () => {
  let mockPrimaryDb: any;
  let mockReplicaDb: any;
  let mockPrimaryPool: any;
  let mockReplicaPool: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockPrimaryDb = {
      execute: vi.fn(),
    };

    mockReplicaDb = {
      execute: vi.fn(),
    };

    mockPrimaryPool = {
      totalCount: 10,
      idleCount: 5,
      waitingCount: 2,
    };

    mockReplicaPool = {
      totalCount: 15,
      idleCount: 8,
      waitingCount: 1,
    };
  });

  it("should return healthy status when all connections work", async () => {
    mockPrimaryDb.execute.mockResolvedValue(undefined);
    mockReplicaDb.execute.mockResolvedValue(undefined);

    const result = await performHealthCheck(
      mockPrimaryDb,
      mockReplicaDb,
      mockPrimaryPool,
      mockReplicaPool
    );

    expect(result.status).toBe("healthy");
    expect(result.primary.status).toBe("connected");
    expect(result.replica.status).toBe("connected");
    expect(result.primary.latency).toBeGreaterThanOrEqual(0);
    expect(result.replica.latency).toBeGreaterThanOrEqual(0);
    expect(result.timestamp).toBeDefined();
  });

  it("should return unhealthy status when primary fails", async () => {
    mockPrimaryDb.execute.mockRejectedValue(
      new Error("Primary connection failed")
    );
    mockReplicaDb.execute.mockResolvedValue(undefined);

    const result = await performHealthCheck(
      mockPrimaryDb,
      mockReplicaDb,
      mockPrimaryPool,
      mockReplicaPool
    );

    expect(result.status).toBe("unhealthy");
    expect(result.primary.status).toBe("error");
    expect(result.primary.error).toBe("Primary connection failed");
    expect(result.replica.status).toBe("connected");
  });

  it("should return degraded status when replica fails but primary works", async () => {
    mockPrimaryDb.execute.mockResolvedValue(undefined);
    mockReplicaDb.execute.mockRejectedValue(
      new Error("Replica connection failed")
    );

    const result = await performHealthCheck(
      mockPrimaryDb,
      mockReplicaDb,
      mockPrimaryPool,
      mockReplicaPool
    );

    expect(result.status).toBe("degraded");
    expect(result.primary.status).toBe("connected");
    expect(result.replica.status).toBe("error");
    expect(result.replica.error).toBe("Replica connection failed");
  });

  it("should return degraded status when latency is too high", async () => {
    // Mock a slow response
    mockPrimaryDb.execute.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1100))
    );
    mockReplicaDb.execute.mockResolvedValue(undefined);

    const result = await performHealthCheck(
      mockPrimaryDb,
      mockReplicaDb,
      mockPrimaryPool,
      mockReplicaPool
    );

    expect(result.status).toBe("degraded");
    expect(result.primary.status).toBe("connected");
    expect(result.primary.latency).toBeGreaterThan(1000);
  });

  it("should handle same pool for primary and replica", async () => {
    mockPrimaryDb.execute.mockResolvedValue(undefined);

    const result = await performHealthCheck(
      mockPrimaryDb,
      mockReplicaDb,
      mockPrimaryPool,
      mockPrimaryPool // Same pool
    );

    expect(result.status).toBe("healthy");
    expect(result.primary).toEqual(result.replica);
    expect(result.poolStats.primary).toEqual(result.poolStats.replica);
  });

  it("should include correct pool statistics", async () => {
    mockPrimaryDb.execute.mockResolvedValue(undefined);
    mockReplicaDb.execute.mockResolvedValue(undefined);

    const result = await performHealthCheck(
      mockPrimaryDb,
      mockReplicaDb,
      mockPrimaryPool,
      mockReplicaPool
    );

    expect(result.poolStats.primary).toEqual({
      total: 10,
      idle: 5,
      waiting: 2,
    });
    expect(result.poolStats.replica).toEqual({
      total: 15,
      idle: 8,
      waiting: 1,
    });
  });

  it("should handle non-Error exceptions", async () => {
    // Simulate a non-Error being thrown
    mockPrimaryDb.execute.mockRejectedValue("String error");
    mockReplicaDb.execute.mockResolvedValue(undefined);

    const result = await performHealthCheck(
      mockPrimaryDb,
      mockReplicaDb,
      mockPrimaryPool,
      mockReplicaPool
    );

    expect(result.status).toBe("unhealthy");
    expect(result.primary.status).toBe("error");
    expect(result.primary.error).toBe("Unknown error");
  });

  it("should provide valid timestamp", async () => {
    mockPrimaryDb.execute.mockResolvedValue(undefined);
    mockReplicaDb.execute.mockResolvedValue(undefined);

    const beforeTest = Date.now();
    const result = await performHealthCheck(
      mockPrimaryDb,
      mockReplicaDb,
      mockPrimaryPool,
      mockReplicaPool
    );
    const afterTest = Date.now();
    const resultTime = new Date(result.timestamp).getTime();

    expect(resultTime).toBeGreaterThanOrEqual(beforeTest);
    expect(resultTime).toBeLessThanOrEqual(afterTest);
  });

  it("should measure latency accurately", async () => {
    const delay = 100;

    mockPrimaryDb.execute.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, delay))
    );
    mockReplicaDb.execute.mockResolvedValue(undefined);

    const result = await performHealthCheck(
      mockPrimaryDb,
      mockReplicaDb,
      mockPrimaryPool,
      mockReplicaPool
    );

    expect(result.primary.latency).toBeGreaterThanOrEqual(delay - 10); // Allow small margin for timing precision
    expect(result.primary.latency).toBeLessThan(delay + 50); // Allow some margin
  });
});
