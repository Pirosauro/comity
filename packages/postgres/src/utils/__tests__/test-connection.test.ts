import { describe, it, expect, vi, beforeEach } from "vitest";
import { testConnection } from "../test-connection.js";
import { DatabaseConnectionError } from "../../errors/connection.js";

describe("testConnection", () => {
  let mockPool: any;
  let mockClient: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockClient = {
      query: vi.fn(),
      release: vi.fn(),
    };

    mockPool = {
      connect: vi.fn().mockResolvedValue(mockClient),
    };
  });

  it("should successfully test a working connection", async () => {
    mockClient.query.mockResolvedValue({ rows: [{ "?column?": 1 }] });

    await expect(
      testConnection(mockPool, "test-pool")
    ).resolves.toBeUndefined();

    expect(mockPool.connect).toHaveBeenCalled();
    expect(mockClient.query).toHaveBeenCalledWith("SELECT 1");
    expect(mockClient.release).toHaveBeenCalled();
  });

  it("should handle connection failures", async () => {
    const connectionError = new Error("Connection refused");

    mockPool.connect.mockRejectedValue(connectionError);

    await expect(testConnection(mockPool, "failed-pool")).rejects.toThrow(
      DatabaseConnectionError
    );
    await expect(testConnection(mockPool, "failed-pool")).rejects.toThrow(
      "failed-pool database connection test failed: Connection refused"
    );
  });

  it("should handle query failures", async () => {
    const queryError = new Error("Query failed");
    mockClient.query.mockRejectedValue(queryError);

    await expect(testConnection(mockPool, "query-failed-pool")).rejects.toThrow(
      DatabaseConnectionError
    );
    await expect(testConnection(mockPool, "query-failed-pool")).rejects.toThrow(
      "query-failed-pool database connection test failed: Query failed"
    );
    expect(mockClient.release).toHaveBeenCalled();
  });

  it("should always release client even if query fails", async () => {
    const queryError = new Error("Query failed");

    mockClient.query.mockRejectedValue(queryError);

    try {
      await testConnection(mockPool, "query-failed-pool");
    } catch (error) {
      // Expected to throw
    }

    expect(mockClient.release).toHaveBeenCalled();
  });

  it("should handle client release failures gracefully", async () => {
    const queryError = new Error("Query failed");
    const releaseError = new Error("Release failed");

    mockClient.query.mockRejectedValue(queryError);
    mockClient.release.mockImplementation(() => {
      throw releaseError;
    });

    // Should still throw the original query error, not the release error
    await expect(testConnection(mockPool, "release-fail-pool")).rejects.toThrow(
      "release-fail-pool database connection test failed: Release failed"
    );

    expect(mockClient.release).toHaveBeenCalled();
  });

  it("should include pool name in error messages", async () => {
    const connectionError = new Error("Network timeout");

    mockPool.connect.mockRejectedValue(connectionError);

    const poolName = "production-primary";

    await expect(testConnection(mockPool, poolName)).rejects.toThrow(
      `${poolName} database connection test failed: Network timeout`
    );
  });

  it("should handle non-Error exceptions", async () => {
    // Simulate a non-Error being thrown
    mockPool.connect.mockRejectedValue("String error");

    await expect(testConnection(mockPool, "string-error-pool")).rejects.toThrow(
      DatabaseConnectionError
    );
    await expect(testConnection(mockPool, "string-error-pool")).rejects.toThrow(
      "string-error-pool database connection test failed: Unknown error"
    );
  });
});
