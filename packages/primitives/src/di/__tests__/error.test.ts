import { describe, expect, it } from "vitest";
import { DiContainerError } from "../error.js";

describe("DiContainerError", () => {
  describe("constructor", () => {
    it("should create error with 'already_registered' reason", () => {
      const error = new DiContainerError("already_registered", { service: "TestService" });

      expect(error.message).toBe("Service already registered");
      expect(error.code).toBe("di-container:already_registered");
    });

    it("should create error with 'not_registered' reason", () => {
      const error = new DiContainerError("not_registered", { service: "TestService" });

      expect(error.message).toBe("Service not registered");
      expect(error.code).toBe("di-container:not_registered");
    });

    it("should include additional metadata", () => {
      const meta = { service: "TestService" };
      const error = new DiContainerError("already_registered", meta);

      expect(error.message).toBe("Service already registered");
      expect(error.code).toBe("di-container:already_registered");
      expect(error.meta.service).toBe("TestService");
    });
  });
});
