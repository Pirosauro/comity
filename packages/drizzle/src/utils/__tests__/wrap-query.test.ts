import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
  type Mock,
} from "vitest";
import { wrapQuery } from "../wrap-query.js";

describe("wrapQuery", () => {
  let emitMock: Mock;
  let originalFunction: Mock;
  let target: any;

  beforeEach(() => {
    vi.useFakeTimers();
    emitMock = vi.fn().mockResolvedValue(undefined);
    originalFunction = vi.fn().mockResolvedValue({ data: "test" });
    target = { name: "test-target" };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("successful query execution", () => {
    it("should emit start event before execution", async () => {
      const wrapped = wrapQuery(
        "postgres",
        target,
        originalFunction as any,
        emitMock as any
      );

      const promise = wrapped("arg1", "arg2");
      await vi.runAllTimersAsync();
      await promise;

      expect(emitMock).toHaveBeenCalledWith(
        "@comity/drizzle:query",
        expect.objectContaining({
          event: "start",
          id: expect.any(String),
          timestamp: expect.any(String),
          startedAt: expect.any(Number),
        })
      );
    });

    it("should emit end event after successful execution", async () => {
      const wrapped = wrapQuery(
        "postgres",
        target,
        originalFunction as any,
        emitMock as any
      );

      await wrapped("arg1");

      expect(emitMock).toHaveBeenCalledWith(
        "@comity/drizzle:query",
        expect.objectContaining({
          event: "end",
          id: expect.any(String),
          timestamp: expect.any(String),
          startedAt: expect.any(Number),
          finishedAt: expect.any(Number),
          duration: expect.any(Number),
        })
      );
    });

    it("should call original function with correct context and arguments", async () => {
      const wrapped = wrapQuery(
        "postgres",
        target,
        originalFunction as any,
        emitMock as any
      );

      await wrapped("arg1", "arg2", "arg3");

      expect(originalFunction).toHaveBeenCalledWith("arg1", "arg2", "arg3");
      expect(originalFunction.mock.instances[0]).toBe(target);
    });

    it("should return the result from original function", async () => {
      const expectedResult = { id: 1, name: "test" };
      originalFunction.mockResolvedValue(expectedResult);

      const wrapped = wrapQuery(
        "postgres",
        target,
        originalFunction as any,
        emitMock as any
      );
      const result = await wrapped();

      expect(result).toEqual(expectedResult);
    });

    it("should emit events in correct order", async () => {
      const wrapped = wrapQuery(
        "postgres",
        target,
        originalFunction as any,
        emitMock as any
      );

      await wrapped();

      expect(emitMock).toHaveBeenCalledTimes(2);
      const firstCall = emitMock.mock.calls[0]![1];
      const secondCall = emitMock.mock.calls[1]![1];

      expect(firstCall.event).toBe("start");
      expect(secondCall.event).toBe("end");
    });

    it("should use same id for start and end events", async () => {
      const wrapped = wrapQuery(
        "postgres",
        target,
        originalFunction as any,
        emitMock as any
      );

      await wrapped();

      const startEvent = emitMock.mock.calls[0]![1];
      const endEvent = emitMock.mock.calls[1]![1];

      expect(startEvent.id).toBe(endEvent.id);
      expect(startEvent.id).toBeTruthy();
    });

    it("should calculate duration correctly", async () => {
      const startTime = 1000;
      vi.setSystemTime(startTime);

      originalFunction.mockImplementation(async () => {
        vi.advanceTimersByTime(100);
        return "result";
      });

      const wrapped = wrapQuery(
        "postgres",
        target,
        originalFunction as any,
        emitMock as any
      );

      await wrapped();

      const endEvent = emitMock.mock.calls[1]![1];
      expect(endEvent.duration).toBeGreaterThanOrEqual(0);
      expect(endEvent.finishedAt).toBeGreaterThanOrEqual(endEvent.startedAt);
    });

    it("should generate valid UUID for event id", async () => {
      const wrapped = wrapQuery(
        "postgres",
        target,
        originalFunction as any,
        emitMock as any
      );

      await wrapped();

      const startEvent = emitMock.mock.calls[0]![1];
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      expect(startEvent.id).toMatch(uuidRegex);
    });

    it("should generate ISO timestamp", async () => {
      const testDate = new Date("2024-01-01T12:00:00.000Z");
      vi.setSystemTime(testDate);

      const wrapped = wrapQuery(
        "postgres",
        target,
        originalFunction as any,
        emitMock as any
      );

      await wrapped();

      const startEvent = emitMock.mock.calls[0]![1];
      expect(startEvent.timestamp).toBe(testDate.toISOString());
    });
  });

  describe("error handling", () => {
    it("should emit error event when original function throws", async () => {
      const error = new Error("Test error");
      originalFunction.mockRejectedValue(error);

      const wrapped = wrapQuery(
        "postgres",
        target,
        originalFunction as any,
        emitMock as any
      );

      await expect(wrapped()).rejects.toThrow("Test error");

      expect(emitMock).toHaveBeenCalledWith(
        "@comity/drizzle:query",
        expect.objectContaining({
          event: "error",
          id: expect.any(String),
          timestamp: expect.any(String),
          startedAt: expect.any(Number),
          finishedAt: expect.any(Number),
          duration: expect.any(Number),
          error: error,
        })
      );
    });

    it("should emit start and error events on failure", async () => {
      originalFunction.mockRejectedValue(new Error("Failure"));

      const wrapped = wrapQuery(
        "postgres",
        target,
        originalFunction as any,
        emitMock as any
      );

      await expect(wrapped()).rejects.toThrow("Failure");

      expect(emitMock).toHaveBeenCalledTimes(2);
      expect(emitMock.mock.calls[0]![1].event).toBe("start");
      expect(emitMock.mock.calls[1]![1].event).toBe("error");
    });

    it("should rethrow the original error", async () => {
      const error = new Error("Original error");
      originalFunction.mockRejectedValue(error);

      const wrapped = wrapQuery(
        "postgres",
        target,
        originalFunction as any,
        emitMock as any
      );

      await expect(wrapped()).rejects.toBe(error);
    });

    it("should use same id for start and error events", async () => {
      originalFunction.mockRejectedValue(new Error("Error"));

      const wrapped = wrapQuery(
        "postgres",
        target,
        originalFunction as any,
        emitMock as any
      );

      await expect(wrapped()).rejects.toThrow();

      const startEvent = emitMock.mock.calls[0]![1];
      const errorEvent = emitMock.mock.calls[1]![1];

      expect(startEvent.id).toBe(errorEvent.id);
    });

    it("should calculate duration for error events", async () => {
      vi.setSystemTime(1000);

      originalFunction.mockImplementation(async () => {
        vi.advanceTimersByTime(50);
        throw new Error("Delayed error");
      });

      const wrapped = wrapQuery(
        "postgres",
        target,
        originalFunction as any,
        emitMock as any
      );

      await expect(wrapped()).rejects.toThrow();

      const errorEvent = emitMock.mock.calls[1]![1];
      expect(errorEvent.duration).toBeGreaterThanOrEqual(0);
      expect(errorEvent.finishedAt).toBeGreaterThanOrEqual(
        errorEvent.startedAt
      );
    });

    it("should handle non-Error objects as errors", async () => {
      const stringError = "String error";
      originalFunction.mockRejectedValue(stringError);

      const wrapped = wrapQuery(
        "postgres",
        target,
        originalFunction as any,
        emitMock as any
      );

      await expect(wrapped()).rejects.toBe(stringError);

      const errorEvent = emitMock.mock.calls[1]![1];
      expect(errorEvent.error).toBe(stringError);
    });

    it("should handle undefined errors", async () => {
      originalFunction.mockRejectedValue(undefined);

      const wrapped = wrapQuery(
        "postgres",
        target,
        originalFunction as any,
        emitMock as any
      );

      await expect(wrapped()).rejects.toBeUndefined();

      const errorEvent = emitMock.mock.calls[1]![1];
      expect(errorEvent.error).toBeUndefined();
    });
  });

  describe("multiple invocations", () => {
    it("should generate unique ids for multiple calls", async () => {
      const wrapped = wrapQuery(
        "postgres",
        target,
        originalFunction as any,
        emitMock as any
      );

      await wrapped();
      await wrapped();

      const firstStartId = emitMock.mock.calls[0]![1].id;
      const secondStartId = emitMock.mock.calls[2]![1].id;

      expect(firstStartId).not.toBe(secondStartId);
    });

    it("should track timing independently for multiple calls", async () => {
      let delay = 50;
      originalFunction.mockImplementation(async () => {
        vi.advanceTimersByTime(delay);
        delay += 50;
        return "result";
      });

      const wrapped = wrapQuery(
        "postgres",
        target,
        originalFunction as any,
        emitMock as any
      );

      await wrapped();
      await wrapped();

      const firstDuration = emitMock.mock.calls[1]![1].duration;
      const secondDuration = emitMock.mock.calls[3]![1].duration;

      expect(firstDuration).toBeGreaterThanOrEqual(0);
      expect(secondDuration).toBeGreaterThanOrEqual(0);
    });
  });

  describe("edge cases", () => {
    it("should handle function with no arguments", async () => {
      const wrapped = wrapQuery(
        "postgres",
        target,
        originalFunction as any,
        emitMock as any
      );

      await wrapped();

      expect(originalFunction).toHaveBeenCalledWith();
      expect(originalFunction).toHaveBeenCalledTimes(1);
    });

    it("should handle function with many arguments", async () => {
      const wrapped = wrapQuery(
        "postgres",
        target,
        originalFunction as any,
        emitMock as any
      );

      await wrapped(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

      expect(originalFunction).toHaveBeenCalledWith(
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10
      );
    });

    it("should handle null return value", async () => {
      originalFunction.mockResolvedValue(null);

      const wrapped = wrapQuery(
        "postgres",
        target,
        originalFunction as any,
        emitMock as any
      );
      const result = await wrapped();

      expect(result).toBeNull();
    });

    it("should handle undefined return value", async () => {
      originalFunction.mockResolvedValue(undefined);

      const wrapped = wrapQuery(
        "postgres",
        target,
        originalFunction as any,
        emitMock as any
      );
      const result = await wrapped();

      expect(result).toBeUndefined();
    });

    it("should preserve array return values", async () => {
      const arrayResult = [1, 2, 3, 4, 5];
      originalFunction.mockResolvedValue(arrayResult);

      const wrapped = wrapQuery(
        "postgres",
        target,
        originalFunction as any,
        emitMock as any
      );
      const result = await wrapped();

      expect(result).toEqual(arrayResult);
    });
  });

  describe("emit function", () => {
    it("should call emit with correct event name", async () => {
      const wrapped = wrapQuery(
        "postgres",
        target,
        originalFunction as any,
        emitMock as any
      );

      await wrapped();

      expect(emitMock).toHaveBeenCalledWith(
        "@comity/drizzle:query",
        expect.anything()
      );
    });

    it("should handle emit returning a promise", async () => {
      emitMock.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 10))
      );

      const wrapped = wrapQuery(
        "postgres",
        target,
        originalFunction as any,
        emitMock as any
      );

      const promise = wrapped();
      await vi.runAllTimersAsync();
      await expect(promise).resolves.toBeDefined();
    });

    it("should await emit before proceeding", async () => {
      const callOrder: string[] = [];

      emitMock.mockImplementation(async (event, payload) => {
        callOrder.push(`emit-${payload.event}`);
      });

      originalFunction.mockImplementation(async () => {
        callOrder.push("execute");
        return "result";
      });

      const wrapped = wrapQuery(
        "postgres",
        target,
        originalFunction as any,
        emitMock as any
      );

      await wrapped();

      expect(callOrder).toEqual(["emit-start", "execute", "emit-end"]);
    });
  });
});
