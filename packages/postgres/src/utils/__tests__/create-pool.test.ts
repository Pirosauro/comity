import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPool } from "../create-pool.js";
import type { Logger } from "@comity/core";

// Mock dependencies
vi.mock("pg", () => ({
  Pool: vi.fn().mockImplementation((config) => ({
    connectionString: config.connectionString,
    max: config.max,
    on: vi.fn(),
    connect: vi.fn(),
    end: vi.fn(),
  })),
}));

describe("createPool", () => {
  let mockLogger: any;
  let mockEmit: any;
  let mockPool: any;
  let mockCtx: any;

  beforeEach(async () => {
    vi.clearAllMocks();

    // Setup mock logger
    mockLogger = {
      error: vi.fn(),
      warn: vi.fn(),
      info: vi.fn(),
      debug: vi.fn(),
    };

    // Setup mock emit function
    mockEmit = vi.fn();

    // Create a complete mock context for the utilities
    mockCtx = {
      logger: mockLogger,
      emit: mockEmit,
      error: vi.fn(),
    };

    // Get Pool constructor from mock
    const { Pool } = await import("pg");
    mockPool = {
      on: vi.fn(),
      connect: vi.fn(),
      end: vi.fn(),
    };
    vi.mocked(Pool).mockReturnValue(mockPool);
  });

  it("should create a pool with provided config", async () => {
    const config = {
      connectionString: "postgresql://localhost:5432/testdb",
      max: 10,
    };
    const pool = createPool(config, mockCtx);

    expect(pool).toBe(mockPool);

    const { Pool } = await import("pg");

    expect(vi.mocked(Pool)).toHaveBeenCalledWith(config);
  });

  it("should set up error event handlers", () => {
    const config = {
      connectionString: "postgresql://localhost:5432/testdb",
      max: 10,
    };

    createPool(config, mockCtx);

    expect(mockPool.on).toHaveBeenCalledWith("error", expect.any(Function));
    expect(mockPool.on).toHaveBeenCalledWith("release", expect.any(Function));
    expect(mockPool.on).toHaveBeenCalledWith("connect", expect.any(Function));
    expect(mockPool.on).toHaveBeenCalledWith("acquire", expect.any(Function));
    expect(mockPool.on).toHaveBeenCalledWith("remove", expect.any(Function));
  });

  it("should handle error events", () => {
    const config = {
      connectionString: "postgresql://localhost:5432/testdb",
      max: 10,
    };

    createPool(config, mockCtx);

    // Find the error handler
    const errorHandler = mockPool.on.mock.calls.find(
      (call: any) => call[0] === "error"
    )?.[1];

    expect(errorHandler).toBeDefined();

    // Simulate an error
    const mockError = new Error("Connection failed");
    const mockClient = { id: "client-1" };

    errorHandler(mockError, mockClient);

    expect(mockCtx.error).toHaveBeenCalledWith(
      mockError,
      "Database pool error: Connection failed"
    );
    expect(mockEmit).toHaveBeenCalledWith("@comity/postgres:error", {
      client: mockClient,
      error: mockError,
    });
  });

  it("should handle release events", () => {
    const config = {
      connectionString: "postgresql://localhost:5432/testdb",
      max: 10,
    };

    createPool(config, mockCtx);

    // Find the release handler
    const releaseHandler = mockPool.on.mock.calls.find(
      (call: any) => call[0] === "release"
    )?.[1];

    expect(releaseHandler).toBeDefined();

    // Simulate a release error
    const mockError = new Error("Release failed");
    const mockClient = { id: "client-1" };

    releaseHandler(mockError, mockClient);

    expect(mockCtx.error).toHaveBeenCalledWith(
      mockError,
      "Database pool release error: Release failed"
    );
    expect(mockEmit).toHaveBeenCalledWith("@comity/postgres:release", {
      client: mockClient,
      error: mockError,
    });
  });

  it("should handle connect events", () => {
    const config = {
      connectionString: "postgresql://localhost:5432/testdb",
      max: 10,
    };

    createPool(config, mockCtx);

    // Find the connect handler
    const connectHandler = mockPool.on.mock.calls.find(
      (call: any) => call[0] === "connect"
    )?.[1];

    expect(connectHandler).toBeDefined();

    // Simulate a connect event
    const mockClient = { id: "client-1" };

    connectHandler(mockClient);

    expect(mockEmit).toHaveBeenCalledWith("@comity/postgres:connect", {
      client: mockClient,
    });
  });

  it("should handle custom pool configuration", async () => {
    const config = {
      connectionString: "postgresql://localhost:5432/customdb",
      max: 25,
      connectionTimeoutMillis: 8000,
      idleTimeoutMillis: 600000,
      query_timeout: 45000,
      allowExitOnIdle: true,
    };

    createPool(config, mockCtx);

    const { Pool } = await import("pg");

    expect(vi.mocked(Pool)).toHaveBeenCalledWith(config);
  });
});
