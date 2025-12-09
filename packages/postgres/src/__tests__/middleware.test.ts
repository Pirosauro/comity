import { describe, it, expect, vi, beforeEach } from "vitest";
import { createDatabaseMiddleware } from "../middleware.js";
import { DatabaseConnectionError } from "../errors/connection.js";

// Mock dependencies
vi.mock("pg", () => ({
  Pool: vi.fn().mockImplementation((config) => ({
    connectionString: config.connectionString,
    max: config.max,
    on: vi.fn(),
    connect: vi.fn().mockResolvedValue({
      query: vi.fn().mockResolvedValue({ rows: [{ "?column?": 1 }] }),
      release: vi.fn(),
    }),
    end: vi.fn(),
  })),
}));

vi.mock("drizzle-orm/node-postgres", () => ({
  drizzle: vi.fn().mockReturnValue({
    execute: vi.fn().mockResolvedValue(undefined),
  }),
}));

vi.mock("@comity/core/patterns", () => ({
  Container: vi.fn().mockImplementation(() => ({
    register: vi.fn(),
  })),
}));

vi.mock("hono/adapter", () => ({
  env: vi.fn(),
}));

describe("createDatabaseMiddleware", () => {
  let mockContext: any;
  let mockNext: any;
  let mockLogger: any;
  let mockEmit: any;
  let mockCtx: any;

  beforeEach(async () => {
    vi.clearAllMocks();

    mockContext = {
      set: vi.fn(),
      error: vi.fn(),
    };

    mockNext = vi.fn();

    mockLogger = {
      error: vi.fn(),
      info: vi.fn(),
      debug: vi.fn(),
    };

    mockEmit = vi.fn();

    // Create a complete mock context for the middleware
    mockCtx = {
      logger: mockLogger,
      emit: mockEmit,
      error: vi.fn(),
    };
  });

  it("should create middleware function", () => {
    const middleware = createDatabaseMiddleware({}, mockCtx);

    expect(typeof middleware).toBe("function");
  });

  it("should throw DatabaseConnectionError when no connection string is provided", async () => {
    const { env } = await import("hono/adapter");

    vi.mocked(env).mockReturnValue({});

    const middleware = createDatabaseMiddleware({}, mockCtx);

    await expect(middleware(mockContext, mockNext)).rejects.toThrow(
      DatabaseConnectionError
    );

    await expect(middleware(mockContext, mockNext)).rejects.toThrow(
      "Database configuration missing: DATABASE_URL or HYPERDRIVE connection string is required"
    );
  });

  it("should use DATABASE_URL when provided", async () => {
    const { env } = await import("hono/adapter");

    vi.mocked(env).mockReturnValue({
      DATABASE_URL: "postgresql://localhost:5432/testdb",
    });

    const middleware = createDatabaseMiddleware({}, mockCtx);

    await middleware(mockContext, mockNext);

    expect(mockContext.set).toHaveBeenCalledWith("db", {
      primary: expect.any(Object),
      replica: expect.any(Object),
      repositories: expect.any(Object),
    });
    expect(mockNext).toHaveBeenCalled();
  });

  it("should use HYPERDRIVE when provided", async () => {
    const { env } = await import("hono/adapter");

    vi.mocked(env).mockReturnValue({
      HYPERDRIVE: {
        connectionString: "postgresql://hyperdrive-url:5432/testdb",
      },
    });

    const middleware = createDatabaseMiddleware({}, mockCtx);

    await middleware(mockContext, mockNext);

    expect(mockContext.set).toHaveBeenCalledWith("db", {
      primary: expect.any(Object),
      replica: expect.any(Object),
      repositories: expect.any(Object),
    });
    expect(mockNext).toHaveBeenCalled();
  });

  it("should prefer HYPERDRIVE over DATABASE_URL", async () => {
    const { Pool } = await import("pg");
    const { env } = await import("hono/adapter");

    vi.mocked(env).mockReturnValue({
      HYPERDRIVE: {
        connectionString: "postgresql://hyperdrive-url:5432/testdb",
      },
      DATABASE_URL: "postgresql://database-url:5432/testdb",
    });

    const middleware = createDatabaseMiddleware({}, mockCtx);

    await middleware(mockContext, mockNext);

    expect(Pool).toHaveBeenCalledWith(
      expect.objectContaining({
        connectionString: "postgresql://hyperdrive-url:5432/testdb",
      })
    );
  });

  it("should create separate replica pool when replica config is provided", async () => {
    const { Pool } = await import("pg");
    const { env } = await import("hono/adapter");

    vi.mocked(env).mockReturnValue({
      DATABASE_URL: "postgresql://primary:5432/testdb",
      DATABASE_URL_REPLICA: "postgresql://replica:5432/testdb",
    });

    const middleware = createDatabaseMiddleware({}, mockCtx);

    await middleware(mockContext, mockNext);

    expect(Pool).toHaveBeenCalledTimes(2);
    expect(Pool).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        connectionString: "postgresql://primary:5432/testdb",
      })
    );
    expect(Pool).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        connectionString: "postgresql://replica:5432/testdb",
      })
    );
  });

  it("should use primary pool as replica fallback when no replica is configured", async () => {
    const { Pool } = await import("pg");
    const { env } = await import("hono/adapter");

    vi.mocked(env).mockReturnValue({
      DATABASE_URL: "postgresql://primary:5432/testdb",
    });

    const middleware = createDatabaseMiddleware({}, mockCtx);

    await middleware(mockContext, mockNext);

    // Only one pool should be created
    expect(Pool).toHaveBeenCalledTimes(1);
  });

  it("should respect custom connection options", async () => {
    const { Pool } = await import("pg");
    const { env } = await import("hono/adapter");

    vi.mocked(env).mockReturnValue({
      DATABASE_URL: "postgresql://localhost:5432/testdb",
    });

    const options = {
      maxConnections: 20,
      connectionTimeout: 8000,
      idleTimeout: 600000,
      queryTimeout: 45000,
    };

    const middleware = createDatabaseMiddleware(options, mockCtx);

    await middleware(mockContext, mockNext);

    expect(Pool).toHaveBeenCalledWith(
      expect.objectContaining({
        max: 20,
        connectionTimeoutMillis: 8000,
        idleTimeoutMillis: 600000,
        query_timeout: 45000,
      })
    );
  });

  it("should emit initialization event", async () => {
    const { env } = await import("hono/adapter");

    vi.mocked(env).mockReturnValue({
      DATABASE_URL: "postgresql://localhost:5432/testdb",
    });

    const middleware = createDatabaseMiddleware({}, mockCtx);

    await middleware(mockContext, mockNext);

    expect(mockEmit).toHaveBeenCalledWith(
      "@comity/postgres:initialized",
      expect.objectContaining({
        primary: expect.any(Object),
        replica: expect.any(Object),
        repositories: expect.any(Object),
        registerRepository: expect.any(Function),
        healthCheck: expect.any(Function),
      })
    );
  });

  it("should only initialize pools once", async () => {
    const { Pool } = await import("pg");
    const { env } = await import("hono/adapter");

    vi.mocked(env).mockReturnValue({
      DATABASE_URL: "postgresql://localhost:5432/testdb",
    });

    const middleware = createDatabaseMiddleware({}, mockCtx);

    // Call middleware multiple times
    await middleware(mockContext, mockNext);
    await middleware(mockContext, mockNext);
    await middleware(mockContext, mockNext);

    // Pool should only be created once
    expect(Pool).toHaveBeenCalledTimes(1);
  });

  it("should skip connection test when skipConnectionTest is true", async () => {
    const { env } = await import("hono/adapter");

    vi.mocked(env).mockReturnValue({
      DATABASE_URL: "postgresql://localhost:5432/testdb",
    });

    const options = {
      skipConnectionTest: true,
    };

    const middleware = createDatabaseMiddleware(options, mockCtx);

    // Should not throw even if connection would fail
    await expect(middleware(mockContext, mockNext)).resolves.not.toThrow();
  });

  it("should handle connection test failures", async () => {
    const { Pool } = await import("pg");
    const { env } = await import("hono/adapter");
    // Mock connection failure
    const mockPool: any = {
      on: vi.fn(),
      connect: vi.fn().mockRejectedValue(new Error("Connection failed")),
      end: vi.fn(),
    };

    vi.mocked(Pool).mockReturnValue(mockPool);

    vi.mocked(env).mockReturnValue({
      DATABASE_URL: "postgresql://localhost:5432/testdb",
    });

    const middleware = createDatabaseMiddleware({}, mockCtx);

    await expect(middleware(mockContext, mockNext)).rejects.toThrow(
      DatabaseConnectionError
    );
  });

  it("should clean up pools on error", async () => {
    const { Pool } = await import("pg");
    const { env } = await import("hono/adapter");
    const mockPool: any = {
      on: vi.fn(),
      connect: vi.fn().mockRejectedValue(new Error("Connection failed")),
      end: vi.fn(),
    };

    vi.mocked(Pool).mockReturnValue(mockPool);
    vi.mocked(env).mockReturnValue({
      DATABASE_URL: "postgresql://localhost:5432/testdb",
    });

    const middleware = createDatabaseMiddleware({}, mockCtx);

    try {
      await middleware(mockContext, mockNext);
    } catch (error) {
      // Expected to fail
    }

    expect(mockPool.end).toHaveBeenCalled();
  });

  it("should handle replica configuration with HYPERDRIVE", async () => {
    const { Pool } = await import("pg");
    const { env } = await import("hono/adapter");

    // Reset mocks to ensure clean state
    vi.clearAllMocks();

    // Setup fresh successful connection mock
    vi.mocked(Pool).mockImplementation(
      (config) =>
        ({
          connectionString: config?.connectionString,
          max: config?.max,
          on: vi.fn(),
          connect: vi.fn().mockResolvedValue({
            query: vi.fn().mockResolvedValue({ rows: [{ "?column?": 1 }] }),
            release: vi.fn(),
          }),
          end: vi.fn(),
        } as any)
    );

    vi.mocked(env).mockReturnValue({
      HYPERDRIVE: {
        connectionString: "postgresql://hyperdrive-primary:5432/testdb",
      },
      HYPERDRIVE_REPLICA: {
        connectionString: "postgresql://hyperdrive-replica:5432/testdb",
      },
    });

    const middleware = createDatabaseMiddleware({}, mockCtx);

    await middleware(mockContext, mockNext);

    expect(Pool).toHaveBeenCalledTimes(2);
    expect(Pool).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        connectionString: "postgresql://hyperdrive-primary:5432/testdb",
      })
    );
    expect(Pool).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        connectionString: "postgresql://hyperdrive-replica:5432/testdb",
      })
    );
  });

  it("should return unknown health status when disableHealthCheck is true", async () => {
    const { env } = await import("hono/adapter");

    vi.mocked(env).mockReturnValue({
      DATABASE_URL: "postgresql://localhost:5432/testdb",
    });

    const options = {
      disableHealthCheck: true,
    };

    const middleware = createDatabaseMiddleware(options, mockCtx);

    await middleware(mockContext, mockNext);

    // Get the emitted event with the healthCheck function
    expect(mockEmit).toHaveBeenCalledWith(
      "@comity/postgres:initialized",
      expect.objectContaining({
        healthCheck: expect.any(Function),
      })
    );

    // Extract the healthCheck function and test it
    const initEvent = mockEmit.mock.calls.find(
      (call: any) => call[0] === "@comity/postgres:initialized"
    )?.[1];

    const healthResult = await initEvent.healthCheck();

    expect(healthResult).toEqual({
      status: "unknown",
      primary: {
        status: "unknown",
      },
      replica: {
        status: "unknown",
      },
      poolStats: {
        primary: {
          total: 0,
          idle: 0,
          waiting: 0,
        },
        replica: {
          total: 0,
          idle: 0,
          waiting: 0,
        },
      },
      timestamp: expect.any(String),
    });

    // Verify timestamp is a valid ISO string
    expect(new Date(healthResult.timestamp)).toBeInstanceOf(Date);
  });
});
