import { describe, expect, it } from "vitest";
import { isStreamingResponse } from "../is-streaming-response.ts";

describe("isStreamingResponse", () => {
  it("should return true for text streaming response", () => {
    const response = {
      intent: "text" as const,
      status: 200,
      stream: new ReadableStream(),
      abort: () => {},
    };

    const result = isStreamingResponse(response);

    expect(result).toBe(true);
  });

  it("should return true for json streaming response", () => {
    const response = {
      intent: "json" as const,
      status: 200,
      stream: new ReadableStream(),
      abort: () => {},
    };

    const result = isStreamingResponse(response);

    expect(result).toBe(true);
  });

  it("should return true for html streaming response", () => {
    const response = {
      intent: "html" as const,
      status: 200,
      stream: new ReadableStream(),
      abort: () => {},
    };

    const result = isStreamingResponse(response);

    expect(result).toBe(true);
  });

  it("should return false for static text response", () => {
    const response = {
      intent: "text" as const,
      status: 200,
      body: "Hello World",
    };

    const result = isStreamingResponse(response);

    expect(result).toBe(false);
  });

  it("should return false for static json response", () => {
    const response = {
      intent: "json" as const,
      status: 200,
      body: { message: "Hello" },
    };

    const result = isStreamingResponse(response);

    expect(result).toBe(false);
  });

  it("should return false for static html response", () => {
    const response = {
      intent: "html" as const,
      status: 200,
      body: "<h1>Hello</h1>",
    };

    const result = isStreamingResponse(response);

    expect(result).toBe(false);
  });

  it("should return false for redirect response", () => {
    const response: any = {
      intent: "redirect" as const,
      status: 302,
      location: "/new-path",
    };

    const result = isStreamingResponse(response);

    expect(result).toBe(false);
  });

  it("should return false for response without stream property", () => {
    const response = {
      intent: "text" as const,
      status: 200,
      body: "Hello",
    };

    const result = isStreamingResponse(response);

    expect(result).toBe(false);
  });

  it("should return false for null", () => {
    const result = isStreamingResponse(null as any);

    expect(result).toBe(false);
  });

  it("should return false for undefined", () => {
    const result = isStreamingResponse(undefined as any);

    expect(result).toBe(false);
  });
});
