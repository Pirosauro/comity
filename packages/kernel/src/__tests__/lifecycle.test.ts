import { beforeEach, describe, expect, it } from "vitest";
import { KernelInvalidStateError } from "../errors/invalid-state.js";
import { Lifecycle } from "../lifecycle.js";

describe("Lifecycle", () => {
  let lifecycle: Lifecycle;

  beforeEach(() => {
    lifecycle = new Lifecycle();
  });

  describe("constructor", () => {
    it("should create lifecycle with open state", () => {
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

    it("should return false for non-matching state", () => {
      expect(lifecycle.is("sealed")).toBe(false);
      expect(lifecycle.is("running")).toBe(false);
    });
  });

  describe("seal", () => {
    it("should seal from open state", () => {
      const result = lifecycle.seal();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe("sealed");
        expect(lifecycle.state).toBe("sealed");
      }
    });

    it("should fail to seal from sealed state", () => {
      lifecycle.seal();

      const result = lifecycle.seal();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(KernelInvalidStateError);
        expect(result.error.meta.action).toBe("seal");
        expect(result.error.meta.state).toBe("sealed");
      }
    });

    it("should fail to seal from running state", () => {
      lifecycle.seal();
      lifecycle.start();

      const result = lifecycle.seal();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.meta.state).toBe("running");
      }
    });
  });

  describe("start", () => {
    it("should start from sealed state", () => {
      lifecycle.seal();
      const result = lifecycle.start();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe("running");
        expect(lifecycle.state).toBe("running");
      }
    });

    it("should fail to start from open state", () => {
      const result = lifecycle.start();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(KernelInvalidStateError);
        expect(result.error.meta.action).toBe("start");
        expect(result.error.meta.state).toBe("open");
      }
    });

    it("should fail to start from running state", () => {
      lifecycle.seal();
      lifecycle.start();

      const result = lifecycle.start();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.meta.state).toBe("running");
      }
    });
  });

  describe("stop", () => {
    it("should stop from running state", () => {
      lifecycle.seal();
      lifecycle.start();

      const result = lifecycle.stop();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe("sealed");
        expect(lifecycle.state).toBe("sealed");
      }
    });

    it("should fail to stop from open state", () => {
      const result = lifecycle.stop();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(KernelInvalidStateError);
        expect(result.error.meta.action).toBe("stop");
        expect(result.error.meta.state).toBe("open");
      }
    });

    it("should fail to stop from sealed state", () => {
      lifecycle.seal();

      const result = lifecycle.stop();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.meta.state).toBe("sealed");
      }
    });
  });

  describe("state transitions", () => {
    it("should allow open -> sealed -> running -> sealed", () => {
      expect(lifecycle.state).toBe("open");

      lifecycle.seal();
      expect(lifecycle.state).toBe("sealed");

      lifecycle.start();
      expect(lifecycle.state).toBe("running");

      lifecycle.stop();
      expect(lifecycle.state).toBe("sealed");
    });

    it("should not allow invalid transitions", () => {
      // Cannot start from open
      expect(lifecycle.start().success).toBe(false);

      // Seal first
      lifecycle.seal();

      // Cannot seal again
      expect(lifecycle.seal().success).toBe(false);

      // Start
      lifecycle.start();

      // Cannot start again
      expect(lifecycle.start().success).toBe(false);

      // Stop
      lifecycle.stop();

      // Cannot stop again
      expect(lifecycle.stop().success).toBe(false);
    });
  });
});
