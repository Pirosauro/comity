import type { HttpResponse } from "@comity/http";
import type { Context as HonoContext } from "hono";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mapHttpResponseToHono } from "../map-response.js";

// Mock hono/cookie
vi.mock("hono/cookie");

// Import the mocked function
import { setCookie } from "hono/cookie";

const setCookieMock = vi.mocked(setCookie);

describe("mapHttpResponseToHono", () => {
  let mockContext: HonoContext;

  beforeEach(() => {
    vi.clearAllMocks();

    mockContext = {
      redirect: vi.fn((url: string, status?: number) => {
        return new Response(null, {
          status: status || 302,
          headers: { location: url },
        });
      }),
      req: {
        raw: {
          signal: {} as any,
        },
      },
    } as unknown as HonoContext;
  });

  describe("basic response mapping", () => {
    it("should map response with status and headers", () => {
      const response: HttpResponse = {
        status: 201,
        headers: {
          "content-type": "application/json",
          "x-custom": "value",
        },
        body: { message: "created" },
      };

      const result = mapHttpResponseToHono(mockContext, response);

      expect(result.status).toBe(201);
      expect(result.headers.get("content-type")).toBe("application/json");
      expect(result.headers.get("x-custom")).toBe("value");
    });

    it("should use 200 as default status", () => {
      const response: HttpResponse = {
        headers: {},
        body: "OK",
      };

      const result = mapHttpResponseToHono(mockContext, response);

      expect(result.status).toBe(200);
    });

    it("should return plain text when body is string", () => {
      const response: HttpResponse = {
        status: 200,
        headers: { "content-type": "text/plain" },
        body: "Hello World",
      };

      const result = mapHttpResponseToHono(mockContext, response);

      expect(result.headers.get("content-type")).toBe("text/plain");
    });

    it("should handle Uint8Array body", () => {
      const buffer = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
      const response: HttpResponse = {
        status: 200,
        headers: { "content-type": "application/octet-stream" },
        body: buffer,
      };

      const result = mapHttpResponseToHono(mockContext, response);

      expect(result.status).toBe(200);
      expect(result.headers.get("content-type")).toBe("application/octet-stream");
    });

    it("should handle null body", () => {
      const response: HttpResponse = {
        status: 204,
        headers: {},
        body: null,
      };

      const result = mapHttpResponseToHono(mockContext, response);

      expect(result.status).toBe(204);
    });

    it("should handle undefined body", () => {
      const response: HttpResponse = {
        status: 204,
        headers: {},
      };

      const result = mapHttpResponseToHono(mockContext, response);

      expect(result.status).toBe(204);
    });
  });

  describe("JSON response handling", () => {
    it("should convert object body to JSON", () => {
      const response: HttpResponse = {
        status: 200,
        headers: {},
        body: { id: 1, name: "test" },
      };

      const result = mapHttpResponseToHono(mockContext, response);

      expect(result.headers.get("content-type")).toBe("application/json; charset=utf-8");
    });

    it("should not override existing content-type for JSON bodies", () => {
      const response: HttpResponse = {
        status: 200,
        headers: { "content-type": "application/hal+json" },
        body: { id: 1, name: "test" },
      };

      const result = mapHttpResponseToHono(mockContext, response);

      expect(result.headers.get("content-type")).toBe("application/hal+json");
    });

    it("should handle array body as JSON", () => {
      const response: HttpResponse = {
        status: 200,
        headers: {},
        body: [{ id: 1 }, { id: 2 }],
      };

      const result = mapHttpResponseToHono(mockContext, response);

      expect(result.headers.get("content-type")).toBe("application/json; charset=utf-8");
    });

    it("should handle nested objects", () => {
      const response: HttpResponse = {
        status: 200,
        headers: {},
        body: {
          meta: { timestamp: "2024-01-01", version: 1 },
          data: [{ id: 1, nested: { value: "test" } }],
        },
      };

      const result = mapHttpResponseToHono(mockContext, response);

      expect(result.headers.get("content-type")).toBe("application/json; charset=utf-8");
    });
  });

  describe("redirect handling", () => {
    it("should handle redirect responses with location header and 3xx status", () => {
      const response: HttpResponse = {
        status: 301,
        headers: { location: "/new-path" },
        body: null,
      };

      const result = mapHttpResponseToHono(mockContext, response);

      expect(mockContext.redirect).toHaveBeenCalledWith("/new-path", 301);
    });

    it("should handle 302 redirect", () => {
      const response: HttpResponse = {
        status: 302,
        headers: { location: "https://example.com" },
        body: null,
      };

      mapHttpResponseToHono(mockContext, response);

      expect(mockContext.redirect).toHaveBeenCalledWith("https://example.com", 302);
    });

    it("should handle 303 see-other redirect", () => {
      const response: HttpResponse = {
        status: 303,
        headers: { location: "/other" },
        body: null,
      };

      mapHttpResponseToHono(mockContext, response);

      expect(mockContext.redirect).toHaveBeenCalledWith("/other", 303);
    });

    it("should handle 304 not-modified redirect", () => {
      const response: HttpResponse = {
        status: 304,
        headers: { location: "unchanged" },
        body: null,
      };

      mapHttpResponseToHono(mockContext, response);

      expect(mockContext.redirect).toHaveBeenCalledWith("unchanged", 304);
    });

    it("should not treat non-redirect status as redirect", () => {
      const response: HttpResponse = {
        status: 200,
        headers: { location: "/path" },
        body: "content",
      };

      const result = mapHttpResponseToHono(mockContext, response);

      expect(mockContext.redirect).not.toHaveBeenCalled();
      expect(result.status).toBe(200);
    });

    it("should not redirect without location header", () => {
      const response: HttpResponse = {
        status: 301,
        headers: {},
        body: null,
      };

      const result = mapHttpResponseToHono(mockContext, response);

      expect(mockContext.redirect).not.toHaveBeenCalled();
    });

    it("should not redirect with status code 399", () => {
      const response: HttpResponse = {
        status: 400,
        headers: { location: "/path" },
        body: null,
      };

      const result = mapHttpResponseToHono(mockContext, response);

      expect(mockContext.redirect).not.toHaveBeenCalled();
    });
  });

  describe("stream handling", () => {
    it("should handle ReadableStream body", () => {
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode("Hello"));
          controller.close();
        },
      });

      const response: HttpResponse = {
        status: 200,
        headers: { "content-type": "text/plain" },
        body: stream,
      };

      const result = mapHttpResponseToHono(mockContext, response);

      expect(result.status).toBe(200);
      expect(result.headers.get("content-type")).toBe("text/plain");
    });

    it("should attach abort listener for stream with abort callback", () => {
      const stream = new ReadableStream({
        start(controller) {
          controller.close();
        },
      });

      const abortCallback = vi.fn();

      const response: HttpResponse = {
        status: 200,
        headers: {},
        body: stream,
        abort: abortCallback,
      };

      // Update mock to have addEventListener
      mockContext.req.raw.signal = {
        addEventListener: vi.fn(),
      };

      mapHttpResponseToHono(mockContext, response);

      expect(mockContext.req.raw.signal.addEventListener).toHaveBeenCalledWith(
        "abort",
        abortCallback
      );
    });

    it("should not attach abort listener for stream without abort callback", () => {
      const stream = new ReadableStream({
        start(controller) {
          controller.close();
        },
      });

      const response: HttpResponse = {
        status: 200,
        headers: {},
        body: stream,
      };

      // Update mock to have addEventListener
      mockContext.req.raw.signal = {
        addEventListener: vi.fn(),
      };

      mapHttpResponseToHono(mockContext, response);

      expect(mockContext.req.raw.signal.addEventListener).not.toHaveBeenCalled();
    });
  });

  describe("cookie handling", () => {
    it("should set cookies from response", () => {
      const response: HttpResponse = {
        status: 200,
        headers: {},
        cookies: {
          sessionId: {
            value: "abc123",
            path: "/",
            maxAge: 3600,
          },
        },
        body: "OK",
      };

      mapHttpResponseToHono(mockContext, response);

      expect(setCookieMock).toHaveBeenCalledWith(mockContext, "sessionId", "abc123", {
        path: "/",
        maxAge: 3600,
      });
    });

    it("should set multiple cookies", () => {
      const response: HttpResponse = {
        status: 200,
        headers: {},
        cookies: {
          sessionId: { value: "abc123" },
          theme: { value: "dark", httpOnly: true },
        },
        body: "OK",
      };

      mapHttpResponseToHono(mockContext, response);

      expect(setCookieMock).toHaveBeenCalledTimes(2);
    });

    it("should handle secure and httpOnly flags", () => {
      const response: HttpResponse = {
        status: 200,
        headers: {},
        cookies: {
          auth: {
            value: "token",
            secure: true,
            httpOnly: true,
            sameSite: "Strict",
          },
        },
        body: "OK",
      };

      mapHttpResponseToHono(mockContext, response);

      expect(setCookieMock).toHaveBeenCalledWith(
        mockContext,
        "auth",
        "token",
        expect.objectContaining({
          secure: true,
          httpOnly: true,
          sameSite: "Strict",
        })
      );
    });

    it("should handle empty cookies object", () => {
      const response: HttpResponse = {
        status: 200,
        headers: {},
        cookies: {},
        body: "OK",
      };

      mapHttpResponseToHono(mockContext, response);

      expect(setCookieMock).not.toHaveBeenCalled();
    });
  });

  describe("integration scenarios", () => {
    it("should handle full response with headers, cookies, and body", () => {
      const response: HttpResponse = {
        status: 201,
        headers: {
          "x-custom": "header-value",
        },
        cookies: {
          token: { value: "xyz789" },
        },
        body: { id: "new-resource", created: true },
      };

      const result = mapHttpResponseToHono(mockContext, response);

      expect(result.status).toBe(201);
      expect(result.headers.get("x-custom")).toBe("header-value");
      expect(result.headers.get("content-type")).toBe("application/json; charset=utf-8");
      expect(setCookieMock).toHaveBeenCalled();
    });

    it("should handle error response with JSON body", () => {
      const response: HttpResponse = {
        status: 400,
        headers: {},
        body: {
          error: "Bad Request",
          details: "Missing required field",
        },
      };

      const result = mapHttpResponseToHono(mockContext, response);

      expect(result.status).toBe(400);
      expect(result.headers.get("content-type")).toBe("application/json; charset=utf-8");
    });

    it("should preserve case-sensitive header values", () => {
      const response: HttpResponse = {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": "id=abc123",
          "X-API-Key": "secret",
        },
        body: { message: "ok" },
      };

      const result = mapHttpResponseToHono(mockContext, response);

      expect(result.headers.get("content-type")).toBe("application/json");
      expect(result.headers.get("x-api-key")).toBe("secret");
    });
  });
});
