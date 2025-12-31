import { describe, it, expect } from "vitest";
import { HEALTH_THRESHOLDS } from "../constants.js";

describe("constants", () => {
  describe("HEALTH_THRESHOLDS", () => {
    it("should have correct degradedMs value", () => {
      expect(HEALTH_THRESHOLDS.degradedMs).toBe(100);
    });

    it("should have correct unhealthyMs value", () => {
      expect(HEALTH_THRESHOLDS.unhealthyMs).toBe(300);
    });

    it("should have unhealthyMs greater than degradedMs", () => {
      expect(HEALTH_THRESHOLDS.unhealthyMs).toBeGreaterThan(
        HEALTH_THRESHOLDS.degradedMs
      );
    });
  });
});
