import { describe, expect, it } from "vitest";
import { ContainerError } from "../error.js";

describe("ContainerError", () => {
  describe("constructor", () => {
    it("should create error with 'already_registered' reason", () => {
      const error = new ContainerError("already_registered");

      expect(error.message).toBe("Service already registered");
      expect(error.code).toBe("di-container:already_registered");
    });

    it("should create error with 'not_registered' reason", () => {
      const error = new ContainerError("not_registered");

      expect(error.message).toBe("Service not registered");
      expect(error.code).toBe("di-container:not_registered");
    });

    it("should include additional metadata", () => {
      const meta = { service: "MyService" };
      const error = new ContainerError("already_registered", meta);

      expect(error.message).toBe("Service already registered");
      expect(error.code).toBe("di-container:already_registered");
      expect(error.meta.service).toBe("MyService");
    });

    it("should merge metadata with reason", () => {
      const meta = { context: "bootstrap" };
      const error = new ContainerError("not_registered", meta);

      expect(error.meta.context).toBe("bootstrap");
    });
  });
});
