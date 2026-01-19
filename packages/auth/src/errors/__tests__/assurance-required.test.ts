import { describe, expect, it } from "vitest";
import { AssuranceRequiredError } from "../assurance-required.js";

describe("AssuranceRequiredError", () => {
  it("should create error with default message", () => {
    const error = new AssuranceRequiredError();

    expect(error.message).toBe("Higher assurance required");
    expect(error.code).toBe("auth:assurance_required");
    expect(error.meta.httpStatus).toBe(403);
  });

  it("should create error with metadata", () => {
    const error = new AssuranceRequiredError({
      reason: "insufficient",
      policy: "score",
    });

    expect(error.meta["reason"]).toBe("insufficient");
    expect(error.meta["policy"]).toBe("score");
  });

  it("should preserve additional metadata fields", () => {
    const error = new AssuranceRequiredError({
      reason: "insufficient",
      policy: "score",
      currentScore: 1,
      requiredScore: 5,
    });

    expect(error.meta["currentScore"]).toBe(1);
    expect(error.meta["requiredScore"]).toBe(5);
  });
});
