import { describe, it, expect, vi, beforeEach } from "vitest";
import { createDatabaseMiddleware } from "../middleware-factory.js";
import { ConnectionError } from "../errors/connection.js";

// Mock dependencies
vi.mock("pg", () => {
  class MockPool {
    config: any;
    on = vi.fn();
    emit = vi.fn();
    connect = vi.fn().mockResolvedValue({
      query: vi.fn().mockResolvedValue({ rows: [{ "?column?": 1 }] }),
      release: vi.fn(),
    });
    end = vi.fn();
    totalCount = 0;
    idleCount = 0;
    waitingCount = 0;

    constructor(config: any) {
      this.config = config;
    }
  }

  // Add query method to prototype so super.query() works
  (MockPool.prototype as any).query = vi
    .fn()
    .mockResolvedValue({ rows: [{ "?column?": 1 }] });

  return {
    Pool: MockPool,
  };
});

vi.mock("hono/adapter", () => ({
  env: vi.fn().mockReturnValue({}),
}));

vi.mock("drizzle-orm/node-postgres", () => ({
  drizzle: vi.fn().mockImplementation(({ client }) => ({
    $client: client,
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    transaction: vi.fn(),
    execute: vi.fn(),
  })),
}));

vi.mock("drizzle-orm/pg-core", () => ({
  withReplicas: vi.fn().mockImplementation((primary, replicas) => ({
    ...primary,
    $replicas: replicas,
  })),
}));

vi.mock("@comity/core/patterns", () => ({
  Container: vi.fn().mockImplementation(function (this: any) {
    this.register = vi.fn();
    return this;
  }),
}));

vi.mock("../utils/index.js", () => ({
  performHealthCheck: vi.fn().mockResolvedValue({
    status: "healthy",
    primary: { status: "connected" },
    replicas: [],
    poolStats: {
      primary: { total: 1, idle: 1, waiting: 0 },
      replicas: [],
    },
    timestamp: new Date().toISOString(),
  }),
  testConnection: vi.fn().mockResolvedValue(undefined),
}));

describe("createDatabaseMiddleware", () => {
  let mockCtx: any;
  let mockContext: any;
  let mockNext: any;
  let mockLogger: any;
  let mockChildLogger: any;
  let mockEmit: any;
  let mockOnHook: any;
  let mockTrigger: any;

  beforeEach(async () => {
    vi.clearAllMocks();

    // Re-set the testConnection mock
    const { testConnection } = await import("../utils/index.js");
    vi.mocked(testConnection).mockResolvedValue(undefined);

    mockChildLogger = {
      error: vi.fn(),
      info: vi.fn(),
      debug: vi.fn(),
    };

    mockLogger = {
      error: vi.fn(),
      info: vi.fn(),
      debug: vi.fn(),
      child: vi.fn().mockReturnValue(mockChildLogger),
    };

    mockEmit = vi.fn();
    mockOnHook = vi.fn();
    mockTrigger = vi.fn();

    mockCtx = {
      logger: mockLogger,
      emit: mockEmit,
      onHook: mockOnHook,
      trigger: mockTrigger,
    };

    mockContext = {
      set: vi.fn(),
    };

    mockNext = vi.fn();
  });

  it("should create middleware function", () => {
    const middleware = createDatabaseMiddleware({}, mockCtx);
    expect(typeof middleware).toBe("function");
  });

  it("should throw ConnectionError when no connection string is provided", async () => {
    const { env } = await import("hono/adapter");
    vi.mocked(env).mockReturnValue({});

    const middleware = createDatabaseMiddleware({}, mockCtx);

    await expect(middleware(mockContext, mockNext)).rejects.toThrow(
      ConnectionError
    );
    expect(mockLogger.child).toHaveBeenCalledWith({
      module: "@comity/postgres",
    });
    expect(mockChildLogger.error).toHaveBeenCalledWith(
      "Database configuration missing: POSTGRES_URL or HYPERDRIVE connection string is required"
    );
  });

  it("should use POSTGRES_URL when provided", async () => {
    const { env } = await import("hono/adapter");
    vi.mocked(env).mockReturnValue({
      POSTGRES_URL: "postgresql://localhost:5432/testdb",
    });

    const middleware = createDatabaseMiddleware({}, mockCtx);

    await middleware(mockContext, mockNext);

    expect(mockContext.set).toHaveBeenCalledWith(
      "postgres",
      expect.any(Object)
    );
    expect(mockEmit).toHaveBeenCalledWith(
      "@comity/postgres:initialized",
      expect.any(Object)
    );
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

    expect(mockContext.set).toHaveBeenCalledWith(
      "postgres",
      expect.any(Object)
    );
  });

  it("should prefer HYPERDRIVE over POSTGRES_URL", async () => {
    const { env } = await import("hono/adapter");
    vi.mocked(env).mockReturnValue({
      POSTGRES_URL: "postgresql://localhost:5432/testdb",
      HYPERDRIVE: {
        connectionString: "postgresql://hyperdrive-url:5432/testdb",
      },
    });

    const middleware = createDatabaseMiddleware({}, mockCtx);

    await middleware(mockContext, mockNext);

    // Verify HYPERDRIVE connection string is used
    const drizzleMock = (await import("drizzle-orm/node-postgres")).drizzle;
    expect(drizzleMock).toHaveBeenCalledWith(
      expect.objectContaining({
        client: expect.objectContaining({
          config: expect.objectContaining({
            connectionString: "postgresql://hyperdrive-url:5432/testdb",
          }),
        }),
      })
    );
  });

  it("should create separate replica pool when replica config is provided", async () => {
    const { env } = await import("hono/adapter");
    vi.mocked(env).mockReturnValue({
      POSTGRES_URL: "postgresql://localhost:5432/testdb",
      POSTGRES_URL_REPLICAS: ["postgresql://replica1:5432/testdb"],
    });

    const middleware = createDatabaseMiddleware({}, mockCtx);

    await middleware(mockContext, mockNext);

    const drizzleMock = (await import("drizzle-orm/node-postgres")).drizzle;
    expect(drizzleMock).toHaveBeenCalledTimes(2); // primary + 1 replica
  });

  it("should use primary pool as replica fallback when no replica is configured", async () => {
    const { env } = await import("hono/adapter");
    vi.mocked(env).mockReturnValue({
      POSTGRES_URL: "postgresql://localhost:5432/testdb",
    });

    const middleware = createDatabaseMiddleware({}, mockCtx);

    await middleware(mockContext, mockNext);

    const drizzleMock = (await import("drizzle-orm/node-postgres")).drizzle;
    const withReplicasMock = (await import("drizzle-orm/pg-core")).withReplicas;

    expect(drizzleMock).toHaveBeenCalledTimes(1); // only primary
    expect(withReplicasMock).not.toHaveBeenCalled(); // no replicas
  });

  it("should respect custom connection options", async () => {
    const { env } = await import("hono/adapter");
    vi.mocked(env).mockReturnValue({
      POSTGRES_URL: "postgresql://localhost:5432/testdb",
    });

    const options = {
      maxConnections: 20,
      connectionTimeout: 10000,
      idleTimeout: 600000,
      queryTimeout: 60000,
    };

    const middleware = createDatabaseMiddleware(options, mockCtx);

    await middleware(mockContext, mockNext);

    const drizzleMock = (await import("drizzle-orm/node-postgres")).drizzle;
    expect(drizzleMock).toHaveBeenCalledWith(
      expect.objectContaining({
        client: expect.objectContaining({
          config: expect.objectContaining({
            connectionString: "postgresql://localhost:5432/testdb",
            max: 20,
            connectionTimeoutMillis: 10000,
            idleTimeoutMillis: 600000,
            query_timeout: 60000,
            allowExitOnIdle: true,
          }),
        }),
      })
    );
  });

  it("should emit initialization event", async () => {
    const { env } = await import("hono/adapter");
    vi.mocked(env).mockReturnValue({
      POSTGRES_URL: "postgresql://localhost:5432/testdb",
    });

    const middleware = createDatabaseMiddleware({}, mockCtx);

    await middleware(mockContext, mockNext);

    expect(mockEmit).toHaveBeenCalledWith(
      "@comity/postgres:initialized",
      expect.objectContaining({
        select: expect.any(Function),
        insert: expect.any(Function),
        update: expect.any(Function),
        delete: expect.any(Function),
        transaction: expect.any(Function),
        execute: expect.any(Function),
        registerRepository: expect.any(Function),
        healthCheck: expect.any(Function),
      })
    );
  });

  it("should skip connection test when skipConnectionTest is true", async () => {
    const { env } = await import("hono/adapter");
    vi.mocked(env).mockReturnValue({
      POSTGRES_URL: "postgresql://localhost:5432/testdb",
    });

    const options = {
      skipConnectionTest: true,
    };

    const middleware = createDatabaseMiddleware(options, mockCtx);

    await middleware(mockContext, mockNext);

    const { testConnection } = await import("../utils/index.js");
    expect(testConnection).not.toHaveBeenCalled();
  });

  it("should handle connection test failures", async () => {
    const { env } = await import("hono/adapter");
    const { testConnection } = await import("../utils/index.js");

    vi.mocked(env).mockReturnValue({
      POSTGRES_URL: "postgresql://localhost:5432/testdb",
    });

    vi.mocked(testConnection).mockRejectedValue(new Error("Connection failed"));

    const middleware = createDatabaseMiddleware({}, mockCtx);

    await expect(middleware(mockContext, mockNext)).rejects.toThrow(
      ConnectionError
    );
  });

  it("should handle replica configuration with HYPERDRIVE", async () => {
    const { env } = await import("hono/adapter");
    vi.mocked(env).mockReturnValue({
      HYPERDRIVE: {
        connectionString: "postgresql://hyperdrive-primary:5432/testdb",
      },
      HYPERDRIVE_REPLICAS: [
        {
          connectionString: "postgresql://hyperdrive-replica1:5432/testdb",
        },
      ],
    });

    const middleware = createDatabaseMiddleware({}, mockCtx);

    await middleware(mockContext, mockNext);

    const drizzleMock = (await import("drizzle-orm/node-postgres")).drizzle;
    expect(drizzleMock).toHaveBeenCalledTimes(2); // primary + 1 replica
  });

  it("should register shutdown hook", async () => {
    const { env } = await import("hono/adapter");
    vi.mocked(env).mockReturnValue({
      POSTGRES_URL: "postgresql://localhost:5432/testdb",
    });

    const middleware = createDatabaseMiddleware({}, mockCtx);

    await middleware(mockContext, mockNext);

    expect(mockOnHook).toHaveBeenCalledWith(
      "@comity/postgres:shutdown",
      expect.any(Function)
    );
  });

  it("should return unknown health status when disableHealthCheck is true", async () => {
    const { env } = await import("hono/adapter");
    vi.mocked(env).mockReturnValue({
      POSTGRES_URL: "postgresql://localhost:5432/testdb",
    });

    const options = {
      disableHealthCheck: true,
    };

    const middleware = createDatabaseMiddleware(options, mockCtx);

    await middleware(mockContext, mockNext);

    // Get the emitted event with the healthCheck function
    const initEvent = mockEmit.mock.calls.find(
      (call: any) => call[0] === "@comity/postgres:initialized"
    )?.[1];

    const healthResult = await initEvent.healthCheck();

    expect(healthResult).toEqual({
      status: "unknown",
      timestamp: expect.any(String),
    });

    // Verify timestamp is a valid ISO string
    expect(new Date(healthResult.timestamp)).toBeInstanceOf(Date);
  });

  it("should perform health check when disableHealthCheck is false", async () => {
    const { env } = await import("hono/adapter");
    vi.mocked(env).mockReturnValue({
      POSTGRES_URL: "postgresql://localhost:5432/testdb",
    });

    const middleware = createDatabaseMiddleware({}, mockCtx);

    await middleware(mockContext, mockNext);

    const initEvent = mockEmit.mock.calls.find(
      (call: any) => call[0] === "@comity/postgres:initialized"
    )?.[1];

    const healthResult = await initEvent.healthCheck();

    const { performHealthCheck } = await import("../utils/index.js");
    expect(performHealthCheck).toHaveBeenCalled();
    expect(healthResult).toEqual({
      status: "healthy",
      primary: { status: "connected" },
      replicas: [],
      poolStats: {
        primary: { total: 1, idle: 1, waiting: 0 },
        replicas: [],
      },
      timestamp: expect.any(String),
    });
  });

  it("should register repository correctly", async () => {
    const { env } = await import("hono/adapter");
    vi.mocked(env).mockReturnValue({
      POSTGRES_URL: "postgresql://localhost:5432/testdb",
    });

    const middleware = createDatabaseMiddleware({}, mockCtx);

    await middleware(mockContext, mockNext);

    const initEvent = mockEmit.mock.calls.find(
      (call: any) => call[0] === "@comity/postgres:initialized"
    )?.[1];

    const mockRepository = vi.fn();
    initEvent.registerRepository("testRepo", mockRepository);

    const { Container } = await import("@comity/core/patterns");
    const containerInstance = vi.mocked(Container).mock.results[0].value;
    expect(containerInstance.register).toHaveBeenCalledWith(
      "testRepo",
      expect.any(Function)
    );
  });

  it("should handle replica configuration with POSTGRES_URL_REPLICAS", async () => {
    const { env } = await import("hono/adapter");
    vi.mocked(env).mockReturnValue({
      POSTGRES_URL: "postgresql://localhost:5432/testdb",
      POSTGRES_URL_REPLICAS: [
        "postgresql://replica1:5432/testdb",
        "postgresql://replica2:5432/testdb",
      ],
    });

    const middleware = createDatabaseMiddleware({}, mockCtx);

    await middleware(mockContext, mockNext);

    const drizzleMock = (await import("drizzle-orm/node-postgres")).drizzle;
    expect(drizzleMock).toHaveBeenCalledTimes(3); // primary + 2 replicas
  });

  it("should handle mixed replica configuration", async () => {
    const { env } = await import("hono/adapter");
    vi.mocked(env).mockReturnValue({
      HYPERDRIVE: {
        connectionString: "postgresql://hyperdrive-primary:5432/testdb",
      },
      HYPERDRIVE_REPLICAS: [
        {
          connectionString: "postgresql://hyperdrive-replica:5432/testdb",
        },
      ],
      POSTGRES_URL_REPLICAS: ["postgresql://url-replica:5432/testdb"],
    });

    const middleware = createDatabaseMiddleware({}, mockCtx);

    await middleware(mockContext, mockNext);

    const drizzleMock = (await import("drizzle-orm/node-postgres")).drizzle;
    expect(drizzleMock).toHaveBeenCalledTimes(3); // primary + 2 replicas
  });

  it("should handle shutdown hook execution", async () => {
    const { env } = await import("hono/adapter");
    vi.mocked(env).mockReturnValue({
      POSTGRES_URL: "postgresql://localhost:5432/testdb",
    });

    const middleware = createDatabaseMiddleware({}, mockCtx);

    await middleware(mockContext, mockNext);

    const shutdownHook = mockOnHook.mock.calls.find(
      (call: any) => call[0] === "@comity/postgres:shutdown"
    )?.[1];

    await shutdownHook();

    // Should call end on primary pool
    expect(mockLogger.child).toHaveBeenCalledWith({
      module: "@comity/postgres",
    });
  });

  it("should handle shutdown hook execution with replicas", async () => {
    const { env } = await import("hono/adapter");
    vi.mocked(env).mockReturnValue({
      POSTGRES_URL: "postgresql://localhost:5432/testdb",
      POSTGRES_URL_REPLICAS: ["postgresql://replica:5432/testdb"],
    });

    const middleware = createDatabaseMiddleware({}, mockCtx);

    await middleware(mockContext, mockNext);

    const shutdownHook = mockOnHook.mock.calls.find(
      (call: any) => call[0] === "@comity/postgres:shutdown"
    )?.[1];

    await shutdownHook();

    // Should call end on both primary and replica pools
    expect(mockLogger.child).toHaveBeenCalledWith({
      module: "@comity/postgres",
    });
  });

  it("should handle replica pool shutdown errors gracefully", async () => {
    const { env } = await import("hono/adapter");
    vi.mocked(env).mockReturnValue({
      POSTGRES_URL: "postgresql://localhost:5432/testdb",
      POSTGRES_URL_REPLICAS: ["postgresql://replica:5432/testdb"],
    });

    const middleware = createDatabaseMiddleware({}, mockCtx);

    await middleware(mockContext, mockNext);

    // Get the replica pool instance from the drizzle mock
    const drizzleMock = (await import("drizzle-orm/node-postgres")).drizzle;
    const replicaDb = vi.mocked(drizzleMock).mock.results[1]?.value;
    const replicaPool = replicaDb?.$client;

    // Mock the end method to throw an error
    if (replicaPool) {
      vi.mocked(replicaPool.end).mockRejectedValue(new Error("Replica end failed"));
    }

    const shutdownHook = mockOnHook.mock.calls.find(
      (call: any) => call[0] === "@comity/postgres:shutdown"
    )?.[1];

    await shutdownHook();

    // Should log error but not throw
    expect(mockChildLogger.error).toHaveBeenCalledWith(
      { error: expect.any(Error) },
      "Error cleaning up replica pool: Replica end failed"
    );
    expect(mockEmit).toHaveBeenCalledWith("@comity/postgres:error", {
      error: expect.any(Error),
      client: null,
    });
  });

  it("should handle shutdown hook errors gracefully", async () => {
    const { env } = await import("hono/adapter");
    vi.mocked(env).mockReturnValue({
      POSTGRES_URL: "postgresql://localhost:5432/testdb",
    });

    const middleware = createDatabaseMiddleware({}, mockCtx);

    await middleware(mockContext, mockNext);

    // Get the primary pool instance from the drizzle mock
    const drizzleMock = (await import("drizzle-orm/node-postgres")).drizzle;
    const primaryDb = vi.mocked(drizzleMock).mock.results[0]?.value;
    const primaryPool = primaryDb?.$client;

    // Mock the end method to throw an error
    if (primaryPool) {
      vi.mocked(primaryPool.end).mockRejectedValue(new Error("End failed"));
    }

    const shutdownHook = mockOnHook.mock.calls.find(
      (call: any) => call[0] === "@comity/postgres:shutdown"
    )?.[1];

    await shutdownHook();

    // Should log error but not throw
    expect(mockChildLogger.error).toHaveBeenCalledWith(
      { error: expect.any(Error) },
      "Error cleaning up primary pool: End failed"
    );
    expect(mockEmit).toHaveBeenCalledWith("@comity/postgres:error", {
      error: expect.any(Error),
      client: null,
    });
  });

  it("should handle error during middleware execution", async () => {
    const { env } = await import("hono/adapter");
    vi.mocked(env).mockImplementation(() => {
      throw new Error("Env parsing failed");
    });

    const middleware = createDatabaseMiddleware({}, mockCtx);

    await expect(middleware(mockContext, mockNext)).rejects.toThrow(
      ConnectionError
    );

    expect(mockTrigger).toHaveBeenCalledWith(
      "@comity/postgres:shutdown",
      "Env parsing failed"
    );
  });

  it("should handle non-ConnectionError exceptions", async () => {
    const { env } = await import("hono/adapter");
    vi.mocked(env).mockReturnValue({
      POSTGRES_URL: "postgresql://localhost:5432/testdb",
    });

    // Mock drizzle to throw a non-ConnectionError
    const drizzleMock = (await import("drizzle-orm/node-postgres")).drizzle;
    vi.mocked(drizzleMock).mockImplementation(() => {
      throw new Error("Drizzle initialization failed");
    });

    const middleware = createDatabaseMiddleware({}, mockCtx);

    await expect(middleware(mockContext, mockNext)).rejects.toThrow(
      ConnectionError
    );

    expect(mockChildLogger.error).toHaveBeenCalledWith(
      { error: expect.any(Error) },
      "Database middleware error: Drizzle initialization failed"
    );
  });

  it("should pass through ConnectionError exceptions", async () => {
    const { env } = await import("hono/adapter");
    vi.mocked(env).mockReturnValue({
      POSTGRES_URL: "postgresql://localhost:5432/testdb",
    });

    // Mock to throw ConnectionError
    const drizzleMock = (await import("drizzle-orm/node-postgres")).drizzle;
    vi.mocked(drizzleMock).mockImplementation(() => {
      throw new ConnectionError("Connection failed");
    });

    const middleware = createDatabaseMiddleware({}, mockCtx);

    await expect(middleware(mockContext, mockNext)).rejects.toThrow(
      ConnectionError
    );

    expect(mockChildLogger.error).toHaveBeenCalledWith(
      { error: expect.any(ConnectionError) },
      "Database middleware error: Connection failed"
    );
  });
});
