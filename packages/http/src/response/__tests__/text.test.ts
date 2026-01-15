import { describe, expect, it } from "vitest";
import { text } from "../text.js";

describe("text", () => {
  it("should create text response with default status", () => {
    const result = text("Hello World");

    expect(result).toEqual({
      intent: "text",
      status: 200,
      body: "Hello World",
    });
  });

  it("should create text response with custom status", () => {
    const result = text("Not Found", 404);

    expect(result).toEqual({
      intent: "text",
      status: 404,
      body: "Not Found",
    });
  });

  it("should create text response with headers", () => {
    const result = text("Hello", 200, {
      "content-type": "text/plain",
      "custom-header": "value",
    });

    expect(result).toEqual({
      intent: "text",
      status: 200,
      body: "Hello",
      headers: {
        "content-type": "text/plain",
        "custom-header": "value",
      },
    });
  });

  it("should create text response with empty string", () => {
    const result = text("");

    expect(result).toEqual({
      intent: "text",
      status: 200,
      body: "",
    });
  });

  it("should create text response with multiline text", () => {
    const multiline = "Line 1\nLine 2\nLine 3";
    const result = text(multiline, 200);

    expect(result).toEqual({
      intent: "text",
      status: 200,
      body: multiline,
    });
  });

  it("should create text response with empty headers", () => {
    const result = text("Hello", 200, {});

    expect(result).toEqual({
      intent: "text",
      status: 200,
      body: "Hello",
      headers: {},
    });
  });
});
