import { describe, expect, it } from "vitest";
import { intentToHeaders } from "../intent-to-headers.js";

describe("intentToHeaders", () => {
  it("should return HTML headers for html intent", () => {
    const result = intentToHeaders("html");

    expect(result).toEqual({
      "content-type": "text/html; charset=utf-8",
    });
  });

  it("should return JSON headers for json intent", () => {
    const result = intentToHeaders("json");

    expect(result).toEqual({
      "content-type": "application/json; charset=utf-8",
    });
  });

  it("should return text headers for text intent", () => {
    const result = intentToHeaders("text");

    expect(result).toEqual({
      "content-type": "text/plain; charset=utf-8",
    });
  });

  it("should return event-stream headers for event-stream intent", () => {
    const result = intentToHeaders("event-stream");

    expect(result).toEqual({
      "content-type": "text/event-stream",
    });
  });

  it("should return empty object for redirect intent", () => {
    const result = intentToHeaders("redirect");

    expect(result).toEqual({});
  });

  it("should return empty object for unknown intent", () => {
    const result = intentToHeaders("unknown" as any);

    expect(result).toEqual({});
  });
});
