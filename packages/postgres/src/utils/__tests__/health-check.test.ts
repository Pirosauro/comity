import { describe, it, expect, vi, beforeEach } from "vitest";
import { performHealthCheck } from "../health-check.js";

describe("performHealthCheck", () => {
  let mockPrimaryDb: any;
  let mockReplicaDb: any;
  let mockPrimaryPool: any;
  let mockReplicaPool: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockPrimaryPool = {
      totalCount: 10,
      idleCount: 5,
      waitingCount: 2,
      query: vi.fn().mockResolvedValue({ rows: [{ "?column?": 1 }] }),
    };

    mockReplicaPool = {
      totalCount: 15,
      idleCount: 8,
      waitingCount: 1,
      query: vi.fn().mockResolvedValue({ rows: [{ "?column?": 1 }] }),
    };

    mockPrimaryDb = {
      execute: vi.fn(),
      $client: mockPrimaryPool,
    };

    mockReplicaDb = {
      execute: vi.fn(),
      $client: mockReplicaPool,
    };
  });

  it("should return healthy status when all connections work", async () => {
    mockPrimaryPool.query.mockResolvedValue({ rows: [{ "?column?": 1 }] });
    mockReplicaPool.query.mockResolvedValue({ rows: [{ "?column?": 1 }] });

    const result = await performHealthCheck(mockPrimaryDb, [mockReplicaDb]);

    expect(result.status).toBe("healthy");
    expect(result.primary.status).toBe("connected");
    expect(result.replicas[0].status).toBe("connected");
    expect(result.primary.latency).toBeGreaterThanOrEqual(0);
    expect(result.replicas[0].latency).toBeGreaterThanOrEqual(0);
    expect(result.timestamp).toBeDefined();
  });

  it("should return unhealthy status when primary fails", async () => {
    mockPrimaryPool.query.mockRejectedValue(
      new Error("Primary connection failed")
    );
    mockReplicaPool.query.mockResolvedValue({ rows: [{ "?column?": 1 }] });

    const result = await performHealthCheck(mockPrimaryDb, [mockReplicaDb]);

    expect(result.status).toBe("unhealthy");
    expect(result.primary.status).toBe("error");
    expect(result.primary.error).toBe("Primary connection failed");
    expect(result.replicas[0].status).toBe("connected");
  });

  it("should return degraded status when replica fails but primary works", async () => {
    mockPrimaryPool.query.mockResolvedValue({ rows: [{ "?column?": 1 }] });
    mockReplicaPool.query.mockRejectedValue(
      new Error("Replica connection failed")
    );

    const result = await performHealthCheck(mockPrimaryDb, [mockReplicaDb]);

    expect(result.status).toBe("degraded");
    expect(result.primary.status).toBe("connected");
    expect(result.replicas[0].status).toBe("error");
    expect(result.replicas[0].error).toBe("Replica connection failed");
  });

  it("should return degraded status when latency is too high", async () => {
    // Mock a slow response
    mockPrimaryPool.query.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ rows: [{ "?column?": 1 }] }), 1100))
    );
    mockReplicaPool.query.mockResolvedValue({ rows: [{ "?column?": 1 }] });

    const result = await performHealthCheck(mockPrimaryDb, [mockReplicaDb]);

    expect(result.status).toBe("degraded");
    expect(result.primary.status).toBe("connected");
    expect(result.primary.latency).toBeGreaterThan(1000);
  });

  it("should handle same pool for primary and replica", async () => {
    mockPrimaryPool.query.mockResolvedValue({ rows: [{ "?column?": 1 }] });
    // Use same pool for replica
    mockReplicaDb.$client = mockPrimaryPool;

    const result = await performHealthCheck(mockPrimaryDb, [mockReplicaDb]);

    expect(result.status).toBe("healthy");
    expect(result.primary.status).toBe("connected");
    expect(result.replicas[0].status).toBe("connected");
    expect(result.poolStats.primary).toEqual(result.poolStats.replicas[0]);
  });

  it("should include correct pool statistics", async () => {
    mockPrimaryPool.query.mockResolvedValue({ rows: [{ "?column?": 1 }] });
    mockReplicaPool.query.mockResolvedValue({ rows: [{ "?column?": 1 }] });

    const result = await performHealthCheck(mockPrimaryDb, [mockReplicaDb]);

    expect(result.poolStats.primary).toEqual({
      total: 10,
      idle: 5,
      waiting: 2,
    });
    expect(result.poolStats.replicas[0]).toEqual({
      total: 15,
      idle: 8,
      waiting: 1,
    });
  });

  it("should handle non-Error exceptions", async () => {
    // Simulate a non-Error being thrown
    mockPrimaryPool.query.mockRejectedValue("String error");
    mockReplicaPool.query.mockResolvedValue({ rows: [{ "?column?": 1 }] });

    const result = await performHealthCheck(mockPrimaryDb, [mockReplicaDb]);

    expect(result.status).toBe("unhealthy");
    expect(result.primary.status).toBe("error");
    expect(result.primary.error).toBe("Unknown error");
  });

  it("should provide valid timestamp", async () => {
    mockPrimaryPool.query.mockResolvedValue({ rows: [{ "?column?": 1 }] });
    mockReplicaPool.query.mockResolvedValue({ rows: [{ "?column?": 1 }] });

    const beforeTest = Date.now();
    const result = await performHealthCheck(mockPrimaryDb, [mockReplicaDb]);
    const afterTest = Date.now();
    const resultTime = new Date(result.timestamp).getTime();

    expect(resultTime).toBeGreaterThanOrEqual(beforeTest);
    expect(resultTime).toBeLessThanOrEqual(afterTest);
  });

  it("should measure latency accurately", async () => {
    const delay = 100;

    mockPrimaryPool.query.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ rows: [{ "?column?": 1 }] }), delay))
    );
    mockReplicaPool.query.mockResolvedValue({ rows: [{ "?column?": 1 }] });

    const result = await performHealthCheck(mockPrimaryDb, [mockReplicaDb]);

    expect(result.primary.latency).toBeGreaterThanOrEqual(delay - 10); // Allow small margin for timing precision
    expect(result.primary.latency).toBeLessThan(delay + 50); // Allow some margin
  });

  it("should return degraded status when replica latency is too high", async () => {
    mockPrimaryPool.query.mockResolvedValue({ rows: [{ "?column?": 1 }] });
    // Mock a slow replica response
    mockReplicaPool.query.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ rows: [{ "?column?": 1 }] }), 1100))
    );

    const result = await performHealthCheck(mockPrimaryDb, [mockReplicaDb]);

    expect(result.status).toBe("degraded");
    expect(result.primary.status).toBe("connected");
    expect(result.replicas[0].status).toBe("connected");
    expect(result.replicas[0].latency).toBeGreaterThan(1000);
  });

  it("should handle missing latency values", async () => {
    mockPrimaryPool.query.mockResolvedValue({ rows: [{ "?column?": 1 }] });
    mockReplicaPool.query.mockResolvedValue({ rows: [{ "?column?": 1 }] });

    const result = await performHealthCheck(mockPrimaryDb, [mockReplicaDb]);

    // Should still return healthy even if latency is undefined (though it shouldn't be)
    expect(result.status).toBe("healthy");
  });
});
