import { describe, expect, it } from "vitest";
import { isHttpResponse } from "../is-http-response.js";

describe("isHttpResponse", () => {
  it("should return true for valid HttpResponse with text intent", () => {
    const response = {
      intent: "text",
      status: 200,
      body: "Hello World",
    };

    const result = isHttpResponse(response);

    expect(result).toBe(true);
  });

  it("should return true for valid HttpResponse with json intent", () => {
    const response = {
      intent: "json",
      status: 200,
      body: { message: "Hello" },
    };

    const result = isHttpResponse(response);

    expect(result).toBe(true);
  });

  it("should return true for valid HttpResponse with html intent", () => {
    const response = {
      intent: "html",
      status: 200,
      body: "<h1>Hello</h1>",
    };

    const result = isHttpResponse(response);

    expect(result).toBe(true);
  });

  it("should return true for valid HttpResponse with redirect intent", () => {
    const response = {
      intent: "redirect",
      status: 302,
      location: "/new-path",
    };

    const result = isHttpResponse(response);

    expect(result).toBe(true);
  });

  it("should return true for valid HttpResponse with event-stream intent", () => {
    const response = {
      intent: "event-stream",
      status: 200,
      stream: new ReadableStream(),
    };

    const result = isHttpResponse(response);

    expect(result).toBe(true);
  });

  it("should return false for null", () => {
    const result = isHttpResponse(null);

    expect(result).toBe(false);
  });

  it("should return false for undefined", () => {
    const result = isHttpResponse(undefined);

    expect(result).toBe(false);
  });

  it("should return false for non-object", () => {
    const result = isHttpResponse("string");

    expect(result).toBe(false);
  });

  it("should return false for object without intent", () => {
    const response = {
      status: 200,
      body: "Hello",
    };

    const result = isHttpResponse(response);

    expect(result).toBe(false);
  });

  it("should return false for object with invalid intent", () => {
    const response = {
      intent: "invalid",
      status: 200,
      body: "Hello",
    };

    const result = isHttpResponse(response);

    expect(result).toBe(false);
  });

  it("should return false for object with non-string intent", () => {
    const response = {
      intent: 123,
      status: 200,
      body: "Hello",
    };

    const result = isHttpResponse(response);

    expect(result).toBe(false);
  });
});
