import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
  type Mock,
} from "vitest";
import { createPostgresClient } from "../client.js";
import type { ObservableClientAlike, PostgresClientOptions } from "../types.js";

describe("createPostgresClient", () => {
  let mockClient: ObservableClientAlike;
  let emitMock: Mock;
  let options: PostgresClientOptions;

  beforeEach(() => {
    vi.useFakeTimers();
    emitMock = vi.fn().mockResolvedValue(undefined);
    mockClient = {
      query: vi.fn().mockResolvedValue({ rows: [] }),
      connect: vi.fn().mockResolvedValue(undefined),
      on: vi.fn().mockReturnThis(),
    };
    options = { emit: emitMock as any };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("without emit function", () => {
    it("should return original client when emit is not provided", () => {
      const result = createPostgresClient(mockClient, {} as any);
      expect(result).toBe(mockClient);
    });

    it("should return original client when emit is undefined", () => {
      const result = createPostgresClient(mockClient, {
        emit: undefined as any,
      });
      expect(result).toBe(mockClient);
    });

    it("should not wrap query method without emit", () => {
      const result = createPostgresClient(mockClient, {} as any);
      expect(result.query).toBe(mockClient.query);
    });
  });

  describe("with emit function", () => {
    it("should return a proxied client", () => {
      const result = createPostgresClient(mockClient, options);
      expect(result).not.toBe(mockClient);
    });

    it("should attach error event listener", () => {
      createPostgresClient(mockClient, options);
      expect(mockClient.on).toHaveBeenCalledWith("error", expect.any(Function));
    });

    it("should emit error event when client emits error", () => {
      createPostgresClient(mockClient, options);

      const errorHandler = (mockClient.on as any).mock.calls[0][1];
      const testError = new Error("Test error");
      errorHandler(testError);

      expect(emitMock).toHaveBeenCalledWith("@comity/drizzle:error", {
        error: testError,
      });
    });

    it("should wrap query method", () => {
      const result = createPostgresClient(mockClient, options);
      expect(result.query).not.toBe(mockClient.query);
      expect(typeof result.query).toBe("function");
    });

    it("should preserve other client properties", () => {
      const result = createPostgresClient(mockClient, options);
      expect(result.connect).toBe(mockClient.connect);
    });
  });

  describe("query method wrapping", () => {
    it("should emit start event before query execution", async () => {
      const client = createPostgresClient(mockClient, options);

      const promise = client.query("SELECT 1");
      await vi.runAllTimersAsync();
      await promise;

      const startCall = emitMock.mock.calls.find(
        (call: any) => call[1]?.event === "start"
      );
      expect(startCall).toBeDefined();
      expect(startCall![0]).toBe("@comity/drizzle:query");
    });

    it("should emit end event after successful query", async () => {
      const client = createPostgresClient(mockClient, options);

      await client.query("SELECT 1");

      const endCall = emitMock.mock.calls.find(
        (call: any) => call[1]?.event === "end"
      );
      expect(endCall).toBeDefined();
      expect(endCall![0]).toBe("@comity/drizzle:query");
    });

    it("should call original query method with correct arguments", async () => {
      const client = createPostgresClient(mockClient, options);
      const sql = "SELECT * FROM users WHERE id = $1";
      const values = [1];

      await client.query(sql, values);

      expect(mockClient.query).toHaveBeenCalledWith(sql, values);
    });

    it("should return result from original query", async () => {
      const expectedResult = { rows: [{ id: 1, name: "John" }], rowCount: 1 };
      (mockClient.query as any).mockResolvedValue(expectedResult);

      const client = createPostgresClient(mockClient, options);
      const result = await client.query("SELECT * FROM users");

      expect(result).toEqual(expectedResult);
    });

    it("should emit error event when query fails", async () => {
      const error = new Error("Query failed");
      (mockClient.query as any).mockRejectedValue(error);

      const client = createPostgresClient(mockClient, options);

      await expect(client.query("INVALID SQL")).rejects.toThrow("Query failed");

      const errorCall = emitMock.mock.calls.find(
        (call: any) => call[1]?.event === "error"
      );
      expect(errorCall).toBeDefined();
      expect(errorCall![1].error).toBe(error);
    });

    it("should rethrow query errors", async () => {
      const error = new Error("Database error");
      (mockClient.query as any).mockRejectedValue(error);

      const client = createPostgresClient(mockClient, options);

      await expect(client.query("SELECT 1")).rejects.toBe(error);
    });

    it("should emit events with same id for single query", async () => {
      const client = createPostgresClient(mockClient, options);

      await client.query("SELECT 1");

      const startEvent = emitMock.mock.calls.find(
        (call) => call[1]?.event === "start"
      )?.[1];
      const endEvent = emitMock.mock.calls.find(
        (call) => call[1]?.event === "end"
      )?.[1];

      expect(startEvent.id).toBe(endEvent.id);
    });

    it("should emit events with timing information", async () => {
      vi.setSystemTime(1000);

      (mockClient.query as any).mockImplementation(async () => {
        vi.advanceTimersByTime(100);
        return { rows: [] };
      });

      const client = createPostgresClient(mockClient, options);
      await client.query("SELECT 1");

      const endEvent = emitMock.mock.calls.find(
        (call) => call[1]?.event === "end"
      )?.[1];

      expect(endEvent.startedAt).toBeDefined();
      expect(endEvent.finishedAt).toBeDefined();
      expect(endEvent.duration).toBeGreaterThanOrEqual(0);
    });

    it("should handle multiple concurrent queries", async () => {
      const client = createPostgresClient(mockClient, options);

      await Promise.all([
        client.query("SELECT 1"),
        client.query("SELECT 2"),
        client.query("SELECT 3"),
      ]);

      const startEvents = emitMock.mock.calls.filter(
        (call) => call[1]?.event === "start"
      );
      expect(startEvents).toHaveLength(3);

      const ids = startEvents.map((call) => call[1].id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(3);
    });

    it("should preserve query context (this binding)", async () => {
      const client = createPostgresClient(mockClient, options);

      await client.query("SELECT 1");

      expect(mockClient.query).toHaveBeenCalled();
      const callInstance = (mockClient.query as any).mock.instances[0];
      expect(callInstance).toBe(mockClient);
    });
  });

  describe("proxy behavior", () => {
    it("should proxy get operations for non-query properties", () => {
      const client = createPostgresClient(mockClient, options);

      expect(client.connect).toBe(mockClient.connect);
      expect(client.on).toBe(mockClient.on);
    });

    it("should not interfere with non-query method calls", async () => {
      const client = createPostgresClient(mockClient, options);

      await client.connect();

      expect(mockClient.connect).toHaveBeenCalled();
      // Should not emit query events for connect
      const queryEvents = emitMock.mock.calls.filter(
        (call) => call[0] === "@comity/drizzle:query"
      );
      expect(queryEvents).toHaveLength(0);
    });

    it("should allow adding new properties to proxied client", () => {
      const client = createPostgresClient(mockClient, options);
      (client as any).customProperty = "test";

      expect((client as any).customProperty).toBe("test");
    });
  });

  describe("error event handling", () => {
    it("should handle multiple error events", () => {
      createPostgresClient(mockClient, options);

      const errorHandler = (mockClient.on as any).mock.calls[0][1];

      const error1 = new Error("Error 1");
      const error2 = new Error("Error 2");

      errorHandler(error1);
      errorHandler(error2);

      expect(emitMock).toHaveBeenCalledWith("@comity/drizzle:error", {
        error: error1,
      });
      expect(emitMock).toHaveBeenCalledWith("@comity/drizzle:error", {
        error: error2,
      });
    });

    it("should attach error listener only once", () => {
      createPostgresClient(mockClient, options);

      expect(mockClient.on).toHaveBeenCalledTimes(1);
      expect(mockClient.on).toHaveBeenCalledWith("error", expect.any(Function));
    });
  });

  describe("edge cases", () => {
    it("should handle query returning null", async () => {
      (mockClient.query as any).mockResolvedValue(null);

      const client = createPostgresClient(mockClient, options);
      const result = await client.query("SELECT 1");

      expect(result).toBeNull();
    });

    it("should handle emit function that throws", async () => {
      emitMock.mockRejectedValue(new Error("Emit failed"));

      const client = createPostgresClient(mockClient, options);

      await expect(client.query("SELECT 1")).rejects.toThrow("Emit failed");
    });

    it("should handle client without on method gracefully", () => {
      const clientWithoutOn = {
        query: vi.fn().mockResolvedValue({ rows: [] }),
        connect: vi.fn(),
        on: undefined as any,
      };

      expect(() => createPostgresClient(clientWithoutOn, options)).toThrow();
    });
  });
});
