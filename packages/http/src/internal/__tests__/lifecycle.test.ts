import { beforeEach, describe, expect, it } from "vitest";
import { Lifecycle } from "../lifecycle.js";

describe("Lifecycle", () => {
  let lifecycle: Lifecycle;

  beforeEach(() => {
    lifecycle = new Lifecycle();
  });

  describe("constructor", () => {
    it("should initialize in open state", () => {
      expect(lifecycle.state).toBe("open");
    });
  });

  describe("state getter", () => {
    it("should return current state", () => {
      expect(lifecycle.state).toBe("open");
    });
  });

  describe("is", () => {
    it("should return true for matching state", () => {
      expect(lifecycle.is("open")).toBe(true);
      expect(lifecycle.is("sealed")).toBe(false);
    });

    it("should work after seal", () => {
      lifecycle.seal();

      expect(lifecycle.is("sealed")).toBe(true);
      expect(lifecycle.is("open")).toBe(false);
    });

    it("should work after start", () => {
      lifecycle.seal();
      lifecycle.start();

      expect(lifecycle.is("running")).toBe(true);
      expect(lifecycle.is("sealed")).toBe(false);
    });
  });

  describe("seal", () => {
    it("should transition from open to sealed", () => {
      const result = lifecycle.seal();

      expect(result.success).toBe(true);
      expect(result.value).toBe("sealed");
      expect(lifecycle.state).toBe("sealed");
    });

    it("should fail if already sealed", () => {
      lifecycle.seal();

      const result = lifecycle.seal();

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.meta.action).toBe("seal");
      expect(result.error?.meta.state).toBe("sealed");
    });

    it("should fail if running", () => {
      lifecycle.seal();
      lifecycle.start();

      const result = lifecycle.seal();

      expect(result.success).toBe(false);
      expect(result.error?.meta.state).toBe("running");
    });
  });

  describe("start", () => {
    it("should transition from sealed to running", () => {
      lifecycle.seal();

      const result = lifecycle.start();

      expect(result.success).toBe(true);
      expect(result.value).toBe("running");
      expect(lifecycle.state).toBe("running");
    });

    it("should fail if not sealed", () => {
      const result = lifecycle.start();

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.meta.action).toBe("start");
      expect(result.error?.meta.state).toBe("open");
    });

    it("should fail if already running", () => {
      lifecycle.seal();
      lifecycle.start();

      const result = lifecycle.start();

      expect(result.success).toBe(false);
      expect(result.error?.meta.state).toBe("running");
    });
  });

  describe("stop", () => {
    it("should transition from running to sealed", () => {
      lifecycle.seal();
      lifecycle.start();

      const result = lifecycle.stop();

      expect(result.success).toBe(true);
      expect(result.value).toBe("sealed");
      expect(lifecycle.state).toBe("sealed");
    });

    it("should fail if not running", () => {
      const result = lifecycle.stop();

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.meta.action).toBe("stop");
      expect(result.error?.meta.state).toBe("open");
    });

    it("should fail if only sealed", () => {
      lifecycle.seal();

      const result = lifecycle.stop();

      expect(result.success).toBe(false);
      expect(result.error?.meta.state).toBe("sealed");
    });

    it("should allow restart after stop", () => {
      lifecycle.seal();
      lifecycle.start();
      lifecycle.stop();

      const startResult = lifecycle.start();

      expect(startResult.success).toBe(true);
      expect(lifecycle.state).toBe("running");
    });
  });

  describe("state transitions", () => {
    it("should follow correct lifecycle path", () => {
      expect(lifecycle.state).toBe("open");

      lifecycle.seal();
      expect(lifecycle.state).toBe("sealed");

      lifecycle.start();
      expect(lifecycle.state).toBe("running");

      lifecycle.stop();
      expect(lifecycle.state).toBe("sealed");
    });

    it("should allow multiple start/stop cycles", () => {
      lifecycle.seal();

      for (let i = 0; i < 3; i++) {
        const startResult = lifecycle.start();
        expect(startResult.success).toBe(true);
        expect(lifecycle.state).toBe("running");

        const stopResult = lifecycle.stop();
        expect(stopResult.success).toBe(true);
        expect(lifecycle.state).toBe("sealed");
      }
    });
  });

  describe("error details", () => {
    it("should provide action and state in error metadata", () => {
      const result = lifecycle.start();

      expect(result.success).toBe(false);
      expect(result.error?.meta).toEqual({
        action: "start",
        state: "open",
        httpStatus: 409,
      });
    });

    it("should use conflict status for lifecycle errors", () => {
      const result = lifecycle.start();

      expect(result.error?.meta.httpStatus).toBe(409);
    });
  });
});
