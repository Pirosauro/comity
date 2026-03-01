import { describe, expect, it } from "vitest";
import { EventBusError } from "../error.js";

describe("EventBusError", () => {
  describe("constructor", () => {
    it("should create an error with handler_failed reason", () => {
      const error = new EventBusError("handler_failed");

      expect(error.message).toBe("Event handler failed");
      expect(error.code).toBe("event-bus:handler_failed");
    });

    it("should include metadata in the error", () => {
      const error = new EventBusError("handler_failed", { cause: "test cause" });

      expect(error.cause).toBe("test cause");
    });

    it("should merge metadata with reason in meta object", () => {
      const meta = { context: "test" };
      const error = new EventBusError("handler_failed", meta);

      expect(error.meta).toEqual({ ...meta, reason: "handler_failed" });
    });

    it("should extend BaseError", () => {
      const error = new EventBusError("handler_failed");

      expect(error).toBeInstanceOf(Error);
    });
  });
});
