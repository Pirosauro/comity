import { describe, expect, it } from "vitest";
import { html } from "../html.js";

describe("html", () => {
  it("should create HTML response with default status", () => {
    const result = html("<h1>Hello World</h1>");

    expect(result).toEqual({
      intent: "html",
      status: 200,
      body: "<h1>Hello World</h1>",
    });
  });

  it("should create HTML response with custom status", () => {
    const result = html("<h1>Error</h1>", 404);

    expect(result).toEqual({
      intent: "html",
      status: 404,
      body: "<h1>Error</h1>",
    });
  });

  it("should create HTML response with headers", () => {
    const result = html("<h1>Hello</h1>", 200, {
      "content-type": "text/html",
      "custom-header": "value",
    });

    expect(result).toEqual({
      intent: "html",
      status: 200,
      body: "<h1>Hello</h1>",
      headers: {
        "content-type": "text/html",
        "custom-header": "value",
      },
    });
  });

  it("should create HTML response with empty headers", () => {
    const result = html("<h1>Hello</h1>", 200, {});

    expect(result).toEqual({
      intent: "html",
      status: 200,
      body: "<h1>Hello</h1>",
      headers: {},
    });
  });
});
