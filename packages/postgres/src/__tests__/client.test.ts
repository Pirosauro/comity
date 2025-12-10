import { describe, it, expect, vi, beforeEach } from "vitest";
import { Client } from "../client.js";

// Mock the Pool constructor and methods
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

describe("Client", () => {
  let mockCtx: any;
  let mockLogger: any;
  let mockEmit: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockLogger = {
      error: vi.fn(),
      info: vi.fn(),
      debug: vi.fn(),
      child: vi.fn().mockReturnValue({
        error: vi.fn(),
        info: vi.fn(),
        debug: vi.fn(),
      }),
    };

    mockEmit = vi.fn();

    mockCtx = {
      logger: mockLogger,
      emit: mockEmit,
    };
  });

  it("should create a client instance extending Pool", () => {
    const config = { connectionString: "postgresql://localhost:5432/test" };
    const client = new Client(config, mockCtx);

    expect(client).toBeInstanceOf(Client);
    expect((client as any).config).toEqual(config);
  });

  it("should set up error event handler", () => {
    const config = { connectionString: "postgresql://localhost:5432/test" };
    const client = new Client(config, mockCtx);

    expect(client.on).toHaveBeenCalledWith("error", expect.any(Function));
  });

  it("should handle error events and emit postgres error events", () => {
    const config = { connectionString: "postgresql://localhost:5432/test" };
    const client = new Client(config, mockCtx);

    // Get the error handler
    const errorHandler = client.on.mock.calls.find(
      (call) => call[0] === "error"
    )?.[1];
    expect(errorHandler).toBeDefined();

    const mockError = new Error("Connection failed");
    const mockClient = {};

    // Call the error handler
    errorHandler(mockError, mockClient);

    expect(mockLogger.error).toHaveBeenCalledWith(
      { error: mockError },
      "Database pool error: Connection failed"
    );
    expect(mockEmit).toHaveBeenCalledWith("@comity/postgres:error", {
      client: mockClient,
      error: mockError,
    });
  });

  it("should handle error events with non-Error objects", () => {
    const config = { connectionString: "postgresql://localhost:5432/test" };
    const client = new Client(config, mockCtx);

    const errorHandler = client.on.mock.calls.find(
      (call) => call[0] === "error"
    )?.[1];
    const mockError = "String error";
    const mockClient = {};

    errorHandler(mockError, mockClient);

    expect(mockLogger.error).toHaveBeenCalledWith(
      { error: mockError },
      "Database pool error: Unknown error"
    );
  });

  it("should set up release event handler", () => {
    const config = { connectionString: "postgresql://localhost:5432/test" };
    const client = new Client(config, mockCtx);

    expect(client.on).toHaveBeenCalledWith("release", expect.any(Function));
  });

  it("should handle release events with errors", () => {
    const config = { connectionString: "postgresql://localhost:5432/test" };
    const client = new Client(config, mockCtx);

    const releaseHandler = client.on.mock.calls.find(
      (call) => call[0] === "release"
    )?.[1];
    expect(releaseHandler).toBeDefined();

    const mockError = new Error("Release failed");
    const mockClient = {};

    releaseHandler(mockError, mockClient);

    expect(mockLogger.error).toHaveBeenCalledWith(
      { error: mockError },
      "Database pool release error: Release failed"
    );
    expect(mockEmit).toHaveBeenCalledWith("@comity/postgres:release", {
      client: mockClient,
      error: mockError,
    });
  });

  it("should handle release events without errors", () => {
    const config = { connectionString: "postgresql://localhost:5432/test" };
    const client = new Client(config, mockCtx);

    const releaseHandler = client.on.mock.calls.find(
      (call) => call[0] === "release"
    )?.[1];

    releaseHandler(null, {});

    expect(mockEmit).toHaveBeenCalledWith("@comity/postgres:release", {
      client: {},
      error: null,
    });
  });

  it("should set up connect event handler", () => {
    const config = { connectionString: "postgresql://localhost:5432/test" };
    const client = new Client(config, mockCtx);

    expect(client.on).toHaveBeenCalledWith("connect", expect.any(Function));
  });

  it("should handle connect events", () => {
    const config = { connectionString: "postgresql://localhost:5432/test" };
    const client = new Client(config, mockCtx);

    const connectHandler = client.on.mock.calls.find(
      (call) => call[0] === "connect"
    )?.[1];
    const mockClient = {};

    connectHandler(mockClient);

    expect(mockEmit).toHaveBeenCalledWith("@comity/postgres:connect", {
      client: mockClient,
    });
  });

  it("should set up acquire event handler", () => {
    const config = { connectionString: "postgresql://localhost:5432/test" };
    const client = new Client(config, mockCtx);

    expect(client.on).toHaveBeenCalledWith("acquire", expect.any(Function));
  });

  it("should handle acquire events", () => {
    const config = { connectionString: "postgresql://localhost:5432/test" };
    const client = new Client(config, mockCtx);

    const acquireHandler = client.on.mock.calls.find(
      (call) => call[0] === "acquire"
    )?.[1];
    const mockClient = {};

    acquireHandler(mockClient);

    expect(mockEmit).toHaveBeenCalledWith("@comity/postgres:acquire", {
      client: mockClient,
    });
  });

  it("should set up remove event handler", () => {
    const config = { connectionString: "postgresql://localhost:5432/test" };
    const client = new Client(config, mockCtx);

    expect(client.on).toHaveBeenCalledWith("remove", expect.any(Function));
  });

  it("should handle remove events", () => {
    const config = { connectionString: "postgresql://localhost:5432/test" };
    const client = new Client(config, mockCtx);

    const removeHandler = client.on.mock.calls.find(
      (call) => call[0] === "remove"
    )?.[1];
    const mockClient = {};

    removeHandler(mockClient);

    expect(mockEmit).toHaveBeenCalledWith("@comity/postgres:remove", {
      client: mockClient,
    });
  });

  it("should set up query event handlers", () => {
    const config = { connectionString: "postgresql://localhost:5432/test" };
    const client = new Client(config, mockCtx);

    expect(client.on).toHaveBeenCalledWith("query-start", expect.any(Function));
    expect(client.on).toHaveBeenCalledWith("query-end", expect.any(Function));
    expect(client.on).toHaveBeenCalledWith("query-error", expect.any(Function));
  });

  it("should handle query-start events", () => {
    const config = { connectionString: "postgresql://localhost:5432/test" };
    const client = new Client(config, mockCtx);

    const queryStartHandler = client.on.mock.calls.find(
      (call) => call[0] === "query-start"
    )?.[1];
    const payload = {
      id: "123",
      query: "SELECT 1",
      params: [],
      timestamp: Date.now(),
    };

    queryStartHandler(payload);

    expect(mockEmit).toHaveBeenCalledWith(
      "@comity/postgres:query-start",
      payload
    );
  });

  it("should handle query-end events", () => {
    const config = { connectionString: "postgresql://localhost:5432/test" };
    const client = new Client(config, mockCtx);

    const queryEndHandler = client.on.mock.calls.find(
      (call) => call[0] === "query-end"
    )?.[1];
    const payload = {
      id: "123",
      result: {},
      timestamp: Date.now(),
      duration: 100,
    };

    queryEndHandler(payload);

    expect(mockEmit).toHaveBeenCalledWith(
      "@comity/postgres:query-end",
      payload
    );
  });

  it("should handle query-error events", () => {
    const config = { connectionString: "postgresql://localhost:5432/test" };
    const client = new Client(config, mockCtx);

    const queryErrorHandler = client.on.mock.calls.find(
      (call) => call[0] === "query-error"
    )?.[1];
    const payload = {
      id: "123",
      error: new Error("Query failed"),
      timestamp: Date.now(),
      duration: 100,
    };

    queryErrorHandler(payload);

    expect(mockEmit).toHaveBeenCalledWith(
      "@comity/postgres:query-error",
      payload
    );
  });

  describe("query method", () => {
    it("should emit query-start and query-end events on successful query", async () => {
      const config = { connectionString: "postgresql://localhost:5432/test" };
      const client = new Client(config, mockCtx);

      const result = await client.query("SELECT 1");

      expect(client.emit).toHaveBeenCalledWith(
        "query-start",
        expect.objectContaining({
          query: "SELECT 1",
          params: undefined,
        })
      );

      expect(client.emit).toHaveBeenCalledWith(
        "query-end",
        expect.objectContaining({
          result: expect.any(Object),
        })
      );

      expect(result).toBeDefined();
    });

    it("should emit query-error event on query failure", async () => {
      const config = { connectionString: "postgresql://localhost:5432/test" };
      const client = new Client(config, mockCtx);

      // Mock the Pool's query to reject
      (client as any).__proto__.__proto__.query.mockRejectedValueOnce(
        new Error("Query failed")
      );

      await expect(client.query("SELECT 1")).rejects.toThrow("Query failed");

      expect(client.emit).toHaveBeenCalledWith(
        "query-start",
        expect.any(Object)
      );
      expect(client.emit).toHaveBeenCalledWith(
        "query-error",
        expect.objectContaining({
          error: expect.any(Error),
        })
      );
    });

    it("should handle query with parameters", async () => {
      const config = { connectionString: "postgresql://localhost:5432/test" };
      const client = new Client(config, mockCtx);

      const params = [1, "test"];
      const result = await client.query(
        "SELECT * FROM table WHERE id = $1 AND name = $2",
        params
      );

      expect(client.emit).toHaveBeenCalledWith(
        "query-start",
        expect.objectContaining({
          query: "SELECT * FROM table WHERE id = $1 AND name = $2",
          params,
        })
      );

      expect(result).toBeDefined();
    });

    it("should handle query with callback", async () => {
      const config = { connectionString: "postgresql://localhost:5432/test" };
      const client = new Client(config, mockCtx);

      const callback = vi.fn();
      const result = await client.query("SELECT 1", undefined, callback);

      expect(result).toBeDefined();
    });
  });
});
