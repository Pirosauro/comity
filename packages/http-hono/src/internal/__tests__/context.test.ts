import type { Context as HonoContext } from "hono";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createHttpContext, headersToRecord } from "../context.js";

describe("headersToRecord", () => {
  it("should convert Headers object to lowercase key record", () => {
    const headers = new Headers({
      "Content-Type": "application/json",
      "X-Custom-Header": "value",
    });

    const result = headersToRecord(headers);

    expect(result).toEqual({
      "content-type": "application/json",
      "x-custom-header": "value",
    });
  });

  it("should handle empty headers", () => {
    const headers = new Headers();
    const result = headersToRecord(headers);

    expect(result).toEqual({});
  });

  it("should handle multiple header values with same name (last wins)", () => {
    const headers = new Headers();
    headers.append("set-cookie", "first=value1");
    headers.append("set-cookie", "second=value2");

    const result = headersToRecord(headers);

    // Headers.entries() iterates all values, but we're converting to lowercase strings
    // so we'll get the last one
    expect(result["set-cookie"]).toBeDefined();
  });

  it("should preserve header values with special characters", () => {
    const headers = new Headers({
      Authorization: "Bearer eyJhbGc...",
      Accept: "text/html, application/xhtml+xml, application/xml;q=0.9",
    });

    const result = headersToRecord(headers);

    expect(result["authorization"]).toBe("Bearer eyJhbGc...");
    expect(result["accept"]).toContain("text/html");
  });

  it("should handle headers with empty values", () => {
    const headers = new Headers({
      "X-Empty": "",
    });

    const result = headersToRecord(headers);

    expect(result["x-empty"]).toBe("");
  });
});

describe("createHttpContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create HttpContext with all properties from HonoContext", () => {
    const honoContext = {
      req: {
        method: "GET",
        url: "http://localhost:3000/api/users?page=1",
        header: vi.fn((name: string) => {
          const headers: Record<string, string> = {
            "content-type": "application/json",
            authorization: "Bearer token",
          };
          return headers[name.toLowerCase()];
        }),
        raw: {
          headers: new Headers({
            "content-type": "application/json",
            authorization: "Bearer token",
            "user-agent": "test-agent",
          }),
          signal: {} as any,
        },
        param: vi.fn((key: string) => {
          const params: Record<string, string> = {
            id: "123",
            name: "test",
          };
          return params[key];
        }),
        query: vi.fn((key: string) => {
          const query: Record<string, string> = {
            page: "1",
            limit: "10",
          };
          return query[key];
        }),
        cookie: vi.fn((name: string) => {
          const cookies: Record<string, string> = {
            sessionId: "abc123",
            theme: "dark",
          };
          return cookies[name];
        }),
      },
      env: {},
    } as unknown as HonoContext;

    const result = createHttpContext(honoContext);

    expect(result.request.id).toBeDefined();
    expect(typeof result.request.id).toBe("string");
    expect(result.request.method).toBe("GET");
    expect(result.request.url.toString()).toContain("/api/users");
    expect(result.request.headers["authorization"]).toBe("Bearer token");
    expect(result.signal).toBeDefined();
    expect(result.state).toEqual({});
  });

  it("should generate unique UUID for each context", () => {
    const honoContext = {
      req: {
        method: "GET",
        url: "http://localhost:3000/test",
        header: vi.fn(() => undefined),
        raw: {
          headers: new Headers(),
          signal: {} as any,
        },
        param: vi.fn(),
        query: vi.fn(),
        cookie: vi.fn(),
      },
      env: {},
    } as unknown as HonoContext;

    const ctx1 = createHttpContext(honoContext);
    const ctx2 = createHttpContext(honoContext);

    expect(ctx1.request.id).not.toBe(ctx2.request.id);
  });

  it("should parse URL correctly with query parameters", () => {
    const honoContext = {
      req: {
        method: "POST",
        url: "http://example.com:8080/api/v1/users?search=john&active=true",
        header: vi.fn(() => undefined),
        raw: {
          headers: new Headers(),
          signal: {} as any,
        },
        param: vi.fn(),
        query: vi.fn(),
        cookie: vi.fn(),
      },
      env: {},
    } as unknown as HonoContext;

    const result = createHttpContext(honoContext);

    expect(result.request.url.toString()).toContain("/api/v1/users");
    expect(result.request.url.toString()).toContain("search=john");
  });

  it("should handle context without cookies", () => {
    const honoContext = {
      req: {
        method: "GET",
        url: "http://localhost:3000/",
        header: vi.fn(() => undefined),
        raw: {
          headers: new Headers(),
          signal: {} as any,
        },
        param: vi.fn(),
        query: vi.fn(),
        cookie: vi.fn(() => undefined),
      },
      env: {},
    } as unknown as HonoContext;

    const result = createHttpContext(honoContext);

    expect(result.request).toBeDefined();
    expect(result.request.cookies).toBeDefined();
  });

  it("should include request signal from raw request", () => {
    const testSignal = {} as any;
    const honoContext = {
      req: {
        method: "GET",
        url: "http://localhost:3000/",
        header: vi.fn(() => undefined),
        raw: {
          headers: new Headers(),
          signal: testSignal,
        },
        param: vi.fn(),
        query: vi.fn(),
        cookie: vi.fn(),
      },
      env: {},
    } as unknown as HonoContext;

    const result = createHttpContext(honoContext);

    expect(result.signal).toBe(testSignal);
  });

  it("should handle all HTTP methods", () => {
    const methods = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"];

    for (const method of methods) {
      const honoContext = {
        req: {
          method,
          url: "http://localhost:3000/",
          header: vi.fn(() => undefined),
          raw: {
            headers: new Headers(),
            signal: {} as any,
          },
          param: vi.fn(),
          query: vi.fn(),
          cookie: vi.fn(),
        },
        env: {},
      } as unknown as HonoContext;

      const result = createHttpContext(honoContext);

      expect(result.request.method).toBe(method);
    }
  });

  it("should handle context with custom headers", () => {
    const honoContext = {
      req: {
        method: "GET",
        url: "http://localhost:3000/",
        header: vi.fn(() => undefined),
        raw: {
          headers: new Headers({
            "x-request-id": "req-123",
            "x-forwarded-for": "192.168.1.1",
            "x-custom": "custom-value",
          }),
          signal: {} as any,
        },
        param: vi.fn(),
        query: vi.fn(),
        cookie: vi.fn(),
      },
      env: {},
    } as unknown as HonoContext;

    const result = createHttpContext(honoContext);

    expect(result.request.headers["x-request-id"]).toBe("req-123");
    expect(result.request.headers["x-forwarded-for"]).toBe("192.168.1.1");
    expect(result.request.headers["x-custom"]).toBe("custom-value");
  });

  it("should provide mutable state object", () => {
    const honoContext = {
      req: {
        method: "GET",
        url: "http://localhost:3000/",
        header: vi.fn(() => undefined),
        raw: {
          headers: new Headers(),
          signal: {} as any,
        },
        param: vi.fn(),
        query: vi.fn(),
        cookie: vi.fn(),
      },
      env: {},
    } as unknown as HonoContext;

    const result = createHttpContext(honoContext);

    // State should be mutable
    result.state["key"] = "value";
    expect(result.state["key"]).toBe("value");
  });
});
