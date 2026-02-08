import { describe, expect, it } from "vitest";
import { HtmlRenderFailureError } from "../render-failure.js";

describe("HtmlRenderFailureError", () => {
  it("should create error with correct code and message", () => {
    const error = new HtmlRenderFailureError({
      reason: "test-reason",
    });

    expect(error.code).toBe("html:render-failure");
    expect(error.message).toBe("Failed to render HTML view");
    expect(error.meta.reason).toBe("test-reason");
    expect(error.meta.httpStatus).toBe(500);
  });

  it("should include custom meta", () => {
    const error = new HtmlRenderFailureError({
      reason: "custom-reason",
      customField: "value",
    });

    expect(error.meta.reason).toBe("custom-reason");
    expect(error.meta.customField).toBe("value");
  });

  it("should override default httpStatus", () => {
    const error = new HtmlRenderFailureError({
      reason: "test",
      httpStatus: 404,
    });

    expect(error.meta.httpStatus).toBe(404);
  });
});
