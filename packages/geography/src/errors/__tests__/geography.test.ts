import { describe, expect, it } from "vitest";
import { GeographyError } from "../geography.js";

describe("GeographyError", () => {
  it("exposes reason, message and code", () => {
    const error = new GeographyError("resolution_failed");

    expect(error.code).toBe("geography:resolution_failed");
    expect(error.message).toBe("Geographic resolution failed");
    expect(error.meta).toMatchObject({ reason: "resolution_failed" });
  });

  it("merges additional meta into the error", () => {
    const error = new GeographyError("resolution_failed", {
      details: { countryCode: "IT" },
    });

    expect(error.meta).toMatchObject({
      reason: "resolution_failed",
      details: { countryCode: "IT" },
    });
  });
});