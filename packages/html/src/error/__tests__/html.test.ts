import { describe, expect, it } from "vitest";
import { HtmlError } from "../html.js";

describe("HtmlError", () => {
  it("should create error with 'no_renderer' reason", () => {
    const error = new HtmlError("no_renderer");

    expect(error.code).toBe("html:no_renderer");
    expect(error.message).toBe("No renderer available for the requested view");
    expect(error.meta.reason).toBe("no_renderer");
    expect(error.meta.httpStatus).toBe(500);
  });

  it("should create error with 'render_error' reason", () => {
    const error = new HtmlError("render_error");

    expect(error.code).toBe("html:render_error");
    expect(error.message).toBe("An error occurred while rendering the view");
    expect(error.meta.reason).toBe("render_error");
    expect(error.meta.httpStatus).toBe(500);
  });

  it("should create error with 'timeout' reason", () => {
    const error = new HtmlError("timeout");

    expect(error.code).toBe("html:timeout");
    expect(error.message).toBe("The rendering process timed out");
    expect(error.meta.reason).toBe("timeout");
    expect(error.meta.httpStatus).toBe(504);
  });

  it("should merge additional metadata", () => {
    const error = new HtmlError("render_error", { context: { violation: "test context" } });

    expect(error.meta.reason).toBe("render_error");
    expect(error.meta.context?.violation).toBe("test context");
  });

  it("should override httpStatus with custom metadata", () => {
    const error = new HtmlError("no_renderer", { httpStatus: 503 });

    expect(error.meta.httpStatus).toBe(503);
  });

  it("should be instance of BaseError", () => {
    const error = new HtmlError("no_renderer");

    expect(error).toBeInstanceOf(Error);
  });
});
