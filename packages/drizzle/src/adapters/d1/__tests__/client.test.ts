import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
  type Mock,
} from "vitest";
import { createD1Client } from "../client.js";
import type { ObservableClientAlike, D1ClientOptions } from "../types.js";

describe("createD1Client", () => {
  let mockClient: ObservableClientAlike;
  let emitMock: Mock;
  let options: D1ClientOptions;

  beforeEach(() => {
    vi.useFakeTimers();
    emitMock = vi.fn().mockResolvedValue(undefined);
    mockClient = {
      query: vi.fn().mockResolvedValue({ results: [] }),
    };
    options = { emit: emitMock as any };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("without emit function", () => {
    it("should return original client when emit is not provided", () => {
      const result = createD1Client(mockClient, {} as any);
      expect(result).toBe(mockClient);
    });

    it("should return original client when emit is undefined", () => {
      const result = createD1Client(mockClient, {
        emit: undefined as any,
      });
      expect(result).toBe(mockClient);
    });

    it("should not wrap query method without emit", () => {
      const result = createD1Client(mockClient, {} as any);
      expect(result.query).toBe(mockClient.query);
    });
  });

  describe("with emit function", () => {
    it("should return a proxied client", () => {
      const result = createD1Client(mockClient, options);
      expect(result).not.toBe(mockClient);
    });

    it("should wrap query method", () => {
      const result = createD1Client(mockClient, options);
      expect(result.query).not.toBe(mockClient.query);
      expect(typeof result.query).toBe("function");
    });

    it("should expose kind property as 'd1'", () => {
      const client = createD1Client(mockClient, options) as any;
      expect(client.kind).toBe("d1");
    });

    it("should preserve other client properties", () => {
      (mockClient as any).exec = vi.fn();
      const result = createD1Client(mockClient, options);
      expect((result as any).exec).toBe((mockClient as any).exec);
    });
  });

  describe("query method wrapping", () => {
    it("should emit start event before query execution", async () => {
      const client = createD1Client(mockClient, options);

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
      const client = createD1Client(mockClient, options);

      await client.query("SELECT 1");

      const endCall = emitMock.mock.calls.find(
        (call: any) => call[1]?.event === "end"
      );
      expect(endCall).toBeDefined();
      expect(endCall![0]).toBe("@comity/drizzle:query");
    });

    it("should call original query method with correct arguments", async () => {
      const client = createD1Client(mockClient, options);
      const sql = "SELECT * FROM users WHERE id = ?";
      const values = [1];

      await client.query(sql, values);

      expect(mockClient.query).toHaveBeenCalledWith(sql, values);
    });

    it("should return result from original query", async () => {
      const expectedResult = {
        results: [{ id: 1, name: "John" }],
        success: true,
      };
      (mockClient.query as any).mockResolvedValue(expectedResult);

      const client = createD1Client(mockClient, options);
      const result = await client.query("SELECT * FROM users");

      expect(result).toEqual(expectedResult);
    });

    it("should emit error event when query fails", async () => {
      const error = new Error("Query failed");
      (mockClient.query as any).mockRejectedValue(error);

      const client = createD1Client(mockClient, options);

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

      const client = createD1Client(mockClient, options);

      await expect(client.query("SELECT 1")).rejects.toBe(error);
    });

    it("should emit events with same id for single query", async () => {
      const client = createD1Client(mockClient, options);

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
        return { results: [] };
      });

      const client = createD1Client(mockClient, options);
      await client.query("SELECT 1");

      const endEvent = emitMock.mock.calls.find(
        (call) => call[1]?.event === "end"
      )?.[1];

      expect(endEvent.startedAt).toBeDefined();
      expect(endEvent.finishedAt).toBeDefined();
      expect(endEvent.duration).toBeGreaterThanOrEqual(0);
    });

    it("should handle multiple concurrent queries", async () => {
      const client = createD1Client(mockClient, options);

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
      const client = createD1Client(mockClient, options);

      await client.query("SELECT 1");

      expect(mockClient.query).toHaveBeenCalled();
      const callInstance = (mockClient.query as any).mock.instances[0];
      expect(callInstance).toBe(mockClient);
    });
  });

  describe("proxy behavior", () => {
    it("should proxy get operations for non-query properties", () => {
      (mockClient as any).exec = vi.fn();
      (mockClient as any).prepare = vi.fn();

      const client = createD1Client(mockClient, options);

      expect((client as any).exec).toBe((mockClient as any).exec);
      expect((client as any).prepare).toBe((mockClient as any).prepare);
    });

    it("should not interfere with non-query method calls", async () => {
      (mockClient as any).exec = vi.fn().mockResolvedValue({ success: true });

      const client = createD1Client(mockClient, options);

      await (client as any).exec("CREATE TABLE test (id INTEGER)");

      expect((mockClient as any).exec).toHaveBeenCalled();
      // Should not emit query events for exec
      const queryEvents = emitMock.mock.calls.filter(
        (call) => call[0] === "@comity/drizzle:query"
      );
      expect(queryEvents).toHaveLength(0);
    });

    it("should allow adding new properties to proxied client", () => {
      const client = createD1Client(mockClient, options);
      (client as any).customProperty = "test";

      expect((client as any).customProperty).toBe("test");
    });

    it("should handle reading undefined properties", () => {
      const client = createD1Client(mockClient, options);

      expect((client as any).nonExistentProperty).toBeUndefined();
    });
  });

  describe("event emission", () => {
    it("should emit start event with UUID", async () => {
      const client = createD1Client(mockClient, options);

      await client.query("SELECT 1");

      const startEvent = emitMock.mock.calls.find(
        (call) => call[1]?.event === "start"
      )?.[1];

      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      expect(startEvent.id).toMatch(uuidRegex);
    });

    it("should emit events with ISO timestamps", async () => {
      const testDate = new Date("2024-01-01T12:00:00.000Z");
      vi.setSystemTime(testDate);

      const client = createD1Client(mockClient, options);
      await client.query("SELECT 1");

      const startEvent = emitMock.mock.calls.find(
        (call) => call[1]?.event === "start"
      )?.[1];

      expect(startEvent.timestamp).toBe(testDate.toISOString());
    });

    it("should calculate duration correctly", async () => {
      vi.setSystemTime(1000);

      (mockClient.query as any).mockImplementation(async () => {
        vi.advanceTimersByTime(50);
        return { results: [] };
      });

      const client = createD1Client(mockClient, options);
      await client.query("SELECT 1");

      const endEvent = emitMock.mock.calls.find(
        (call) => call[1]?.event === "end"
      )?.[1];

      expect(endEvent.duration).toBeGreaterThanOrEqual(0);
      expect(endEvent.finishedAt).toBeGreaterThanOrEqual(endEvent.startedAt);
    });

    it("should emit error events with duration", async () => {
      vi.setSystemTime(1000);

      (mockClient.query as any).mockImplementation(async () => {
        vi.advanceTimersByTime(25);
        throw new Error("Query error");
      });

      const client = createD1Client(mockClient, options);

      await expect(client.query("SELECT 1")).rejects.toThrow();

      const errorEvent = emitMock.mock.calls.find(
        (call) => call[1]?.event === "error"
      )?.[1];

      expect(errorEvent.duration).toBeGreaterThanOrEqual(0);
    });
  });

  describe("edge cases", () => {
    it("should handle query with no arguments", async () => {
      const client = createD1Client(mockClient, options);

      await client.query();

      expect(mockClient.query).toHaveBeenCalledWith();
    });

    it("should handle query with multiple arguments", async () => {
      const client = createD1Client(mockClient, options);

      await client.query("SELECT ?", [1], { extra: "option" });

      expect(mockClient.query).toHaveBeenCalledWith("SELECT ?", [1], {
        extra: "option",
      });
    });

    it("should handle query returning null", async () => {
      (mockClient.query as any).mockResolvedValue(null);

      const client = createD1Client(mockClient, options);
      const result = await client.query("SELECT 1");

      expect(result).toBeNull();
    });

    it("should handle query returning undefined", async () => {
      (mockClient.query as any).mockResolvedValue(undefined);

      const client = createD1Client(mockClient, options);
      const result = await client.query("SELECT 1");

      expect(result).toBeUndefined();
    });

    it("should handle emit function that throws", async () => {
      emitMock.mockRejectedValue(new Error("Emit failed"));

      const client = createD1Client(mockClient, options);

      await expect(client.query("SELECT 1")).rejects.toThrow("Emit failed");
    });

    it("should handle non-Error rejection", async () => {
      (mockClient.query as any).mockRejectedValue("string error");

      const client = createD1Client(mockClient, options);

      await expect(client.query("SELECT 1")).rejects.toBe("string error");

      const errorEvent = emitMock.mock.calls.find(
        (call) => call[1]?.event === "error"
      )?.[1];
      expect(errorEvent.error).toBe("string error");
    });

    it("should handle empty string queries", async () => {
      const client = createD1Client(mockClient, options);

      await client.query("");

      expect(mockClient.query).toHaveBeenCalledWith("");
    });

    it("should handle queries with special characters", async () => {
      const client = createD1Client(mockClient, options);
      const specialSql = "SELECT * FROM `table-name` WHERE `col-name` = ?";

      await client.query(specialSql, ["value"]);

      expect(mockClient.query).toHaveBeenCalledWith(specialSql, ["value"]);
    });
  });

  describe("concurrent operations", () => {
    it("should handle rapid sequential queries", async () => {
      const client = createD1Client(mockClient, options);

      for (let i = 0; i < 10; i++) {
        await client.query(`SELECT ${i}`);
      }

      expect(mockClient.query).toHaveBeenCalledTimes(10);
    });

    it("should maintain separate timing for concurrent queries", async () => {
      let delay = 10;
      (mockClient.query as any).mockImplementation(async () => {
        const currentDelay = delay;
        delay += 10;
        vi.advanceTimersByTime(currentDelay);
        return { results: [] };
      });

      const client = createD1Client(mockClient, options);

      await Promise.all([client.query("Q1"), client.query("Q2")]);

      const endEvents = emitMock.mock.calls.filter(
        (call: any) => call[1]?.event === "end"
      );
      expect(endEvents).toHaveLength(2);
      expect(endEvents[0]![1].duration).toBeGreaterThanOrEqual(0);
      expect(endEvents[1]![1].duration).toBeGreaterThanOrEqual(0);
    });
  });
});
